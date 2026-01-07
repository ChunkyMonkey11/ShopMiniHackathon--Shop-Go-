/**
 * useAppInitialization Hook
 * 
 * Centralized hook that manages all app initialization processes:
 * - Authentication (JWT token and public ID)
 * - Profile check
 * - Friends fetch
 * - Product feed sync (non-blocking)
 * 
 * Enforces minimum 2-second display time for smooth UX.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useFriendRequests } from './useFriendRequests'
import { useProductFeedSync } from './useProductFeedSync' // Starts background sync automatically
import { apiRequestJson } from '../utils/apiClient'

interface Friend {
  id: string
  friend_id: string
  shop_public_id: string
  friend_profile: {
    username: string
    display_name: string
    profile_pic: string
    shop_public_id: string
  }
  created_at: string
}

interface UseAppInitializationReturn {
  isInitializing: boolean
  error: string | null
  initializationData: {
    hasProfile: boolean
    publicId?: string
    friends?: Friend[]
  } | null
  retry: () => void
}

const MINIMUM_DISPLAY_TIME_MS = 2000 // 2 seconds as requested

export function useAppInitialization(): UseAppInitializationReturn {
  const { getValidToken, authData } = useAuth()
  const { refreshData: refreshFriends } = useFriendRequests()
  // useProductFeedSync() starts background product sync automatically (non-blocking)
  useProductFeedSync()
  
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initializationData, setInitializationData] = useState<{
    hasProfile: boolean
    publicId?: string
    friends?: Friend[]
  } | null>(null)
  
  const hasInitializedRef = useRef(false)
  const initializationStartTimeRef = useRef<number | null>(null)
  const retryCountRef = useRef(0)

  /**
   * Retry authentication with exponential backoff
   * Silently retries without showing errors to user
   */
  const getValidTokenWithRetry = useCallback(async (): Promise<string> => {
    const MAX_AUTH_RETRIES = 3
    const AUTH_RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt < MAX_AUTH_RETRIES; attempt++) {
      try {
        const token = await getValidToken()
        return token
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Authentication failed')
        console.warn(`⚠️ Authentication attempt ${attempt + 1}/${MAX_AUTH_RETRIES} failed, retrying...`)
        
        // Don't wait on last attempt
        if (attempt < MAX_AUTH_RETRIES - 1) {
          const delay = AUTH_RETRY_DELAYS[attempt] || AUTH_RETRY_DELAYS[AUTH_RETRY_DELAYS.length - 1]
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    // If all retries exhausted, throw the last error
    throw lastError || new Error('Authentication failed after retries')
  }, [getValidToken])

  const initialize = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (hasInitializedRef.current) {
      return
    }
    
    // Mark as initializing immediately to prevent duplicate calls
    hasInitializedRef.current = true

    console.log('🚀 Starting app initialization...')
    initializationStartTimeRef.current = Date.now()
    setIsInitializing(true)
    setError(null)

    try {
      // Step 1: Authentication - Get JWT token and public ID with automatic retries
      console.log('🔐 Step 1: Authenticating...')
      await getValidTokenWithRetry()
      console.log('✅ Authentication complete')

      // Wait a moment for authData to be set (it's set asynchronously)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Step 2: Check profile status
      console.log('📋 Step 2: Checking profile...')
      let hasProfile: boolean | undefined = undefined
      let publicId: string | undefined

      // Try to get hasProfile from authData first
      if (authData) {
        publicId = authData.publicId
        // Only use authData.hasProfile if it's explicitly set (not undefined)
        if (authData.hasProfile !== undefined) {
          hasProfile = authData.hasProfile
          console.log('✅ Got profile status from authData:', hasProfile)
        } else {
          console.log('⚠️ authData exists but hasProfile is undefined, will check endpoint')
        }
      }

      // If we don't have hasProfile yet (either no authData or hasProfile was undefined), check endpoint
      if (hasProfile === undefined) {
        console.log('📡 Checking profile via check-profile endpoint...')
        try {
          const result = await apiRequestJson<{ hasProfile?: boolean; profile?: { shop_public_id?: string } }>('check-profile', {
            method: 'GET'
          })
          
          hasProfile = result.hasProfile ?? false
          if (result.profile?.shop_public_id) {
            publicId = result.profile.shop_public_id
          }
          console.log('✅ Got profile status from check-profile:', hasProfile)
        } catch (error) {
          console.error('❌ Error calling check-profile:', error)
          // Default to false if check fails (show onboarding)
          hasProfile = false
        }
      }
      
      // Ensure hasProfile is always a boolean
      if (hasProfile === undefined) {
        hasProfile = false
      }

      // Step 3: Fetch friends (non-blocking - can fail gracefully)
      console.log('👥 Step 3: Fetching friends...')
      let friendsData: Friend[] | undefined
      try {
        // Fetch friends directly via API
        const friendsResult = await apiRequestJson<{ friends?: Friend[] }>('get-friends', {
          method: 'GET'
        })
        
        friendsData = friendsResult.friends || []
        console.log('✅ Friends fetched:', friendsData?.length ?? 0)
      } catch (friendsError) {
        console.warn('⚠️ Friends fetch failed (non-critical):', friendsError)
        // Don't throw - friends fetch is optional
      }
      
      // Also trigger the hook's refresh for consistency (non-blocking)
      refreshFriends().catch(err => {
        console.warn('⚠️ Hook friends refresh failed (non-critical):', err)
      })

      // Step 4: Enforce minimum display time
      const elapsedTime = Date.now() - (initializationStartTimeRef.current || Date.now())
      const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME_MS - elapsedTime)
      
      if (remainingTime > 0) {
        console.log(`⏳ Waiting ${remainingTime}ms to meet minimum display time...`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // Step 5: Set initialization data
      const data = {
        hasProfile,
        publicId,
        friends: friendsData || []
      }
      
      setInitializationData(data)
      setIsInitializing(false)
      // Reset retry count on successful initialization
      retryCountRef.current = 0
      
      console.log('✅ App initialization complete:', {
        hasProfile,
        publicId,
        friendsCount: friendsData?.length ?? 0
      })

    } catch (err) {
      console.error('❌ Initialization error:', err)
      // Instead of setting error, retry after a delay
      // This keeps the loading screen showing and retries silently
      console.log('🔄 Retrying initialization silently...')
      
      // Reset flag to allow retry
      hasInitializedRef.current = false
      
      // Calculate exponential backoff delay (starts at 2s, doubles each time, max 30s)
      const retryDelay = Math.min(30000, 2000 * Math.pow(2, retryCountRef.current))
      retryCountRef.current++
      
      console.log(`⏳ Retrying in ${retryDelay}ms (attempt ${retryCountRef.current})...`)
      
      // Retry after delay - keep isInitializing true so loading screen stays visible
      setTimeout(() => {
        initialize()
      }, retryDelay)
      
      // Never set error state - user won't see any error message
      // Keep isInitializing true - loading screen stays visible
    }
  }, [authData, refreshFriends, getValidTokenWithRetry])

  // Run initialization on mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      initialize()
    }
  }, [initialize])

  // Note: Product feed sync is automatically started by useProductFeedSync() hook
  // It runs in the background and doesn't block initialization

  const retry = useCallback(() => {
    hasInitializedRef.current = false
    setInitializationData(null)
    initialize()
  }, [initialize])

  return {
    isInitializing,
    error,
    initializationData,
    retry
  }
}


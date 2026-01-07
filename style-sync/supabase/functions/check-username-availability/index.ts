// Edge Function: check-username-availability
// Purpose: Check if a username is available and suggest alternatives if taken
// Called from: OnboardingPage.tsx during username input

import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { verifyJWT, extractBearerToken } from '../_shared/jwt-utils.ts'
import { errorResponse, successResponse, requireMethod } from '../_shared/responses.ts'

// Helper function to generate username suggestions
async function generateSuggestions(
  baseUsername: string,
  supabase: any,
  maxSuggestions: number = 3
): Promise<string[]> {
  const suggestions: string[] = []
  const attempts = 20 // Try up to 20 variations to find available ones
  
  // Generate variations
  const variations: string[] = []
  const randomNum1 = Math.floor(Math.random() * 1000)
  const randomNum2 = Math.floor(Math.random() * 100)
  const timestamp = Date.now().toString().slice(-4)
  
  variations.push(`${baseUsername}_${randomNum1}`)
  variations.push(`${baseUsername}${randomNum2}`)
  variations.push(`${baseUsername}_${timestamp}`)
  
  // Add more variations if needed
  for (let i = 0; i < attempts && suggestions.length < maxSuggestions; i++) {
    const randomNum = Math.floor(Math.random() * 10000)
    variations.push(`${baseUsername}_${randomNum}`)
  }
  
  // Check each variation for availability
  for (const suggestion of variations) {
    if (suggestions.length >= maxSuggestions) break
    
    // Validate format (3+ chars, alphanumeric + underscores only)
    if (suggestion.length < 3 || !/^[a-zA-Z0-9_]+$/.test(suggestion)) {
      continue
    }
    
    // Check if available
    const { data, error } = await supabase
      .from('userprofiles')
      .select('username')
      .eq('username', suggestion.toLowerCase())
      .maybeSingle()
    
    // If no error and no data, username is available
    if (!error && !data) {
      suggestions.push(suggestion.toLowerCase())
    }
  }
  
  return suggestions.slice(0, maxSuggestions)
}

// Main function that handles incoming requests
Deno.serve(async (req) => {
  // ============================================
  // STEP 1: HANDLE CORS PREFLIGHT
  // ============================================
  if (req.method === 'OPTIONS') {
    try {
      const corsResponse = handleCors(req)
      if (corsResponse) {
        return corsResponse
      }
      return new Response(null, {
        status: 200,
        headers: corsHeaders()
      })
    } catch (error) {
      console.error('Error handling OPTIONS request:', error)
      return new Response(null, {
        status: 200,
        headers: corsHeaders()
      })
    }
  }

  try {
    // ============================================
    // STEP 2: VERIFY HTTP METHOD
    // ============================================
    const methodCheck = requireMethod(req, 'GET')
    if (methodCheck) return methodCheck

    // ============================================
    // STEP 3: VERIFY JWT TOKEN
    // ============================================
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return errorResponse('Missing authorization header', 401)
    }

    const token = extractBearerToken(authHeader)
    if (!token) {
      return errorResponse('Invalid authorization header format', 401)
    }
    
    const jwtSecret = Deno.env.get('JWT_SECRET_KEY')
    if (!jwtSecret) {
      return errorResponse('Server configuration error: Missing JWT secret', 500)
    }
    
    let payload
    try {
      payload = await verifyJWT(token, jwtSecret)
    } catch (error) {
      console.error('JWT verification failed:', error)
      return errorResponse('Invalid or expired token', 401)
    }
    
    if (!payload) {
      return errorResponse('Invalid or expired token', 401)
    }
    
    // ============================================
    // STEP 4: EXTRACT USERNAME FROM QUERY PARAMS
    // ============================================
    const url = new URL(req.url)
    const usernameParam = url.searchParams.get('username')
    
    if (!usernameParam) {
      return errorResponse('Missing username parameter', 400)
    }
    
    // Normalize username (lowercase, trim)
    const normalizedUsername = usernameParam.toLowerCase().trim()
    
    // Validate format
    if (normalizedUsername.length < 3) {
      return errorResponse('Username must be at least 3 characters', 400)
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      return errorResponse('Username can only contain letters, numbers, and underscores', 400)
    }
    
    // ============================================
    // STEP 5: INITIALIZE SUPABASE CLIENT
    // ============================================
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('Server configuration error', 500)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // ============================================
    // STEP 6: CHECK USERNAME AVAILABILITY
    // ============================================
    const { data, error } = await supabase
      .from('userprofiles')
      .select('username')
      .eq('username', normalizedUsername)
      .maybeSingle()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error)
      return errorResponse(`Failed to check username: ${error.message}`, 500)
    }
    
    // Username is available if no data found
    if (!data) {
      return successResponse({
        available: true,
        suggestions: []
      })
    }
    
    // Username is taken - generate suggestions
    console.log(`Username "${normalizedUsername}" is already taken, generating suggestions...`)
    const suggestions = await generateSuggestions(normalizedUsername, supabase, 3)
    
    return successResponse({
      available: false,
      suggestions: suggestions
    })

  } catch (error) {
    console.error('Error in check-username-availability:', error)
    return errorResponse('Internal server error', 500)
  }
})

// DEPLOYMENT INSTRUCTIONS:
// npx supabase functions deploy check-username-availability --no-verify-jwt

// TESTING:
// First get a JWT token by calling the auth endpoint with a Shop Mini token
// Then test this endpoint:
// curl -X GET "https://fhyisvyhahqxryanjnby.supabase.co/functions/v1/check-username-availability?username=testuser" \
//   -H "Authorization: Bearer YOUR_JWT_TOKEN"




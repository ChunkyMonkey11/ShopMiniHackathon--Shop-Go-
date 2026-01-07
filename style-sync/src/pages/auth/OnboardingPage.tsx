import { useState, useEffect, useRef, useCallback } from 'react'
import { useCurrentUser, Button, Input, Card, Image } from '@shopify/shop-minis-react'
import { useAuth } from '../../hooks/useAuth'

interface OnboardingPageProps {
    onComplete: () => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
    const { currentUser, loading } = useCurrentUser()
    const { getValidToken } = useAuth()
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [interests, setInterests] = useState<string[]>([])
    const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'NEUTRAL' | ''>('')
    const [customInterest, setCustomInterest] = useState('')
    const [activeBubbleIndex, setActiveBubbleIndex] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPublic, setIsPublic] = useState(true)
    const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const hasInitializedUsername = useRef(false)
    
    const interestOptions = [
        'Fashion', 'Streetwear', 'Vintage', 'Luxury', 'Sustainable', 
        'Athletic', 'Formal', 'Accessories', 'Shoes', 'Jewelry',
        'Beauty', 'Lifestyle', 'Travel', 'Art', 'Music',
        'Urban', 'Sneakers', 'Comfort', 'Everyday', 'Designer', 
        'Premium', 'Retro', 'Thrift'
    ]
    
    const validateUsername = (value: string) => {
        if (!value) return 'Username is required'
        if (value.length < 3) return 'Username must be at least 3 characters'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores'
        return null
    }
    
    // Helper function to convert displayName to valid username format
    const formatDisplayNameToUsername = (displayName: string): string => {
        return displayName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
            .replace(/_+/g, '_') // Replace consecutive underscores with single underscore
            .replace(/^_|_$/g, '') // Remove leading/trailing underscores
            .slice(0, 20) // Limit length
    }
    
    // Function to check username availability
    const checkUsernameAvailability = useCallback(async (usernameToCheck: string): Promise<{ available: boolean; suggestions: string[] } | null> => {
        if (!usernameToCheck || usernameToCheck.length < 3) return null
        
        try {
            const token = await getValidToken()
            const response = await fetch(
                `https://fhyisvyhahqxryanjnby.supabase.co/functions/v1/check-username-availability?username=${encodeURIComponent(usernameToCheck)}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error checking username:', errorData)
                return null
            }
            
            const result = await response.json()
            return result
        } catch (error) {
            console.error('Error checking username availability:', error)
            return null
        }
    }, [getValidToken])
    
    // Initialize username from displayName on mount
    useEffect(() => {
        const initializeUsername = async () => {
            if (hasInitializedUsername.current || !currentUser?.displayName || username) return
            
            hasInitializedUsername.current = true
            const displayName = currentUser.displayName
            const cleanedName = formatDisplayNameToUsername(displayName)
            
            if (cleanedName.length >= 3) {
                setIsCheckingUsername(true)
                const result = await checkUsernameAvailability(cleanedName)
                
                if (result) {
                    if (result.available) {
                        setUsername(cleanedName)
                        setUsernameAvailable(true)
                        setSuggestedUsernames([])
                    } else {
                        setSuggestedUsernames(result.suggestions || [])
                        setUsernameAvailable(false)
                    }
                }
                setIsCheckingUsername(false)
            }
        }
        
        initializeUsername()
    }, [currentUser?.displayName, username, checkUsernameAvailability])
    
    // Handle username change with real-time validation
    const handleUsernameChange = async (value: string) => {
        setUsername(value)
        setUsernameAvailable(null)
        setSuggestedUsernames([])
        
        const error = validateUsername(value)
        if (error) {
            setErrors(prev => ({ ...prev, username: error }))
            return
        }
        
        // Clear username error
        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.username
            return newErrors
        })
        
        // Check availability if valid format
        if (value.length >= 3) {
            setIsCheckingUsername(true)
            const result = await checkUsernameAvailability(value.toLowerCase())
            
            if (result) {
                setUsernameAvailable(result.available)
                if (!result.available) {
                    setSuggestedUsernames(result.suggestions || [])
                    setErrors(prev => ({
                        ...prev,
                        username: 'Username already taken'
                    }))
                } else {
                    setSuggestedUsernames([])
                }
            }
            setIsCheckingUsername(false)
        }
    }
    
    // Handle selecting a suggested username
    const handleSelectSuggestion = async (suggestedUsername: string) => {
        setUsername(suggestedUsername)
        setSuggestedUsernames([])
        await handleUsernameChange(suggestedUsername)
    }



    
    const removeInterest = (interestToRemove: string) => {
        setInterests(prev => prev.filter(interest => interest !== interestToRemove))
    }
    
    const startNewBubble = () => {
        setActiveBubbleIndex(interests.length)
        setCustomInterest('')
    }
    
    const handleBubbleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (customInterest.trim() && !interests.includes(customInterest.trim())) {
                setInterests(prev => [...prev, customInterest.trim()])
                setCustomInterest('')
                setActiveBubbleIndex(null)
            }
        }
        if (e.key === 'Escape') {
            setActiveBubbleIndex(null)
            setCustomInterest('')
        }
    }
    
    const handleBubbleBlur = () => {
        if (customInterest.trim() && !interests.includes(customInterest.trim())) {
            setInterests(prev => [...prev, customInterest.trim()])
        }
        setActiveBubbleIndex(null)
        setCustomInterest('')
    }
    
    const addQuickInterest = (interest: string) => {
        if (!interests.includes(interest)) {
            setInterests(prev => [...prev, interest])
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const usernameError = validateUsername(username)
        if (usernameError) {
            setErrors({ username: usernameError })
            return
        }
        
        setIsSubmitting(true)
        
        try {
            // Get JWT token for authentication
            const token = await getValidToken()
            
            // Prepare profile data
            // Note: We don't send id or shop_public_id - Edge Function handles these
            const profileData = {
                username: username.toLowerCase(),
                display_name: currentUser?.displayName || username,
                profile_pic: currentUser?.avatarImage?.url || '',
                bio: bio.trim() || undefined,
                interests: interests,
                gender: gender || undefined,
                is_public: isPublic,
                created_at: new Date().toISOString()
            }
            
            console.log('Creating profile with data:', profileData)
            
            // Call create-profile Edge Function
            const response = await fetch(
                'https://fhyisvyhahqxryanjnby.supabase.co/functions/v1/create-profile',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ profileData })
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                
                // Handle duplicate username error
                if (response.status === 409 && errorData.error?.includes('Username already exists')) {
                    setErrors({ username: 'Username already taken. Please choose another.' })
                    setIsSubmitting(false)
                    return
                }
                
                throw new Error(errorData.error || 'Failed to create profile')
            }

            const result = await response.json()
            console.log('Profile created:', result.profile)
            
            alert('Profile created successfully!')
            onComplete() // Navigate to main app
            
        } catch (error) {
            console.error('Error:', error)
            setErrors({ general: error instanceof Error ? error.message : 'Failed to create profile. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-lg text-white">Loading user data...</p>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen p-4 max-w-md mx-auto">
            <Card className="pt-0 px-4 pb-4">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="text-center mb-1.5">
                        <h1 className="text-xl font-bold mb-0 text-white">Welcome to Style$ync</h1>
                        <p className="text-white/80 text-xs">Let's set up your style profile</p>
                    </div>
                    
                    {/* User Info Display */}
                    <div className="mb-4 flex flex-col items-center">
                        {currentUser?.avatarImage?.url ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                                <Image 
                                    src={currentUser.avatarImage.url} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                <span className="text-3xl text-gray-500">{currentUser?.displayName?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                        <p className="font-medium text-gray-800 text-lg">{currentUser?.displayName || 'User'}</p>
                    </div>
                    
                    {/* Username Input */}
                    {/*  Right now setting username through field || Per Davids suggestion we should attempt to do two things. 
                        First check if the current users Shop name Name is already in StyleSyncs Db. Use an Index for this. 
                        If it isnt we fill our users name to be their "displayName" , if "displayName" exists in userProfiles we give three options of alternative usernames
                        these can be choosen or the user can fill in their own username in the field below. This can be checked for two things, 1. Valid input, 2. Unique username

                         if displayname not in userprofiles -> make the username display name
                         elif displayname already exists -> suggest alternative usernames built off of the displayname that the user can suggest
                         else allow the user to select their own custom username. just make sure it is not in the user_profiles already. 

                    
                         
                    */}

                    {/* Strip white space later too much according to David. Shopify tightended their standards for Shop app.  */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Username *</label>
                        <div className="relative">
                            <Input
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                placeholder="Your Username"
                                className="w-full rounded-full px-4 py-2.5"
                                aria-invalid={!!errors.username}
                            />
                            {isCheckingUsername && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    Checking...
                                </span>
                            )}
                            {usernameAvailable === true && !isCheckingUsername && username && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600">
                                    ✓ Available
                                </span>
                            )}
                        </div>
                        {errors.username && (
                            <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                        )}
                        
                        {/* Show suggested usernames if displayName was taken */}
                        {suggestedUsernames.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Suggested usernames:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedUsernames.map((suggested) => (
                                        <button
                                            key={suggested}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(suggested)}
                                            className="px-4 py-1.5 text-base bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                                        >
                                            {suggested}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Bio Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Bio (optional)</label>
                        <Input
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about your style..."
                            className="w-full rounded-full px-4 py-2.5"
                        />
                    </div>
                    
                    {/* Interests */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-3">Your Interests</label>
                        
                        {/* Bubble Interface */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Existing Interest Bubbles */}
                            {interests.map((interest, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-4 py-2.5 rounded-full text-base border-2 border-blue-200"
                                >
                                    <span>{interest}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeInterest(interest)}
                                        className="text-blue-600 hover:text-blue-800 ml-1 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            {/* Active Input Bubble */}
                            {activeBubbleIndex !== null && (
                                <div className="bg-blue-50 border-2 border-blue-300 border-dashed px-4 py-2.5 rounded-full text-base">
                                    <input
                                        type="text"
                                        value={customInterest}
                                        onChange={(e) => setCustomInterest(e.target.value)}
                                        onKeyDown={handleBubbleKeyPress}
                                        onBlur={handleBubbleBlur}
                                        placeholder="Type interest..."
                                        className="bg-transparent border-none outline-none text-blue-800 placeholder-blue-400 w-32"
                                        autoFocus
                                    />
                                </div>
                            )}
                            
                            {/* Add New Bubble Button */}
                            {activeBubbleIndex === null && (
                                <button
                                    type="button"
                                    onClick={startNewBubble}
                                    className="bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500 px-4 py-2.5 rounded-full text-base hover:bg-gray-200 hover:border-gray-400 transition-colors"
                                >
                                    + Add Interest
                                </button>
                            )}
                        </div>
                        
                        {/* Simple Quick Add Grid */}
                        <div>
                            <p className="text-sm text-gray-600 mb-4">Quick add:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {interestOptions.map((interest) => {
                                    const isSelected = interests.includes(interest)
                                    
                                    return (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => addQuickInterest(interest)}
                                            disabled={isSelected}
                                            className={`
                                                p-3 text-sm rounded-lg border transition-all duration-300 ease-out
                                                hover:scale-105 hover:shadow-lg
                                                active:scale-95
                                                ${isSelected 
                                                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 shadow-md hover:shadow-lg cursor-pointer'
                                                }
                                            `}
                                        >
                                            {interest}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-3">Gender (optional)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['MALE','FEMALE','NEUTRAL'] as const).map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGender(g)}
                                    className={`p-2 text-sm rounded-lg border transition-colors ${
                                        gender === g
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Non-binary'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Public/Private Profile Toggle */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-3">Profile Visibility</label>
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-medium text-gray-800">Public Profile</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {isPublic 
                                            ? 'Discoverable in Public Profiles tab. Friend requests auto-accept.'
                                            : 'Only discoverable via username search. Friend requests require approval.'
                                        }
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                        isPublic ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                    role="switch"
                                    aria-checked={isPublic}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            isPublic ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Error Display */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {errors.general}
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}
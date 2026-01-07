# Shopify Shop Mini Submission Form - What to Fill In

## Field 1: Description (Required for First Submission)

**Copy and paste this:**

```
StyleSync is a social shopping app that helps users discover and share style with friends. Users create personalized profiles with style interests, follow friends to see their product feeds, and discover new styles through a social network. The app features a unique poker card system where each friend gets a card representing their style profile, making the social shopping experience fun and engaging.
```

---

## Field 2: Video URL (Required)

**Paste your demo video link here:**
- Upload your demo video to YouTube (unlisted) or Loom
- Copy the shareable link
- Paste it in this field

**If you haven't recorded yet:** Use the demo video script from `notes.txt` (lines 120-180)

---

## Field 3: Step-by-Step Testing Instructions (Required)

**Copy and paste this:**

```
Prerequisites:
- Node.js version 20 or higher
- Shop app installed on iOS or Android device
- Git installed
- Internet connection

Setup:
1. Clone repository: git clone https://github.com/ChunkyMonkey11/StyleSync.git
2. Navigate to folder: cd StyleSync/style-sync
3. Install dependencies: npm install
4. Start dev server: npm start
5. Scan QR code displayed in terminal with Shop app
6. Tap "StyleSync" mini in Shop app

Note: If testing locally, ensure Developer Mode is enabled in Shop app settings.

Test Flow 1: Onboarding
1. Complete onboarding form:
   - Enter username (alphanumeric, underscores only)
   - Add bio (optional)
   - Select style interests (e.g., Fashion, Streetwear, Vintage)
   - Choose gender preference (optional)
   - Set profile visibility (Public/Private)
2. Tap "Complete Setup"
Expected Result: 
- Profile created successfully
- Redirected to main dashboard
- Profile picture displays at top
- Feeds Deck button (card icon) visible
- Friends icon visible with badge count

Test Flow 2: Friends
1. Tap Friends icon on main dashboard
2. Navigate to "Discover" tab
3. Tap "Follow" button on a public profile
4. Go to "Send" tab
5. Enter a username and tap "Send Request"
6. Go to "Received" tab
7. Tap "Accept" on an incoming friend request
Expected Result:
- Follow action completes successfully
- Friend request sent and appears in "Send" tab
- Received requests display sender information
- Accepted friend appears in "Mutual" tab
- Friend count badge updates on main dashboard

Test Flow 3: Feeds
1. Tap Feeds Deck button (card icon) on main dashboard
2. Observe dealing animation (cards flying across screen)
3. View friend cards displayed in grid/list
4. Use search bar to filter friends by username
5. Tap on a friend's card
6. Scroll through their product feed
7. Tap on a product card
Expected Result:
- Smooth dealing animation plays on entry
- Friend cards display with profile pictures, usernames, ranks, and suits
- Search filters cards correctly
- Friend feed page shows their card, followed shops, and products
- Product cards display images, titles, prices, and shop names
- Tapping product opens product page in Shop app

Test Flow 4: Profile
1. Tap profile picture on main dashboard
2. View your StyleSync card with rank and suit
3. Tap "View Deck Guide" button
4. Review ranking system (2-Ace) and suits (Spades, Hearts, Diamonds, Clubs)
5. Tap "Edit Profile" button
6. Modify bio and/or interests
7. Tap "Save" button
Expected Result:
- Profile page displays card with current rank/suit
- Deck Guide modal shows all ranks and suits with descriptions
- Profile edit form loads with current data
- Changes save successfully
- Updated profile reflects immediately on profile page
- Changes visible when viewing profile from other screens

Troubleshooting:
- If QR code doesn't work: Ensure device and computer are on same network
- If Mini doesn't load: Check that Developer Mode is enabled in Shop app
- If authentication fails: Ensure Shop app is logged in with valid account
- If products don't display: Verify user has followed shops in Shop app
- Contact: revant.h.patel@gmail.com for technical support

Notes:
- No credentials needed - uses Shop app authentication automatically
- Backend API is pre-configured - no additional setup required
- Each Shop app user account can test independently
- Requires active internet connection for API calls
```

---

## Other Fields You May See:

### Privacy Policy URL
```
https://chunkymonkey11.github.io/StyleSync/privacy.html
```

### Terms of Service URL
```
https://chunkymonkey11.github.io/StyleSync/terms.html
```

### App URL (Your Deployed Frontend)
```
[Your deployed frontend URL - e.g., from Vercel/Netlify]
```

### App Handle
```
stylesync
```

---

## Checklist Before Submitting:

- [ ] Description filled in
- [ ] Video URL added (YouTube unlisted or Loom link)
- [ ] Testing instructions pasted
- [ ] Privacy Policy URL is accessible
- [ ] Terms URL is accessible
- [ ] Frontend is deployed and URL is working
- [ ] All required fields are filled

## After Filling Everything:

1. Review all fields
2. Click "Submit" or "Save"
3. Wait for Shopify review (usually 1-3 business days)
4. Check email for updates


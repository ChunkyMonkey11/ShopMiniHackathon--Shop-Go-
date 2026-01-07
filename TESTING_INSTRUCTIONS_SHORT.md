# Step-by-Step Testing Instructions

## Setup
1. Clone repository: `git clone https://github.com/ChunkyMonkey11/StyleSync.git`
2. Navigate to folder: `cd StyleSync/style-sync`
3. Install dependencies: `npm install`
4. Start dev server: `npm start`
5. Scan QR code with Shop app → Tap "StyleSync" mini

## Test Flows

**Flow 1: Onboarding**
1. Complete onboarding form (username, interests, visibility)
2. Tap "Complete Setup"
3. Expected: Dashboard loads with profile picture, Feeds Deck button, Friends icon

**Flow 2: Friends**
1. Tap Friends icon → "Discover" → Follow a profile
2. "Send" tab → Send friend request
3. "Received" tab → Accept request
4. Expected: Friend appears in "Mutual" tab

**Flow 3: Feeds**
1. Tap Feeds Deck button (observe animation)
2. Tap friend card → View product feed
3. Tap product → Opens in shop
4. Expected: Products display and link correctly

**Flow 4: Profile**
1. Tap profile picture → View card
2. "Edit Profile" → Modify bio/interests → Save
3. Expected: Changes reflect immediately

## Notes
- No credentials needed - uses Shop app authentication
- Backend pre-configured
- Contact: revant.h.patel@gmail.com

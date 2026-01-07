Description:
## Description (required)
StyleSync is a social shopping app where users create style profiles, connect with friends, and discover products through their social network. Each friend gets a unique poker card representing their style profile, making shopping discovery fun and engaging.

Changes Since Last Submission:

1.I have added the icon.png file.

## Video URL (required for first submission and significant changes)
https://drive.google.com/file/d/1MBOBRHVZzSLQHFZ2NQDKwN9nF9g1cvg-/view?usp=sharing

## Step-by-step testing instructions (required)
'''

Setup:
1. Clone repository: git clone
https://github.com/ChunkyMonkey11/StyleSync.git
2. Navigate to folder: cd StyleSync/style-sync
3. Install dependencies: npm install
4. Start dev server: npm start
5. Type Q in terminal to open up a QR code in your browser.
6. Scan QR code displayed in browser and wait for StyleSync to load.

Note: If testing locally, ensure Developer Mode is enabled in Shop app
settings.

Test Flow 1: Onboarding
1. Complete onboarding (username, interests, gender, visibility)
2.Tap Complete Setup
Expected: Profile is created and main dashboard loads

Test Flow 2: Friends
1. Open Friends → Discover
2. Follow a public profile
Expected: Friend request is sent and appears in Friends tabs (Sent/Mutual)

Test Flow 3: Feeds
1. Tap Feeds Deck (card icon)
2. Open a friend's card
3. Tap a product
Expected:
Card dealing animation plays
Friend product feed loads
Product opens in the Shop app

Test Flow 4: Profile
Tap profile picture
View StyleSync card and Deck Guide
Edit bio/interests and save
Expected: Changes save and update immediately

Notes:
Uses Shop app authentication (no credentials needed)

Backend is pre-configured

Internet connection required

Support: revant.h.patel@gmail.com




Reference: RPSMSH

Submitted Saturday, December 20, 2025 at 1:11:56 AM India Standard Time

Next steps
  • Your submission is currently being tested. This may take some time.
  • You can cancel this submission if needed by running the cancel-submission
    command.

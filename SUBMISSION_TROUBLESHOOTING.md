# Shopify Submission Form - Troubleshooting

## If "Submit" Button Doesn't Work

### 1. Check for Hidden Validation Errors
- Scroll through the ENTIRE form page
- Look for red error messages or highlighted fields
- Check if any fields are marked as "required" but empty
- Look for small red text or warning icons

### 2. Required Fields Checklist
Make sure ALL of these are filled:
- [ ] Description (first submission explanation)
- [ ] Video URL (must be a valid URL)
- [ ] Step-by-step testing instructions
- [ ] Privacy Policy URL (must be accessible)
- [ ] Terms URL (must be accessible)
- [ ] App URL (your deployed frontend)
- [ ] App Handle (stylesync)

### 3. Browser Issues
Try these fixes:
- **Clear browser cache** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- **Try a different browser** (Chrome, Firefox, Safari)
- **Disable browser extensions** (ad blockers, privacy tools)
- **Try incognito/private mode**

### 4. Check Browser Console for Errors
1. Press F12 (or Cmd+Option+I on Mac)
2. Go to "Console" tab
3. Look for red error messages
4. Take a screenshot and note what errors appear

### 5. Form-Specific Issues

**If it says "Save" instead of "Submit":**
- Look for a separate "Submit for Review" button elsewhere on the page
- Check if there's a "Distribution" or "App Review" tab
- The form might auto-save drafts - you need to find the actual submit button

**If fields won't save:**
- Make sure you're clicking "Save" after filling each section
- Some forms require saving sections individually before final submit

**If video URL field is problematic:**
- Make sure it's a valid URL (starts with http:// or https://)
- Try the full YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Or Loom URL: `https://www.loom.com/share/VIDEO_ID`

### 6. Network/Connection Issues
- Check your internet connection
- Try refreshing the page
- Don't leave the page open too long (session might expire)

### 7. Alternative Submission Method
If the form still won't work:
- Look for a "Contact Support" or "Help" link
- Email Shopify Partner Support directly
- Check if there's a different submission portal

### 8. Quick Test
Try this minimal test:
1. Fill ONLY the absolutely required fields
2. Use simple test URLs if needed
3. See if it submits with minimal data
4. Then add the full content

---

## Common Shopify Partner Dashboard Issues

### Issue: Form saves but won't submit
**Solution:** Look for a separate "Submit for Review" button in:
- App listing page
- Distribution tab
- App review section

### Issue: "Please complete all required fields" but can't see which ones
**Solution:**
- Scroll to top of form
- Look for section headers with red indicators
- Expand all collapsible sections
- Check if there are tabs you haven't filled

### Issue: Video URL field rejects the URL
**Solution:**
- Make sure video is set to "Unlisted" (not private) on YouTube
- Try the full URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Or use Loom/other video hosting
- Make sure the video is actually accessible (test in incognito)

---

## Still Stuck?

1. **Take screenshots** of:
   - The form page
   - Browser console errors
   - Any error messages

2. **Contact Shopify Partner Support:**
   - Email: partners@shopify.com
   - Or use the support chat in Partner Dashboard

3. **Check Shopify Community Forums:**
   - Search for "Shop Mini submission form not working"
   - Post your issue with screenshots

---

## Quick Checklist Before Trying Again

- [ ] All required fields filled
- [ ] Video URL is accessible (test in incognito)
- [ ] Privacy Policy URL works (test: https://chunkymonkey11.github.io/StyleSync/privacy.html)
- [ ] Terms URL works (test: https://chunkymonkey11.github.io/StyleSync/terms.html)
- [ ] Using Chrome or Firefox (not Safari)
- [ ] Browser extensions disabled
- [ ] Cleared browser cache
- [ ] Checked browser console for errors
- [ ] Looked for "Submit for Review" button (not just "Save")





























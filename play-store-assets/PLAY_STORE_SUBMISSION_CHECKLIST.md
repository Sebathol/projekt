# 🚀 Google Play Store Submission Checklist

**App**: Von der Idee zum Prototyp
**Version**: 3.0.0 (Build 30000)
**Target Launch Date**: TBD

---

## 📋 Phase 1: Pre-Submission Preparation

### 1.1 Google Play Console Setup
- [ ] Create Google Play Console Developer Account ($25 one-time fee)
- [ ] Verify identity (ID/Passport + Address verification)
- [ ] Set up payment profile (for receiving payments)
- [ ] Configure tax information
- [ ] Set up merchant account for subscriptions

**Estimated Time**: 1-2 days (including verification)

---

### 1.2 App Signing & Build
- [ ] Generate release keystore (IMPORTANT: Backup securely!)
  ```bash
  keytool -genkey -v -keystore release-key.keystore \
    -alias von-der-idee-zum-prototyp \
    -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Store keystore credentials securely (password manager)
- [ ] Configure build.gradle for release signing
- [ ] Enable Google Play App Signing (recommended)
- [ ] Build signed AAB (Android App Bundle)
  ```bash
  ./gradlew bundleRelease
  ```
- [ ] Test signed APK on physical device
- [ ] Verify ProGuard/R8 obfuscation (if enabled)

**Files Needed**:
- `release-key.keystore` (keep secure, never commit to git!)
- `key.properties` or equivalent (add to .gitignore)

---

### 1.3 App Testing
- [ ] Test on minimum supported device (Android 6.0 / API 23)
- [ ] Test on latest Android version (Android 14 / API 34)
- [ ] Test on different screen sizes (phone, tablet)
- [ ] Test all workflows (Ideas → Brainstorming → PRD → Prototype)
- [ ] Test subscription flow (Google Play Billing)
- [ ] Test promo code redemption
- [ ] Test offline functionality (PWA features)
- [ ] Test app icon and splash screen
- [ ] Test deep links (if applicable)
- [ ] Performance testing (load times, memory usage)
- [ ] Security testing (no sensitive data in logs)

**Test Devices** (minimum):
- [ ] Low-end phone (e.g., Samsung Galaxy A series)
- [ ] Mid-range phone (e.g., Pixel 6a)
- [ ] High-end phone (e.g., Samsung S23, Pixel 8)
- [ ] Tablet (optional but recommended)

---

## 📋 Phase 2: Assets & Content Creation

### 2.1 Required Graphics Assets ⚠️ PRIORITY

#### App Icons (**REQUIRED**)
- [ ] App Icon (512x512px, PNG-32)
  - Location: `play-store-assets/icons/icon-512x512.png`
  - Transparent background
  - Represents brand identity
- [ ] Adaptive Icon Foreground (512x512px, PNG-32)
  - Location: `play-store-assets/icons/adaptive-foreground.png`
  - Safe zone: 66dp circle
- [ ] Adaptive Icon Background (512x512px, PNG-32)
  - Location: `play-store-assets/icons/adaptive-background.png`
  - No alpha channel

**Design Tips**:
- Use primary brand color (#f59e0b - Amber)
- Simple, recognizable shape
- Looks good at small sizes
- Avoid text/thin lines

---

#### Feature Graphic (**REQUIRED**)
- [ ] Feature Graphic (1024x500px, PNG/JPG)
  - Location: `play-store-assets/graphics/feature-graphic.png`
  - No transparency
  - Include app name and tagline
  - High quality, attractive design

**Content Ideas**:
- App screenshots montage
- Abstract representation (lightbulb → prototype)
- Gradient background + app icon + tagline
- Before/After (Idea vs. Finished Prototype)

---

#### Screenshots (**REQUIRED - minimum 2, maximum 8**)
- [ ] Screenshot 1: Landing/Home Screen
- [ ] Screenshot 2: Idea Generation (Step 1)
- [ ] Screenshot 3: Brainstorming (Step 2)
- [ ] Screenshot 4: PRD View (Step 3)
- [ ] Screenshot 5: Prototype Preview (Step 4)
- [ ] Screenshot 6: Subscription Plans
- [ ] Screenshot 7: Dashboard/Stats
- [ ] Screenshot 8: Settings/Profile

**Technical Requirements**:
- Size: 1080x1920px - 1080x2400px (phone portrait)
- Format: PNG or JPG
- No device frames (Play Store adds these)
- Show actual app UI (not mockups)
- Location: `play-store-assets/screenshots/phone/`

**How to Take Screenshots**:
```bash
# Connect Android device via USB
adb devices

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png

# Pull to computer
adb pull /sdcard/screenshot.png ./play-store-assets/screenshots/phone/
```

Or use Android Emulator in Android Studio

---

### 2.2 Optional But Recommended Graphics

#### Promo Graphic (180x120px)
- [ ] Create promo graphic
  - Smaller version of feature graphic
  - Used in older Android versions

#### TV Banner (1280x720px)
- [ ] Create TV banner (if targeting Android TV)
  - Not applicable for this app

---

### 2.3 Promotional Video (Optional)
- [ ] Script video (30 seconds - 2 minutes)
- [ ] Record video (screen recording + voiceover)
- [ ] Edit video (add captions, music)
- [ ] Upload to YouTube (unlisted or public)
- [ ] Get YouTube URL for Play Console

**Video Content Ideas**:
- Quick demo: Idea → Prototype in 60 seconds
- Feature highlights
- User testimonials
- Problem → Solution narrative

**Tools**:
- OBS Studio (free screen recording)
- DaVinci Resolve (free video editing)
- ScreenFlow (Mac, paid)
- Camtasia (paid)

---

## 📋 Phase 3: Store Listing Content

### 3.1 Text Content (REQUIRED)

#### Primary Language: German (de-DE)
- [x] App Title (50 chars): "Von der Idee zum Prototyp" ✅
- [x] Short Description (80 chars) ✅
- [x] Full Description (4000 chars) ✅
- [ ] Copy content from `STORE_LISTING_TEXT.md`

#### Secondary Language: English (en-US)
- [x] App Title (50 chars): "Idea to Prototype - AI Assistant" ✅
- [x] Short Description (80 chars) ✅
- [x] Full Description (4000 chars) ✅
- [ ] Copy content from `STORE_LISTING_TEXT.md`

#### Release Notes (500 chars)
- [x] What's New text for v3.0.0 ✅
- [ ] Update for each new version

---

### 3.2 App Information

#### Basic Info
- [ ] App Name: Von der Idee zum Prototyp
- [ ] Package ID: com.aistormcreate.prototype
- [ ] Category: **Productivity** or **Business**
- [ ] Tags: AI, Prototyping, Startup, Business, Ideas
- [ ] Contact Email: support@aistormcreate.com
- [ ] Website: https://aistormcreate.com
- [ ] Privacy Policy URL: https://aistormcreate.com/privacy

#### Pricing
- [ ] Free to install: **Yes**
- [ ] Contains ads: **No**
- [ ] In-app purchases: **Yes** (Subscriptions + One-time purchases)

---

### 3.3 Privacy & Legal (REQUIRED)

#### Privacy Policy
- [x] Privacy Policy created ✅ (`privacy-policy.html`)
- [ ] Upload to website: https://aistormcreate.com/privacy
- [ ] Enter URL in Play Console

**Must Include**:
- What data is collected
- How data is used
- Third-party sharing
- User rights (GDPR)
- Contact information

#### Data Safety Section (NEW REQUIREMENT)
- [ ] Complete Data Safety form in Play Console
- [ ] Declare data collection practices:
  - Personal info: Email, name, phone (optional)
  - App activity: Workflows, usage stats
  - App info: Crash logs, diagnostics
- [ ] Declare data sharing: None (except payment processor)
- [ ] Declare data security: Encryption in transit, encrypted storage
- [ ] User controls: Delete account, export data

---

## 📋 Phase 4: App Content Rating (IARC)

### 4.1 Complete Questionnaire
- [ ] Start IARC questionnaire in Play Console
- [ ] Answer all questions honestly:
  - Violence: **None**
  - Sexual content: **None**
  - Profanity: **None**
  - Controlled substances: **None**
  - Gambling: **None**
  - User interaction: **No** (no chat/user-generated content)
  - Location sharing: **No**
  - Personal info sharing: **No**

### 4.2 Receive Rating
- [ ] Expected Rating: **Everyone** or **PEGI 3**
- [ ] Confirm rating certificate

**Note**: Incorrect ratings can result in app removal!

---

## 📋 Phase 5: In-App Products Setup

### 5.1 Subscriptions (Google Play Billing)

#### Weekly Subscription
- [ ] Product ID: `subscription_weekly`
- [ ] Price: €2.99/week (or local equivalent)
- [ ] Trial: 7 days free trial (optional)
- [ ] Benefits: 8 workflows/week
- [ ] Auto-renewing: Yes

#### Monthly Subscription
- [ ] Product ID: `subscription_monthly`
- [ ] Price: €9.99/month
- [ ] Trial: 7 days free trial (optional)
- [ ] Benefits: 30 workflows/month
- [ ] Auto-renewing: Yes
- [ ] Best value badge

#### Yearly Subscription
- [ ] Product ID: `subscription_yearly`
- [ ] Price: €99.99/year
- [ ] Trial: 7 days free trial (optional)
- [ ] Benefits: 365 workflows/year
- [ ] Auto-renewing: Yes
- [ ] Save 17% badge

### 5.2 One-Time Purchases

#### Extra Workflows
- [ ] Product ID: `extra_workflows_10`
- [ ] Price: €9.99
- [ ] Benefit: 10 workflows (no expiration)
- [ ] Consumable: Yes

#### Extra Tokens
- [ ] Product ID: `extra_tokens_50`
- [ ] Price: €4.99
- [ ] Benefit: 50 tokens (no expiration)
- [ ] Consumable: Yes

### 5.3 Testing Subscriptions
- [ ] Add test account emails in Play Console
- [ ] Test subscription purchase flow
- [ ] Test subscription cancellation
- [ ] Test subscription renewal
- [ ] Verify receipt validation

---

## 📋 Phase 6: Pre-Launch Testing

### 6.1 Internal Testing Track
- [ ] Create internal testing track
- [ ] Upload AAB to internal track
- [ ] Add internal testers (up to 100 email addresses)
- [ ] Testers install and test app
- [ ] Collect feedback
- [ ] Fix critical bugs

**Duration**: 1-2 weeks

---

### 6.2 Closed Testing (Alpha)
- [ ] Create closed testing track
- [ ] Upload AAB to alpha track
- [ ] Invite testers via email or Google Groups
- [ ] Monitor crash reports in Play Console
- [ ] Monitor ANR (App Not Responding) reports
- [ ] Gather feedback via Google Forms or in-app feedback
- [ ] Fix bugs and improve UX

**Duration**: 2-4 weeks

---

### 6.3 Open Testing (Beta) - Optional
- [ ] Create open testing track
- [ ] Upload AAB to beta track
- [ ] Make beta publicly available or invite-only
- [ ] Promote beta on social media
- [ ] Collect large-scale feedback
- [ ] Monitor metrics (installs, crashes, ratings)

**Duration**: 2-8 weeks

---

## 📋 Phase 7: Final Pre-Launch Checks

### 7.1 Technical Checklist
- [ ] App starts without crashes on test devices
- [ ] No memory leaks (test with Android Profiler)
- [ ] Network requests handle failures gracefully
- [ ] Offline mode works (PWA features)
- [ ] Back button behavior correct
- [ ] App doesn't request unnecessary permissions
- [ ] No hardcoded API keys or secrets
- [ ] ProGuard/R8 mapping file uploaded (for crash reports)
- [ ] Version code incremented correctly
- [ ] Version name updated (3.0.0)

---

### 7.2 Content & Compliance
- [ ] All text is spell-checked (German + English)
- [ ] Screenshots show current app version
- [ ] No copyrighted images without permission
- [ ] Privacy policy is accessible and up-to-date
- [ ] Terms of Service linked (if applicable)
- [ ] App doesn't violate Google Play policies:
  - No spam
  - No deceptive behavior
  - No malicious software
  - No intellectual property violations
  - No illegal activities

---

### 7.3 Subscription Compliance
- [ ] Subscription terms clearly stated
- [ ] Cancellation policy visible
- [ ] Refund policy complies with EU law (14-day right of withdrawal)
- [ ] Auto-renewal clearly disclosed
- [ ] Trial period terms visible
- [ ] Price clearly shown before purchase

---

## 📋 Phase 8: Production Release

### 8.1 Upload to Production Track
- [ ] Build final release AAB
- [ ] Run final tests on signed APK
- [ ] Upload AAB to production track in Play Console
- [ ] Upload ProGuard mapping file
- [ ] Select countries/regions for release:
  - [ ] Germany (primary)
  - [ ] Austria
  - [ ] Switzerland
  - [ ] EU countries
  - [ ] United States
  - [ ] Other countries (optional)
- [ ] Set rollout percentage (start with 20%, then 50%, then 100%)

---

### 8.2 Complete All Play Console Forms
- [ ] Store listing (text, graphics)
- [ ] App content (rating, target audience)
- [ ] Privacy policy URL
- [ ] Data safety
- [ ] In-app products
- [ ] Pricing & distribution
- [ ] Content rating
- [ ] App access (if requires login)
- [ ] Ads declaration

---

### 8.3 Submit for Review
- [ ] Review all sections (green checkmarks)
- [ ] Click "Submit for review"
- [ ] Wait for Google review (typically 1-3 days, can be up to 7 days)
- [ ] Monitor email for review status

**Possible Outcomes**:
- ✅ **Approved**: App goes live automatically
- ⚠️ **Rejected**: Fix issues and resubmit
- 🔄 **More info needed**: Respond to Google's questions

---

## 📋 Phase 9: Post-Launch

### 9.1 Launch Day
- [ ] Verify app is live on Play Store
- [ ] Test installation from Play Store
- [ ] Announce launch on social media
- [ ] Send email to mailing list
- [ ] Submit to app directories (AppBrain, APKPure, etc.)
- [ ] Post on Reddit, Product Hunt, Hacker News
- [ ] Contact tech bloggers/journalists

---

### 9.2 Monitor Metrics (First Week)
- [ ] Check install numbers daily
- [ ] Monitor crash reports (Firebase Crashlytics or Play Console)
- [ ] Monitor ANR reports
- [ ] Read user reviews and respond promptly
- [ ] Track conversion rate (installs → subscriptions)
- [ ] Monitor revenue

---

### 9.3 Ongoing Maintenance
- [ ] Respond to reviews (aim for <48 hours)
- [ ] Fix critical bugs ASAP (release hotfix)
- [ ] Plan first update (new features based on feedback)
- [ ] Monitor competitors
- [ ] A/B test store listing (screenshots, description)
- [ ] Optimize ASO (App Store Optimization) keywords

---

## 📋 Phase 10: Growth & Optimization

### 10.1 App Store Optimization (ASO)
- [ ] Analyze search terms in Play Console
- [ ] Optimize title and description with high-traffic keywords
- [ ] Improve screenshots based on conversion data
- [ ] Test different icons (A/B test with Play Store Experiments)
- [ ] Translate to more languages (French, Spanish, etc.)
- [ ] Encourage satisfied users to leave reviews

---

### 10.2 Marketing
- [ ] Run Google Ads for app installs (optional)
- [ ] Partner with influencers (provide promo codes)
- [ ] Create tutorial videos for YouTube
- [ ] Write blog posts about app features
- [ ] SEO for app landing page
- [ ] Email marketing campaigns

---

### 10.3 User Engagement
- [ ] Implement push notifications (carefully, not spammy)
- [ ] Add in-app messaging for tips/tutorials
- [ ] Create loyalty program (bonus workflows for referrals)
- [ ] Offer seasonal promotions
- [ ] Gather user feedback regularly (in-app surveys)

---

## 🛠️ Tools & Resources

### Development Tools
- **Android Studio**: IDE for building AAB
- **Bubblewrap CLI**: TWA builder (for PWA → Android app)
- **Gradle**: Build system

### Design Tools
- **Figma**: UI/UX design
- **Canva**: Graphics and marketing materials
- **Adobe Photoshop/Illustrator**: Professional graphics
- **GIMP/Inkscape**: Free alternatives

### Testing Tools
- **Firebase Test Lab**: Cloud-based device testing
- **Android Emulator**: Virtual devices
- **ADB (Android Debug Bridge)**: Device communication

### Analytics Tools
- **Google Play Console**: Official analytics
- **Firebase Analytics**: Detailed user analytics
- **Mixpanel**: Advanced analytics (optional)

### Support Tools
- **Zendesk/Intercom**: Customer support (optional)
- **Google Forms**: Feedback collection

---

## ⏰ Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Pre-Submission Prep | 1 week | 1 week |
| Assets Creation | 2 weeks | 3 weeks |
| Store Listing Content | 3 days | 3.5 weeks |
| App Rating & In-App Products | 2 days | 4 weeks |
| Internal Testing | 1-2 weeks | 6 weeks |
| Closed Testing (Alpha) | 2-4 weeks | 10 weeks |
| Open Testing (Beta) | 2-8 weeks (optional) | 18 weeks |
| Final Checks & Submission | 1 week | 19 weeks |
| Google Review | 1-7 days | 19-20 weeks |
| **TOTAL (minimum)** | **~4-5 months** | |

**Fast Track** (skipping beta): **~2-3 months**

---

## ⚠️ Common Pitfalls to Avoid

1. **Losing Keystore**: Always backup your release keystore! Without it, you can't update your app.
2. **Incomplete Privacy Policy**: Must be comprehensive and accessible.
3. **Misleading Screenshots**: Must show actual app UI.
4. **Broken Functionality**: Test thoroughly before submission.
5. **Incorrect Content Rating**: Answer questionnaire honestly.
6. **Violating Policies**: Read Google Play Developer Policy carefully.
7. **No Response to Reviews**: Engage with users promptly.
8. **Ignoring Crash Reports**: Fix crashes immediately.
9. **Poor Store Listing**: First impression matters - invest time in quality graphics.
10. **Not Testing Subscriptions**: Test entire purchase flow before launch.

---

## ✅ Quick Pre-Submission Checklist

**Before clicking "Submit for review":**

- [ ] ✅ AAB uploaded and tested
- [ ] ✅ All required graphics uploaded (icon, feature graphic, screenshots)
- [ ] ✅ Store listing text complete (title, descriptions)
- [ ] ✅ Privacy policy URL entered and accessible
- [ ] ✅ Data safety form completed
- [ ] ✅ Content rating obtained
- [ ] ✅ In-app products configured and tested
- [ ] ✅ Pricing & distribution set
- [ ] ✅ All sections show green checkmarks in Play Console
- [ ] ✅ No policy violations
- [ ] ✅ App tested on multiple devices
- [ ] ✅ Backup of keystore stored securely

---

## 📞 Support Contacts

- **Google Play Developer Support**: https://support.google.com/googleplay/android-developer
- **Play Console Help**: https://support.google.com/googleplay/android-developer/answer/9859455
- **Policy Questions**: https://support.google.com/googleplay/android-developer/contact/policy

---

**Good luck with your launch! 🚀**

**Last Updated**: 2025-10-31
**Version**: 1.0

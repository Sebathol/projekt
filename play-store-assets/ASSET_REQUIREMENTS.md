# Google Play Store Asset Requirements

**App Name**: Von der Idee zum Prototyp
**Package**: com.aistormcreate.prototype
**Version**: 3.0.0

---

## 📱 Required Assets Checklist

### ✅ 1. App Icons

| Asset | Size | Format | Status | Location |
|-------|------|--------|--------|----------|
| **App Icon** | 512x512px | PNG-32 | ⏳ TODO | `play-store-assets/icons/icon-512x512.png` |
| **Adaptive Icon** (Foreground) | 512x512px | PNG-32 | ⏳ TODO | `play-store-assets/icons/adaptive-foreground.png` |
| **Adaptive Icon** (Background) | 512x512px | PNG-32 | ⏳ TODO | `play-store-assets/icons/adaptive-background.png` |

**Requirements**:
- Transparent background
- No alpha channel for background layer
- Safe zone: 66dp diameter circle in center
- Full bleed: 108dp x 108dp

---

### ✅ 2. Feature Graphic

| Asset | Size | Format | Status | Location |
|-------|------|--------|--------|----------|
| **Feature Graphic** | 1024x500px | PNG/JPG | ⏳ TODO | `play-store-assets/graphics/feature-graphic.png` |

**Requirements**:
- No alpha/transparency
- Displayed at top of Play Store listing
- Should represent app visually
- Include app name/tagline

---

### ✅ 3. Screenshots (REQUIRED - minimum 2)

| Device Type | Size | Format | Quantity | Status |
|-------------|------|--------|----------|--------|
| **Phone** | 1080x1920px - 1080x2400px | PNG/JPG | 2-8 | ⏳ TODO |
| **7-inch Tablet** | 1200x1920px | PNG/JPG | 0-8 | ⏳ Optional |
| **10-inch Tablet** | 1920x1200px | PNG/JPG | 0-8 | ⏳ Optional |

**Location**: `play-store-assets/screenshots/phone/` and `play-store-assets/screenshots/tablet/`

**Requirements**:
- Show actual app UI
- No mockups or device frames (Play Store adds these)
- Minimum 2, maximum 8 screenshots
- Portrait or landscape

---

### ✅ 4. Promotional Graphics (Optional but Recommended)

| Asset | Size | Format | Status | Location |
|-------|------|--------|--------|----------|
| **Promo Graphic** | 180x120px | PNG/JPG | ⏳ Optional | `play-store-assets/promotional/promo-graphic.png` |
| **TV Banner** | 1280x720px | PNG/JPG | ⏳ Optional | `play-store-assets/promotional/tv-banner.png` |

---

### ✅ 5. Video (Optional)

| Asset | Format | Max Length | Status | Location |
|-------|--------|------------|--------|----------|
| **Promo Video** | YouTube URL | 30sec-2min | ⏳ Optional | Link in Play Console |

---

## 📝 Store Listing Text Requirements

### Title
- **Max**: 50 characters
- **Current**: "Von der Idee zum Prototyp" (28 chars) ✅
- **English**: "Idea to Prototype" (17 chars) ✅

### Short Description
- **Max**: 80 characters
- **Status**: ⏳ TODO

### Full Description
- **Max**: 4000 characters
- **Status**: ⏳ TODO

### What's New (Release Notes)
- **Max**: 500 characters
- **Status**: ⏳ TODO

---

## 🌍 Localization (Optional but Recommended)

| Language | Code | Priority | Status |
|----------|------|----------|--------|
| German | de-DE | High | ⏳ TODO |
| English (US) | en-US | High | ⏳ TODO |
| English (UK) | en-GB | Medium | Optional |
| French | fr-FR | Medium | Optional |
| Spanish | es-ES | Medium | Optional |

---

## 🔒 Privacy & Legal

| Document | Status | Location |
|----------|--------|----------|
| **Privacy Policy** (REQUIRED) | ⏳ TODO | `privacy-policy.html` or external URL |
| **Terms of Service** | ⏳ Optional | `terms-of-service.html` |
| **GDPR Compliance** | ⏳ TODO | Include in Privacy Policy |

**Privacy Policy Requirements**:
- Must be hosted on publicly accessible URL
- Must explain data collection and usage
- Must include contact information
- Must comply with GDPR (EU users)

---

## 📋 App Content Rating (IARC)

Complete questionnaire in Play Console:
- Violence: None
- Sexual Content: None
- Language: None
- Controlled Substances: None
- Gambling: None
- User Interaction: No (unless chat features added)

Expected Rating: **Everyone** or **PEGI 3**

---

## 🏷️ App Categorization

| Field | Value |
|-------|-------|
| **Category** | Productivity or Business |
| **Tags** | AI, Prototyping, Ideas, Business, Productivity |
| **Type** | App |
| **Free/Paid** | Free with In-App Purchases (Subscriptions) |

---

## 💳 In-App Products (For Subscriptions)

Must configure in Play Console:
1. Weekly Plan - €2.99/week
2. Monthly Plan - €9.99/month
3. Yearly Plan - €99.99/year

---

## 🛠️ Technical Requirements

### App Signing
- **Keystore**: Required for production
- **Key Alias**: `von-der-idee-zum-prototyp`
- **Validity**: 25+ years
- **Status**: ⏳ TODO - Generate keystore

### Build Configuration
- **Format**: Android App Bundle (.aab)
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 34 (Android 14)
- **Version Code**: 30000
- **Version Name**: 3.0.0

### Manifest Permissions
Review and justify in Play Console:
- INTERNET (required for API)
- No dangerous permissions needed

---

## 📱 Device Support

| Device Type | Support |
|-------------|---------|
| Phone | ✅ Yes |
| Tablet | ✅ Yes |
| Wear OS | ❌ No |
| Android TV | ❌ No |
| Chrome OS | ⏳ Optional |
| Android Auto | ❌ No |

---

## 🧪 Testing Requirements

Before submission:
- [ ] Test on physical Android device
- [ ] Test on Android emulator (multiple screen sizes)
- [ ] Test offline behavior (PWA features)
- [ ] Test subscription flow (Google Play Billing)
- [ ] Test deep links
- [ ] Test back button behavior
- [ ] Test app icon on home screen
- [ ] Performance testing (load times)

---

## 📅 Launch Checklist Timeline

### Week 1: Asset Creation
- [ ] Design and export all required graphics
- [ ] Take and edit screenshots
- [ ] Write store listing texts (DE + EN)
- [ ] Create privacy policy page

### Week 2: Technical Setup
- [ ] Generate keystore for signing
- [ ] Configure TWA properly
- [ ] Build and test AAB
- [ ] Set up Google Play Console account

### Week 3: Testing
- [ ] Internal testing track (closed alpha)
- [ ] Fix bugs found during testing
- [ ] Gather feedback
- [ ] Optimize based on feedback

### Week 4: Submission
- [ ] Upload AAB to production track
- [ ] Complete all Play Console forms
- [ ] Submit for review
- [ ] Wait for approval (typically 1-3 days)

---

## 📏 Design Guidelines

### Color Palette (from app):
- **Primary**: #f59e0b (Amber)
- **Background**: #ffffff (White)
- **Text**: #111827 (Dark Gray)
- **Accent**: #3b82f6 (Blue)

### Typography:
- **Font**: System default (Roboto on Android)
- **Style**: Clean, modern, professional

### Visual Style:
- Gradient backgrounds
- Rounded corners (8px radius)
- Drop shadows (subtle)
- Icon style: Minimalist, outlined

---

## 🎨 Asset Creation Tools

### Recommended Tools:
1. **Figma** (free) - UI design and prototyping
2. **Canva** (free tier) - Graphics and banners
3. **Adobe Photoshop** (paid) - Professional editing
4. **GIMP** (free) - Photoshop alternative
5. **Inkscape** (free) - Vector graphics
6. **Android Asset Studio** (free, online) - Icon generation

### Screenshot Tools:
1. **Android Emulator** (Android Studio)
2. **Physical device** + ADB screenshot
3. **Chrome DevTools** (for PWA testing)

---

## 🔍 SEO Keywords (for Play Store)

**Primary Keywords**:
- Prototyping tool
- AI idea generator
- Business idea app
- Startup helper
- Product development

**German Keywords**:
- Prototyp erstellen
- Geschäftsidee entwickeln
- KI Ideengenerator
- Produktentwicklung
- Startup Tool

---

## 📊 Metrics to Track Post-Launch

1. **Install metrics**:
   - Impressions
   - Store listing visitors
   - Installers
   - Conversion rate

2. **Engagement metrics**:
   - Daily Active Users (DAU)
   - Monthly Active Users (MAU)
   - Session length
   - Retention rate

3. **Revenue metrics**:
   - Subscription conversions
   - ARPU (Average Revenue Per User)
   - Churn rate
   - LTV (Lifetime Value)

---

## 🚀 Launch Strategy

### Pre-Launch:
- [ ] Create landing page with "Coming Soon to Play Store"
- [ ] Build email list for launch announcement
- [ ] Prepare social media posts
- [ ] Contact tech bloggers/reviewers

### Launch Day:
- [ ] Announce on social media
- [ ] Email list notification
- [ ] Post on relevant forums (Reddit, Product Hunt)
- [ ] Reach out to press contacts

### Post-Launch:
- [ ] Monitor reviews and respond promptly
- [ ] Track metrics daily (first week)
- [ ] Gather user feedback
- [ ] Plan first update based on feedback

---

## ⚠️ Common Rejection Reasons (To Avoid)

1. **Broken functionality** - Test thoroughly!
2. **Misleading screenshots** - Show actual app UI
3. **Copyright violations** - Use only licensed assets
4. **Privacy policy missing/inadequate** - Must be comprehensive
5. **Inappropriate content** - Keep it professional
6. **Minimum functionality** - App must be fully functional
7. **User-generated content** - Add moderation if applicable

---

## 📞 Support & Resources

- **Play Console**: https://play.google.com/console
- **Developer Documentation**: https://developer.android.com/distribute
- **Asset Requirements**: https://support.google.com/googleplay/android-developer/answer/9866151
- **Policy Guidelines**: https://play.google.com/about/developer-content-policy/

---

**Status**: In Preparation
**Target Launch**: TBD
**Last Updated**: 2025-10-31

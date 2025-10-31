# 📸 Screenshot Guide for Play Store

**App**: Von der Idee zum Prototyp
**Target**: Google Play Store listing
**Requirement**: Minimum 2, maximum 8 screenshots

---

## 📐 Technical Specifications

| Property | Requirement |
|----------|-------------|
| **Aspect Ratio** | 16:9 or 9:16 (portrait recommended) |
| **Min Dimension** | 320px |
| **Max Dimension** | 3840px |
| **Recommended Size** | **1080x1920px** (portrait) or 1080x2400px |
| **Format** | PNG or JPG |
| **File Size** | Max 8MB per screenshot |
| **Device Frames** | **NO** - Google Play adds these automatically |
| **Text Overlay** | Optional but recommended for clarity |

---

## 🎯 Screenshot Plan (8 Screens)

### Screenshot 1: Landing Page / Home Screen
**File**: `01-landing-home.png`
**Show**:
- App logo and welcome message
- "Starten" (Start) button prominently
- Clean, inviting interface
- Bottom navigation (if applicable)

**Purpose**: First impression - show clean, professional design

---

### Screenshot 2: Idea Generation (Step 1)
**File**: `02-idea-generation.png`
**Show**:
- Text input field with example idea
- "Ideen generieren" button
- Progress indicator (Step 1 of 4)
- Generated ideas list (if on results page)

**Caption Overlay** (optional):
> "💡 Schritt 1: Ideen generieren"

**Purpose**: Show how easy it is to start

---

### Screenshot 3: Brainstorming (Step 2)
**File**: `03-brainstorming.png`
**Show**:
- Brainstorming results with bullet points
- Well-formatted text
- Scroll view showing multiple sections
- "Weiter zu PRD" button

**Caption Overlay**:
> "🧠 Schritt 2: Intelligentes Brainstorming"

**Purpose**: Demonstrate AI-generated quality content

---

### Screenshot 4: PRD Document (Step 3)
**File**: `04-prd-document.png`
**Show**:
- Professional PRD layout
- Sections: Features, User Stories, Tech Stack
- Clean typography
- Export options (if visible)

**Caption Overlay**:
> "📋 Schritt 3: Automatisches PRD"

**Purpose**: Show professional output quality

---

### Screenshot 5: Prototype Code (Step 4)
**File**: `05-prototype-code.png`
**Show**:
- Generated HTML/CSS/JavaScript code
- Syntax highlighting (if available)
- "Prototyp herunterladen" button
- Code preview

**Caption Overlay**:
> "🎨 Schritt 4: Fertiger Prototyp-Code"

**Purpose**: Showcase the final output

---

### Screenshot 6: Subscription Plans
**File**: `06-subscription-plans.png`
**Show**:
- All 3 plans (Weekly, Monthly, Yearly)
- Pricing clearly visible (€2.99, €9.99, €99.99)
- Features comparison
- "Beste Wahl" badge on monthly plan
- Clean pricing cards

**Caption Overlay**:
> "💎 Flexible Abo-Modelle"

**Purpose**: Show transparent pricing and value

---

### Screenshot 7: Dashboard / Usage Stats
**File**: `07-dashboard-stats.png`
**Show**:
- Usage statistics dashboard
- Remaining workflows/tokens
- Chart or visual representation
- Smart recommendations (if visible)
- Tool-specific usage breakdown

**Caption Overlay**:
> "📊 Detaillierte Nutzungs-Übersicht"

**Purpose**: Show premium features and tracking

---

### Screenshot 8: Workflow List / Projects
**File**: `08-workflow-list.png`
**Show**:
- List of saved workflows/projects
- Project cards with thumbnails
- Date created, status
- Action buttons (edit, delete, export)
- Search/filter options

**Caption Overlay**:
> "🗂️ Alle Projekte übersichtlich verwaltet"

**Purpose**: Show project management capabilities

---

## 🎨 Design Guidelines

### Color Scheme (Consistent with App)
- **Primary**: #f59e0b (Amber/Orange)
- **Background**: #ffffff (White) or #f9fafb (Light Gray)
- **Text**: #111827 (Dark Gray)
- **Accent**: #3b82f6 (Blue)

### Typography for Overlays
- **Font**: Roboto, SF Pro, or system default
- **Title Size**: 24-32px
- **Body Size**: 16-20px
- **Bold** for emphasis

### Caption Overlay Design (if used)
- **Position**: Bottom 20% of screen or top 20%
- **Background**: Semi-transparent dark overlay (rgba(0,0,0,0.7))
- **Text Color**: White
- **Padding**: 20px
- **Emoji**: Optional but adds personality ✨

Example CSS for overlay:
```css
.caption-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
```

---

## 📱 How to Take Screenshots

### Method 1: Physical Android Device (RECOMMENDED)
```bash
# 1. Connect device via USB
adb devices

# 2. Open app and navigate to desired screen
# (manually on device)

# 3. Take screenshot
adb shell screencap -p /sdcard/screenshot.png

# 4. Pull to computer
adb pull /sdcard/screenshot.png ./play-store-assets/screenshots/phone/01-landing-home.png

# 5. Repeat for all 8 screenshots
```

### Method 2: Android Emulator (Android Studio)
1. Open Android Studio
2. Start emulator (Pixel 6 or similar, 1080x2400)
3. Install and open your app
4. Navigate to desired screen
5. Click camera icon in emulator toolbar
6. Save to `play-store-assets/screenshots/phone/`

### Method 3: Chrome DevTools (for PWA)
1. Open Chrome
2. Open app in browser
3. Press F12 (DevTools)
4. Click device toolbar (Ctrl+Shift+M)
5. Select device: "Pixel 5" or custom 1080x1920
6. Take screenshot: Ctrl+Shift+P → "Capture screenshot"

---

## ✂️ Post-Processing (Optional)

### Recommended Edits:
1. **Crop to exact 1080x1920px** (if needed)
2. **Add caption overlays** (using Photoshop, GIMP, Canva)
3. **Hide sensitive data** (if any test data visible)
4. **Enhance contrast** (slightly increase brightness/contrast)
5. **Compress** (optimize file size without quality loss)

### Tools:
- **Photoshop/GIMP**: Professional editing
- **Canva**: Easy overlay creation
- **ImageOptim/TinyPNG**: Compression
- **Figma**: Design overlays and export

---

## ✅ Screenshot Checklist

Before uploading to Play Console:

- [ ] All 8 screenshots taken
- [ ] All are 1080x1920px or 1080x2400px (consistent size)
- [ ] All are PNG or JPG format
- [ ] File size under 8MB each
- [ ] No device frames (Google adds these)
- [ ] No test data or placeholder text visible
- [ ] Status bar is clean (no notifications)
- [ ] App UI is fully loaded (no loading spinners)
- [ ] Text is readable
- [ ] Consistent design style across all screenshots
- [ ] Filenames are numbered: 01-..., 02-..., etc.
- [ ] Screenshots show current app version (not outdated)

---

## 🌍 Localization (Optional)

If creating screenshots for multiple languages:

**German (de-DE)** - Primary
- Directory: `screenshots/de-DE/phone/`
- All UI text in German

**English (en-US)** - Secondary
- Directory: `screenshots/en-US/phone/`
- All UI text in English

**Note**: Google Play supports language-specific screenshots, but they're optional.

---

## 📊 Screenshot Order Matters!

Google Play displays screenshots in the order you upload them. The **first 2-3 are most important** (shown without scrolling).

**Recommended Order** (by priority):
1. Landing Page (first impression)
2. Idea Generation (core feature)
3. Brainstorming (core feature)
4. PRD (core feature)
5. Prototype (core feature)
6. Subscription Plans (monetization)
7. Dashboard (premium feature)
8. Workflow List (project management)

---

## 🎯 Pro Tips

### Do's:
✅ Show actual app UI (not mockups)
✅ Use consistent device size across all screenshots
✅ Highlight key features
✅ Use captions to explain functionality
✅ Show the app in action (filled with content, not empty states)
✅ Keep UI clean and professional

### Don'ts:
❌ Don't use device frames (Play Store adds these)
❌ Don't show outdated UI
❌ Don't include sensitive user data
❌ Don't use misleading images
❌ Don't use low-resolution images
❌ Don't show empty screens (always have example content)
❌ Don't mix portrait and landscape (stay consistent)

---

## 📐 Alternative Sizes

If targeting tablets, create additional screenshots:

### 7-inch Tablet
- **Size**: 1200x1920px (portrait)
- **Directory**: `screenshots/tablet-7/`

### 10-inch Tablet
- **Size**: 1920x1200px (landscape)
- **Directory**: `screenshots/tablet-10/`

**Note**: Tablet screenshots are optional but recommended if your app has tablet-optimized UI.

---

## 🔄 Updating Screenshots

### When to Update:
- Major UI redesign
- New feature launches
- Rebranding
- User feedback indicates confusion
- A/B testing shows better conversion with new screenshots

### Best Practice:
- Update all screenshots at once (maintain consistency)
- Test different versions with Play Store Experiments (A/B testing)
- Monitor conversion rate changes

---

## 📞 Need Help?

- **Template Generator**: https://www.applaunchpad.com/screenshot-generator/
- **Frame Generator**: https://screenshots.pro/
- **Design Inspiration**: Browse top apps in Productivity category

---

**Last Updated**: 2025-10-31
**Status**: Ready for screenshot creation
**Next Step**: Take 8 screenshots following this guide

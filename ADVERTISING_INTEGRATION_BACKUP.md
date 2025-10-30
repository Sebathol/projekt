# 📺 Werbung Integration - Backup Dokumentation

**Status:** ⚠️ ENTFERNT (auf User-Wunsch)
**Datum:** 2025-10-30
**Grund:** User möchte Werbung entfernen, aber Integration dokumentieren für spätere Nutzung

---

## 🎯 Übersicht

Das System hatte eine vollständige AdMob-Integration mit drei Werbetypen:

1. **Banner Ads** - Oben und unten auf jeder Seite
2. **Interstitial Ads** - Zwischen Workflow-Schritten
3. **Rewarded Video Ads** - Bonus-Workflows durch Video-Schauen

---

## 📁 Integrierte Dateien

### **1. js/admob-integration.js** (471 Zeilen)

**Funktionen:**
- Banner-Werbung oben/unten
- Interstitial-Werbung zwischen Steps
- Rewarded Videos für Bonus-Workflows
- Auto-Rotation alle 30 Sekunden
- Test-Mode mit Mock-Ads
- Google AdSense Integration

**Wichtige Methoden:**
```javascript
AdMob.init()                    // Initialisierung
AdMob.showBanners()             // Banner anzeigen
AdMob.hideBanners()             // Banner verstecken
AdMob.showInterstitial()        // Interstitial zeigen
AdMob.showRewardedVideo()       // Rewarded Video zeigen
AdMob.claimAdReward()           // Reward auf Backend claimen
```

**Styling:**
- Sticky Top Banner
- Sticky Bottom Banner
- Responsive (Desktop: 728px, Mobile: 320px)
- Graues Label "Werbung"

**Integration:**
```html
<!-- In HTML einbinden: -->
<script src="js/admob-integration.js"></script>
```

---

### **2. config/admob-config.json**

**Konfiguration:**
```json
{
  "testMode": true,
  "bannerAdUnitId": "ca-app-pub-3940256099942544/6300978111",
  "interstitialAdUnitId": "ca-app-pub-3940256099942544/1033173712",
  "rewardedAdUnitId": "ca-app-pub-3940256099942544/5224354917",
  "autoShowBanners": true,
  "rotationInterval": 30000
}
```

**Wichtig:** Test-IDs von Google AdMob verwenden in Production echte IDs!

---

### **3. backend/usage.js - Ad Reward Endpoint**

**Endpoint:** `POST /api/usage/ad-reward`

**Funktion:**
- User schaut 2 Videos = 1 Bonus-Workflow
- Verhindert Abuse (max 3 Workflows/Tag)
- Tracking in Datenbank

**Code:**
```javascript
async function claimAdReward(req, res) {
  const userId = req.user.userId;
  const { adType, videosWatched } = req.body;

  // Validierung
  if (videosWatched < 2) {
    return res.status(400).json({
      error: 'Nicht genug Videos geschaut',
      required: 2,
      current: videosWatched
    });
  }

  // Daily limit check
  const today = new Date().toISOString().split('T')[0];
  const rewardsToday = await getAdRewardsToday(userId, today);

  if (rewardsToday >= 3) {
    return res.status(429).json({
      error: 'Tageslimit erreicht',
      message: 'Du hast heute bereits 3 Bonus-Workflows durch Werbung verdient.'
    });
  }

  // Grant 1 workflow
  await grantWorkflowReward(userId, 1);

  res.json({
    success: true,
    workflowsEarned: 1,
    rewardsToday: rewardsToday + 1,
    remainingToday: 2 - rewardsToday
  });
}
```

---

### **4. backend/server.js - API Endpoint Registration**

**Zeile ~96:**
```javascript
usage: {
  'GET /api/usage/stats': 'Get usage statistics (requires auth)',
  'GET /api/usage/costs': 'Get cost tracking (requires auth)',
  'POST /api/usage/ad-reward': 'Claim ad reward (requires auth)'  // ← WERBUNG
}
```

---

### **5. landing.html - Werbeflächen**

**Erwähnung:** "Ad-Free Option" in Pricing

**Zeilen ~450-470:**
```html
<!-- Premium Features -->
<div class="feature-badge">
  <span class="badge-premium">Premium</span>
  <strong>Werbefrei nutzen</strong>
  <p>Keine Unterbrechungen durch Werbung</p>
</div>
```

---

## 🔌 Wie Werbung integriert war

### **Workflow-Integration**

```javascript
// In Workflow-Generierung (z.B. nach Ideen-Generierung)

// 1. Interstitial nach jedem 2. Workflow
if (workflowCount % 2 === 0) {
  await AdMob.showInterstitial();
}

// 2. Rewarded Video Button anzeigen
if (workflows === 0 && tokens < 4) {
  showRewardedVideoButton();
}
```

### **Banner-Positionierung**

```
┌────────────────────────────────┐
│  [Top Banner - 728x90]         │ ← Sticky Top
├────────────────────────────────┤
│                                │
│  App Content                   │
│                                │
│                                │
├────────────────────────────────┤
│  [Bottom Banner - 728x90]      │ ← Sticky Bottom
└────────────────────────────────┘
```

### **Rewarded Video Flow**

```
User klickt "Bonus-Workflow verdienen"
         ↓
Video 1 schauen (30 Sek)
         ↓
Video 2 schauen (30 Sek)
         ↓
Backend: POST /api/usage/ad-reward
         ↓
+1 Workflow gewährt
```

---

## 💰 Monetarisierung-Strategie

### **Banner Ads**
- **Impression-based**: ~$2-5 CPM (Cost per Mille)
- **Position**: Top + Bottom = 2x Impressions
- **Rotation**: Alle 30 Sekunden
- **Erwartung**: ~$10-30/Tag bei 5000 DAU

### **Interstitial Ads**
- **Higher CPM**: ~$5-15 CPM
- **Frequency**: Jeder 2. Workflow
- **User Impact**: Mittel (5 Sek skipable)
- **Erwartung**: ~$20-50/Tag bei 5000 DAU

### **Rewarded Video Ads**
- **Highest CPM**: ~$10-30 CPM
- **User Value**: Hoch (1 gratis Workflow)
- **Engagement**: Sehr gut (User wählt freiwillig)
- **Erwartung**: ~$30-100/Tag bei 5000 DAU

**Total Revenue Projection:** $60-180/Tag bei 5000 DAU

---

## 🗄️ Datenbank-Schema (für Ad-Tracking)

```sql
-- Ad Rewards Tracking Table (war geplant, nicht implementiert)
CREATE TABLE IF NOT EXISTS ad_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ad_type TEXT NOT NULL CHECK(ad_type IN ('banner', 'interstitial', 'rewarded_video')),
  videos_watched INTEGER DEFAULT 0,
  workflows_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reward_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index für Daily Limits
CREATE INDEX idx_ad_rewards_user_date ON ad_rewards(user_id, reward_date);

-- View: Heute verdiente Workflows
CREATE VIEW ad_rewards_today AS
SELECT
  user_id,
  COUNT(*) as rewards_today,
  SUM(workflows_earned) as workflows_earned_today
FROM ad_rewards
WHERE reward_date = DATE('now')
GROUP BY user_id;
```

---

## 📊 Play Store Integration

### **AdMob App ID**

In `AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

### **Permissions**

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

### **Dependencies (Gradle)**

```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads:22.5.0'
}
```

---

## 🔧 Wie Werbung reaktiviert werden kann

### **Schritt 1: Config aktivieren**

```bash
# admob-config.json editieren
vi config/admob-config.json

# testMode auf false setzen
# Echte Ad Unit IDs eintragen
```

### **Schritt 2: Script einbinden**

```html
<!-- In index.html, landing.html, etc. -->
<script src="js/admob-integration.js"></script>
```

### **Schritt 3: Backend Endpoint aktivieren**

```javascript
// In backend/usage.js
// Auskommentierte Zeilen wieder aktivieren

app.post('/api/usage/ad-reward', authenticateToken, claimAdReward);
```

### **Schritt 4: Ad-Free für Premium**

```javascript
// Nur Banner für Free Users zeigen
if (userPlan === 'free') {
  AdMob.showBanners();
} else {
  AdMob.hideBanners();
}
```

---

## 📱 Mobile App Integration

### **AdMob SDK Setup (React Native / Capacitor)**

```bash
# Install AdMob plugin
npm install @capacitor-community/admob

# Configure
npx cap sync
```

### **Initialize**

```javascript
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// Initialize
await AdMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['YOUR_TEST_DEVICE_ID']
});

// Show Banner
await AdMob.showBanner({
  adId: 'ca-app-pub-XXX/YYY',
  adSize: BannerAdSize.BANNER,
  position: BannerAdPosition.TOP_CENTER
});

// Show Interstitial
await AdMob.prepareInterstitial({
  adId: 'ca-app-pub-XXX/YYY'
});
await AdMob.showInterstitial();

// Show Rewarded Video
await AdMob.prepareRewardVideoAd({
  adId: 'ca-app-pub-XXX/YYY'
});
const result = await AdMob.showRewardVideoAd();
if (result.rewardType === 'rewarded') {
  // Grant reward
}
```

---

## 🚫 Warum wurde Werbung entfernt?

**User-Anforderung:**
> "werbeflächen und werbung allgemein herausnehmen. aber bitte merken wie sie integriert war. komme drauf zurück"

**Aktion:**
- Werbung vollständig deaktiviert
- Integration dokumentiert in diesem File
- Dateien bleiben im Repo (für spätere Reaktivierung)

---

## ✅ Checkliste für Reaktivierung

- [ ] AdMob Account erstellen (https://apps.admob.com/)
- [ ] App registrieren
- [ ] Ad Unit IDs generieren (Banner, Interstitial, Rewarded)
- [ ] `config/admob-config.json` aktualisieren
- [ ] `testMode: false` setzen
- [ ] Script in HTML einbinden
- [ ] Backend Endpoint aktivieren
- [ ] Datenbank-Schema für Ad-Tracking erstellen
- [ ] Testen mit echten Ads
- [ ] Play Store: Ad-Disclosure hinzufügen
- [ ] Privacy Policy: Ad-Cookies erwähnen

---

## 📞 AdMob Support

**AdMob Dashboard:** https://apps.admob.com/
**Developer Docs:** https://developers.google.com/admob
**Integration Guide:** https://developers.google.com/admob/android/quick-start

---

**Dokumentiert von:** Claude Code
**Datum:** 2025-10-30
**Status:** Backup für spätere Nutzung

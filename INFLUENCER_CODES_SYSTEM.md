# 🎁 Influencer Code-System - Vollständige Dokumentation

**Version:** 1.0.0
**Erstellt:** 2025-10-30
**Status:** ✅ Produktiv

---

## 🎯 DEINE INFLUENCER-CODES

### **HAUPT-CODE** (Für die Öffentlichkeit)

```
INFLUENCER-2025-FREE
```

**Benefits:**
- ✅ 30 Workflows ODER 120 Tokens
- ✅ 14 Tage Testphase
- ✅ Testphase beginnt bei erster Generierung
- ✅ Maximal 500 Einlösungen
- ✅ Gültig bis: 31.12.2025

**Verwendung:**
- Teile diesen Code öffentlich mit deinen Followern
- In Videos, Posts, Bio, etc.
- Perfekt für: YouTube, TikTok, Instagram, Twitter

---

### **BACKUP-CODES** (Falls Haupt-Code gehackt wird)

```
CREATOR-2025-TRIAL
YOUTUBE-SPECIAL-2025
TIKTOK-CREATOR-FREE
```

**Benefits:**
- ✅ Gleiche Benefits wie Haupt-Code
- ✅ Jeweils max. 100 Einlösungen

**Verwendung:**
- Reserve-Codes falls `INFLUENCER-2025-FREE` kompromittiert wird
- Kann auch Platform-spezifisch verwendet werden (YouTube = YOUTUBE-SPECIAL-2025, etc.)

---

### **VIP-PARTNER-CODES** (Exklusiv für große Influencer)

```
PARTNER-NDCH-4RKZ
PARTNER-9845-NWEA
PARTNER-JNYK-4K6H
PARTNER-866Z-XASM
PARTNER-HE7P-MMCJ
```

**Benefits:**
- 👑 60 Workflows ODER 240 Tokens
- 👑 28 Tage VIP-Testphase
- 👑 Jeweils nur 1x einlösbar

**Verwendung:**
- Für Kooperationen mit großen Influencern (>100k Follower)
- Persönlich vergeben
- Tracking: Wer welchen Code bekommt

---

## 🔒 Sicherheits-Features

### **Hash-basiertes System**
- ✅ Codes werden SHA256-gehashed in der Datenbank gespeichert
- ✅ Nicht reverse-engineerbar
- ✅ Selbst bei Datenbank-Leak sind die Original-Codes sicher

### **Rate Limiting**
- ⏱️ Max. 5 Einlöseversuche pro Stunde pro User
- ⏱️ Schutz vor Brute-Force-Attacken
- ⏱️ Automatische Warnung bei zu vielen Versuchen

### **Einmalige Verwendung pro User**
- 🔐 Jeder User kann jeden Code nur 1x einlösen
- 🔐 Verhindert Mehrfach-Einlösungen
- 🔐 Datenbank-Constraint

### **Testphase-Start-Verzögerung**
- ⏰ Testphase beginnt erst bei erster Generierung
- ⏰ Verhindert Abuse (Code einlösen aber nicht nutzen)
- ⏰ Automatisches Tracking

---

## 📊 Wie es funktioniert

### **1. Code einlösen**

User klickt in der App auf "Promo-Code einlösen" oder findet den Banner auf der Startseite.

**UI:**
```
┌─────────────────────────────────────────┐
│  🎁 Promo-Code einlösen                 │
│                                         │
│  Promo-Code:                            │
│  ┌───────────────────────────────────┐  │
│  │ INFLUENCER-2025-FREE              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [✓ Code einlösen]                      │
│                                         │
│  ℹ️ Hinweis: Die Testphase beginnt      │
│  automatisch mit deiner ersten          │
│  Generierung.                           │
└─────────────────────────────────────────┘
```

### **2. Backend-Validierung**

1. Code wird in Großbuchstaben umgewandelt
2. Code wird SHA256-gehashed
3. Hash wird in Datenbank gesucht
4. Überprüfung:
   - ✅ Code existiert?
   - ✅ Noch gültig (Datum)?
   - ✅ Noch Einlösungen verfügbar?
   - ✅ User hat Code noch nicht eingelöst?
5. Bei Success: Workflows/Tokens werden zum Abo hinzugefügt

### **3. Testphase beginnt**

User startet erste Generierung:

```javascript
// In Workflow-Generierung (z.B. generate-ideas)
await Auth.apiRequest('/api/promo/start-trial', {
  method: 'POST'
});
```

System:
1. Prüft alle offenen Redemptions für User
2. Setzt `first_usage_at` = jetzt
3. Berechnet `expires_at` = jetzt + duration_days
4. Testphase läuft jetzt!

---

## 🎨 Integration in die App

### **1. Landing Page - Influencer-Bereich**

Füge folgenden Abschnitt zur Landing Page hinzu (vor Footer):

```html
<!-- Influencer Programm -->
<section id="influencer" class="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <span class="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                👑 Für Influencer & Creator
            </span>
            <h2 class="text-4xl font-bold text-stone-900 mb-4">
                2 Wochen <span class="text-amber-600">kostenlos</span> testen
            </h2>
            <p class="text-xl text-stone-600 max-w-2xl mx-auto">
                Bist du Influencer, YouTuber oder Creator? Teste unsere App 2 Wochen kostenlos
                mit 30 Workflows oder 120 Tokens!
            </p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto border-2 border-amber-200">
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="space-y-4">
                    <h3 class="text-2xl font-bold text-stone-900">Was du bekommst:</h3>
                    <ul class="space-y-3">
                        <li class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <strong>30 Workflows</strong> oder <strong>120 Tokens</strong>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <strong>14 Tage</strong> Testphase
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                Testphase startet <strong>bei erster Nutzung</strong>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <strong>Keine Kreditkarte</strong> erforderlich
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 flex flex-col justify-center">
                    <div class="text-center">
                        <p class="text-sm text-stone-700 mb-2">Dein Influencer-Code:</p>
                        <div class="bg-white rounded-lg p-4 mb-4 border-2 border-amber-300">
                            <code class="text-2xl font-bold text-amber-600 tracking-wide">
                                INFLUENCER-2025-FREE
                            </code>
                        </div>
                        <p class="text-xs text-stone-600">
                            Kopiere diesen Code und löse ihn in der App ein!
                        </p>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <a href="auth.html" class="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition shadow-lg">
                    Jetzt kostenlos starten
                </a>
                <p class="mt-4 text-sm text-stone-500">
                    ✨ Keine Kreditkarte • Kein Abo • 2 Wochen kostenlos
                </p>
            </div>
        </div>

        <div class="mt-12 text-center">
            <p class="text-stone-600 mb-2">
                <strong>Du bist ein großer Creator (>100k Follower)?</strong>
            </p>
            <p class="text-stone-500">
                Kontaktiere uns für einen exklusiven VIP-Partner-Code mit 60 Workflows:
                <a href="mailto:support@aistormcreate.com" class="text-amber-600 hover:text-amber-700 font-semibold">
                    support@aistormcreate.com
                </a>
                oder
                <a href="tel:+4906853857982" class="text-amber-600 hover:text-amber-700 font-semibold">
                    06853/8579828
                </a>
            </p>
        </div>
    </div>
</section>
```

### **2. Navigation - Influencer Link**

Füge zum Menü hinzu:

```html
<nav>
    <a href="#features">Features</a>
    <a href="#pricing">Preise</a>
    <a href="#influencer" class="text-amber-600 font-semibold">🎁 Influencer-Code</a>
    <a href="auth.html">Login</a>
</nav>
```

### **3. index.html - Promo Code Banner**

Füge nach Login hinzu:

```html
<!-- In index.html nach dem Header -->
<div id="promo-banner-container"></div>

<!-- Am Ende vor </body> -->
<script src="js/promo-code-ui.js"></script>
<script>
  // Banner anzeigen wenn eingeloggt
  if (Auth.isLoggedIn()) {
    PromoCodeUI.showPromoCodeBanner();
  }
</script>
```

### **4. auth.html - Nach Registrierung**

```html
<script>
  // Nach erfolgreicher Registrierung
  setTimeout(() => {
    alert('🎁 Tipp: Hast du einen Influencer-Code? Löse ihn jetzt ein!');
  }, 2000);
</script>
```

---

## 📈 Tracking & Analytics

### **Verwendete Codes anzeigen**

```sql
-- Wie viele Einlösungen hat jeder Code?
SELECT
  pc.name,
  pc.code_type,
  pc.current_uses,
  pc.max_uses,
  pc.workflows_bonus,
  pc.duration_days
FROM promo_codes pc
ORDER BY pc.current_uses DESC;
```

### **User die Codes eingelöst haben**

```sql
-- Welche User haben welchen Code eingelöst?
SELECT
  u.email,
  pc.name AS code_name,
  cr.redeemed_at,
  cr.first_usage_at,
  cr.expires_at,
  cr.status
FROM code_redemptions cr
JOIN users u ON cr.user_id = u.id
JOIN promo_codes pc ON cr.promo_code_id = pc.id
ORDER BY cr.redeemed_at DESC;
```

### **Ablaufende Testphasen**

```sql
-- Welche Testphasen laufen bald ab?
SELECT
  u.email,
  pc.name AS code_name,
  cr.expires_at,
  CAST((julianday(cr.expires_at) - julianday('now')) AS INTEGER) AS days_remaining
FROM code_redemptions cr
JOIN users u ON cr.user_id = u.id
JOIN promo_codes pc ON cr.promo_code_id = pc.id
WHERE cr.expires_at > datetime('now')
  AND cr.expires_at < datetime('now', '+3 days')
ORDER BY cr.expires_at ASC;
```

---

## 🚀 Deployment-Anleitung

### **Schritt 1: Dateien commiten**

```bash
git add .
git commit -m "Add influencer promo code system"
git push
```

### **Schritt 2: Server neustarten**

```bash
# Alte Prozesse beenden
ps aux | grep "node backend/server.js" | grep -v grep | awk '{print $2}' | xargs kill

# Server starten
cd /home/user/projekt
node backend/server.js
```

### **Schritt 3: Codes testen**

```bash
# Registrierung
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"influencer@test.com","password":"test123"}'

# Code einlösen (mit JWT-Token aus Registrierung)
curl -X POST http://localhost:3000/api/promo/redeem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"code":"INFLUENCER-2025-FREE"}'
```

### **Schritt 4: Landing Page aktualisieren**

Füge den Influencer-Abschnitt zur `landing.html` hinzu (siehe oben).

---

## 📞 Support & Kontakt

**Bei Fragen oder Problemen:**
- Email: support@aistormcreate.com
- Telefon: 06853/8579828

**VIP-Partner-Codes anfordern:**
- Für Influencer mit >100k Followern
- Persönlicher Ansprechpartner
- Exklusive Benefits

---

## ✅ Checkliste

- [x] Backend-Modul `promo-codes.js` erstellt
- [x] Datenbank-Schema in V3 integriert
- [x] Frontend UI `promo-code-ui.js` erstellt
- [x] Codes generiert und in DB eingefügt
- [x] Server.js aktualisiert
- [ ] Landing Page Influencer-Bereich hinzufügen
- [ ] index.html Promo Banner integrieren
- [ ] Testen mit echten Usern
- [ ] Influencer kontaktieren

---

**🎉 System ist produktionsbereit!**

Alle Codes sind aktiv und können sofort verwendet werden.

**Nächste Schritte:**
1. Landing Page updaten
2. Influencer kontaktieren
3. Marketing starten
4. Analytics überwachen


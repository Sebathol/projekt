# 🧪 API Master - Test Setup Guide

## Lokales Testing

### Voraussetzungen

- ✅ Node.js 18+ installiert
- ✅ PostgreSQL 14+ installiert
- ✅ npm 9+ installiert
- ✅ Git installiert

### Schritt 1: Repository klonen

```bash
git clone https://github.com/your-username/api-master.git
cd api-master
```

### Schritt 2: Datenbank einrichten

#### PostgreSQL-Datenbank erstellen

**Windows:**
```cmd
psql -U postgres
CREATE DATABASE api_master_dev;
CREATE USER api_master_user WITH ENCRYPTED PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE api_master_dev TO api_master_user;
\q
```

**macOS/Linux:**
```bash
sudo -u postgres psql
CREATE DATABASE api_master_dev;
CREATE USER api_master_user WITH ENCRYPTED PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE api_master_dev TO api_master_user;
\q
```

### Schritt 3: Backend einrichten

```bash
cd backend
npm install
```

#### Environment-Variablen konfigurieren

```bash
cp .env.example .env
```

Bearbeiten Sie `.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_master_dev
DB_USER=api_master_user
DB_PASSWORD=dev_password_123

# JWT (Entwicklung - NICHT in Produktion verwenden!)
JWT_SECRET=dev_jwt_secret_key_min_32_characters_long_12345
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Encryption (Entwicklung)
ENCRYPTION_KEY=dev_encryption_key_32_chars_12
ENCRYPTION_IV=dev_iv_16_chars

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe (Test-Keys)
STRIPE_PUBLIC_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_key

# Email (optional für Tests)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASSWORD=your_mailtrap_password
```

#### Datenbank-Tabellen erstellen

```bash
npm run migrate
```

Oder manuell:

```bash
node -e "require('./config/database').sequelize.sync({force: true})"
```

#### Backend starten

```bash
npm start
# oder für Development mit Auto-Reload:
npm run dev
```

Backend läuft auf: **http://localhost:5000**

### Schritt 4: Frontend einrichten

Neues Terminal öffnen:

```bash
cd frontend
npm install
```

#### Frontend-Umgebung konfigurieren

Erstellen Sie `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_ENV=development
```

#### Frontend starten

```bash
npm run dev
```

Frontend läuft auf: **http://localhost:3000**

### Schritt 5: Testen

#### Browser öffnen

Öffnen Sie http://localhost:3000

#### Test-Account erstellen

1. Klicken Sie auf "Registrieren"
2. Füllen Sie das Formular aus:
   - Vorname: Test
   - Nachname: User
   - Email: test@example.com
   - Passwort: TestPassword123!
3. Registrieren Sie sich

#### Test-API-Key erstellen

1. Gehen Sie zu "API Keys"
2. Klicken Sie auf "Add API Key"
3. Füllen Sie aus:
   - API Name: Test API
   - API Provider: Test Provider
   - Original Key: sk-test-1234567890abcdef
   - API Endpoint: https://api.test.com
4. Erstellen Sie den Key

#### Proxy-Key testen

Kopieren Sie den generierten Proxy-Key und testen Sie:

```bash
curl -X GET http://localhost:5000/api/keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Automated Testing

### Backend-Tests

```bash
cd backend
npm test
```

### Frontend-Tests

```bash
cd frontend
npm test
```

### E2E-Tests (optional)

```bash
# Cypress installieren
npm install -D cypress

# Cypress öffnen
npx cypress open
```

---

## Docker Testing

### Docker Compose verwenden

```bash
# Im Hauptverzeichnis
docker-compose -f docker-compose.dev.yml up
```

**docker-compose.dev.yml** erstellen:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: api_master_dev
      POSTGRES_USER: api_master_user
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_dev_data:
```

---

## Test-Daten generieren

### Test-Benutzer erstellen

```javascript
// backend/scripts/seed-test-data.js
const { User, Subscription, ApiKey } = require('../database/models');

async function seedTestData() {
  // Test-User
  const user = await User.create({
    email: 'demo@apimaster.com',
    password: 'DemoPassword123!',
    firstName: 'Demo',
    lastName: 'User',
    emailVerified: true,
  });

  // Test-Subscription
  await Subscription.create({
    userId: user.id,
    plan: 'ultimate',
    billingCycle: 'monthly',
    price: 99.99,
    status: 'active',
    maxTeamMembers: 5,
    maxApis: 50,
  });

  // Test-API-Keys
  for (let i = 1; i <= 5; i++) {
    await ApiKey.create({
      userId: user.id,
      apiName: `Test API ${i}`,
      apiProvider: `Provider ${i}`,
      originalKeyEncrypted: 'encrypted_key',
      originalKeyIV: 'iv',
      originalKeyAuthTag: 'tag',
      originalKeyHash: 'hash',
      proxyKey: `APM_test_key_${i}_${'0'.repeat(40)}`,
    });
  }

  console.log('✅ Test-Daten erstellt!');
}

seedTestData();
```

Ausführen:

```bash
cd backend
node scripts/seed-test-data.js
```

---

## Performance Testing

### Load Testing mit Artillery

```bash
npm install -g artillery

# artillery.yml erstellen
artillery quick --count 10 --num 100 http://localhost:5000/health
```

**artillery.yml**:

```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'API Keys Endpoint'
    flow:
      - get:
          url: '/api/keys'
          headers:
            Authorization: 'Bearer YOUR_TEST_TOKEN'
```

Ausführen:

```bash
artillery run artillery.yml
```

---

## Mobile Testing

### iOS (macOS erforderlich)

```bash
cd mobile
npm install

# iOS-Pods installieren
cd ios && pod install && cd ..

# iOS-Simulator starten
npm run ios
```

### Android

```bash
cd mobile
npm install

# Android-Emulator starten
npm run android
```

---

## Desktop Testing

### Electron App testen

```bash
cd desktop
npm install

# Development-Modus
npm start

# Build testen
npm run build
```

---

## API-Testing mit Postman

### Postman-Collection importieren

Erstellen Sie **api-master.postman_collection.json**:

```json
{
  "info": {
    "name": "API Master",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "API Keys",
      "item": [
        {
          "name": "Get All API Keys",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "http://localhost:5000/api/keys",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "keys"]
            }
          }
        },
        {
          "name": "Create API Key",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"apiName\": \"Test API\",\n  \"apiProvider\": \"Test Provider\",\n  \"originalKey\": \"sk-test-123456\",\n  \"apiEndpoint\": \"https://api.test.com\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:5000/api/keys",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "keys"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### Port bereits belegt

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Datenbank-Verbindungsfehler

```bash
# PostgreSQL-Status prüfen
# Windows
pg_ctl status -D "C:\Program Files\PostgreSQL\14\data"

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Module nicht gefunden

```bash
# Node-Modules neu installieren
rm -rf node_modules package-lock.json
npm install
```

### CORS-Fehler

Stellen Sie sicher, dass in `backend/src/server.js` die richtige Frontend-URL konfiguriert ist:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Test-Checkliste

Vor jedem Release testen:

### Backend
- [ ] Alle API-Endpoints funktionieren
- [ ] Authentifizierung funktioniert
- [ ] API-Key-Erstellung funktioniert
- [ ] Proxy-System funktioniert
- [ ] Environment-Switching funktioniert
- [ ] Verschlüsselung funktioniert
- [ ] WebSocket-Verbindung funktioniert

### Frontend
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Dashboard lädt
- [ ] API-Keys-Seite funktioniert
- [ ] Responsive Design funktioniert
- [ ] Alle Formulare validieren
- [ ] Error-Handling funktioniert

### Integration
- [ ] Frontend → Backend Kommunikation
- [ ] WebSocket Echtzeit-Updates
- [ ] Datei-Upload funktioniert
- [ ] Zahlungsintegration (Testmodus)

### Performance
- [ ] Seiten laden in <2 Sekunden
- [ ] API-Responses in <100ms
- [ ] Keine Memory Leaks
- [ ] Keine Console-Errors

### Sicherheit
- [ ] Passwörter werden gehasht
- [ ] API-Keys werden verschlüsselt
- [ ] JWT-Tokens funktionieren
- [ ] Rate-Limiting funktioniert
- [ ] CORS korrekt konfiguriert

---

## Nächste Schritte

Nach erfolgreichem lokalen Test:

1. ✅ Staging-Deployment testen
2. ✅ Beta-User einladen
3. ✅ Feedback sammeln
4. ✅ Bugs fixen
5. ✅ Production-Deployment

---

**Viel Erfolg beim Testen!** 🧪

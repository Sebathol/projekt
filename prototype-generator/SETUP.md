# 🚀 Prototype Generator - Setup & Implementation Guide

## Status

### ✅ Komplett
- [x] React Project (Vite) Setup
- [x] Dependencies installiert
- [x] Folder Structure erstellt
- [x] Core Components (Button, LoadingSpinner, Toast)
- [x] Zustand State Management
- [x] Services (API, Storage, Export)
- [x] Utilities & Constants
- [x] Home Page
- [x] Express Backend mit Claude API Integration
- [x] All 6 API Endpoints implementiert

### ⏳ Zu tun
- [ ] Brainstorming Mode Page
- [ ] Ideafinder Mode Page
- [ ] Completion Page
- [ ] Routing & Navigation
- [ ] Frontend ↔ Backend Integration
- [ ] Testing
- [ ] Deployment

---

## 🛠️ Local Setup

### 1. Frontend Setup

```bash
cd /home/user/projekt/prototype-generator

# Install dependencies (already done)
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Frontend läuft dann auf: **http://localhost:5173**

### 2. Backend Setup

```bash
cd /home/user/projekt/prototype-generator/backend

# Create .env file with your Claude API Key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start backend
npm start
```

Backend läuft auf: **http://localhost:5000**

---

## 📁 Projekt Struktur

```
prototype-generator/
├── src/                          # Frontend (React)
│   ├── pages/
│   │   ├── Home.jsx             # ✅ DONE
│   │   ├── BrainstormingMode.jsx # ⏳ TODO
│   │   ├── IdefinderMode.jsx     # ⏳ TODO
│   │   └── Completion.jsx        # ⏳ TODO
│   ├── components/
│   │   ├── Button.jsx            # ✅ DONE
│   │   ├── LoadingSpinner.jsx    # ✅ DONE
│   │   ├── Toast.jsx             # ✅ DONE
│   │   └── ... (mehr Components)
│   ├── services/
│   │   ├── apiService.js         # ✅ DONE
│   │   ├── storageService.js     # ✅ DONE
│   │   ├── exportService.js      # ✅ DONE
│   ├── store/
│   │   └── appStore.js           # ✅ DONE (Zustand)
│   ├── utils/
│   │   ├── validators.js         # ✅ DONE
│   │   └── constants.js          # ✅ DONE
│   ├── App.jsx                   # ⏳ TODO (Routing)
│   └── index.jsx                 # ⏳ TODO
│
├── backend/                       # Node.js Express
│   ├── server.js                 # ✅ DONE (6 API Endpoints)
│   ├── .env.example              # ✅ DONE
│   └── package.json              # ✅ DONE
│
├── package.json                  # ✅ DONE
├── vite.config.js                # ⏳ TODO
└── SETUP.md                       # 📄 This file
```

---

## 🔑 API Endpoints (Backend)

### 1. Brainstorming Chat
```
POST /api/brainstorm/chat

Body: {
  message: "Benutzer Antwort",
  chatHistory: [...],
  topic: "Original Idee"
}

Response: {
  reply: "AI Antwort",
  tokensUsed: 250
}
```

### 2. Generate Ideas (Ideafinder)
```
POST /api/ideafinder/generate

Body: { topic: "SaaS für Teams" }

Response: {
  ideas: [
    {
      id: 1,
      title: "...",
      description: "...",
      scores: { ... },
      highlights: [...]
    }
  ]
}
```

### 3. Generate PRD
```
POST /api/prd/generate

Body: {
  topic: "...",
  chatHistory: [...],
  selectedIdea: {...}
}

Response: {
  prdContent: "# PRD\n...",
  tokensUsed: 3500
}
```

### 4. Optimize PRD
```
POST /api/prd/optimize

Body: {
  prdContent: "...",
  feedback: "Füge Monetisierung hinzu..."
}

Response: {
  prdContent: "# Updated PRD...",
  tokensUsed: 2000
}
```

### 5. Generate Prototype
```
POST /api/prototype/generate

Body: {
  prd: "...",
  stylePreferences: { theme: "light" }
}

Response: {
  html: "<!DOCTYPE html>...",
  tokensUsed: 5000
}
```

### 6. Customize Prototype
```
POST /api/prototype/customize

Body: {
  prototypeCode: "<!DOCTYPE html>...",
  feedback: "Buttons größer machen..."
}

Response: {
  html: "<!DOCTYPE html>...",
  tokensUsed: 3000
}
```

---

## 🎯 Nächste Schritte

### Phase 1: Complete Remaining Pages

```jsx
// src/pages/BrainstormingMode.jsx
- Topic Input Screen
- Chat Interface Screen
- PRD Viewer Screen
- Prototype Preview Screen
- Completion Screen
- Full workflow with state management

// src/pages/IdefinderMode.jsx
- Topic Input Screen
- Ideas Display & Selection
- Rest same as Brainstorming

// src/pages/Completion.jsx
- Success message
- What user received
- Export options
- Next actions
```

### Phase 2: Integrate Frontend & Backend

In `src/services/apiService.js`, use the created API endpoints:

```javascript
// apiService schon erstellt, just muss es richtig konfiguriert sein
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Phase 3: Testing & Debugging

```bash
# Frontend test
npm run dev

# Backend test
npm start

# Test endpoints mit curl:
curl -X POST http://localhost:5000/api/brainstorm/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","topic":"My idea"}'
```

---

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
NODE_ENV=development
```

---

## 📦 Dependencies

### Frontend
- **react** - UI Framework
- **react-router-dom** - Routing
- **zustand** - State Management
- **axios** - HTTP Client
- **markdown-it** - Markdown Rendering
- **jszip** - ZIP Creation
- **date-fns** - Date Formatting

### Backend
- **express** - Web Framework
- **cors** - Cross-Origin Handling
- **dotenv** - Environment Variables
- **@anthropic-ai/sdk** - Claude API

---

## 🚀 Quick Start (After Pages are Done)

```bash
# Terminal 1: Frontend
cd /home/user/projekt/prototype-generator
npm run dev

# Terminal 2: Backend
cd /home/user/projekt/prototype-generator/backend
npm start

# Then open browser:
# Frontend: http://localhost:5173
# Backend Health: http://localhost:5000/api/health
```

---

## 📋 Checklist für Completion

### Frontend Pages
- [ ] BrainstormingMode.jsx (Input + Chat + PRD + Prototype + Complete)
- [ ] IdefinderMode.jsx (Input + Ideas + Rest)
- [ ] Completion.jsx (Success screen)
- [ ] App.jsx (Routing setup)
- [ ] index.jsx (Entry point)
- [ ] App.css (Global styles)

### Styling
- [ ] Global CSS (Tailwind or custom)
- [ ] Component Styles
- [ ] Responsive Design
- [ ] Dark Mode (optional)

### Integration
- [ ] Connect apiService to actual endpoints
- [ ] Test all workflows end-to-end
- [ ] Error handling & notifications
- [ ] Loading states
- [ ] Session persistence

### Deployment
- [ ] Frontend: Vercel/Netlify
- [ ] Backend: Heroku/AWS/Cloud Run
- [ ] Environment variables setup
- [ ] CORS configuration
- [ ] Production build & optimization

---

## 🐛 Debugging Tips

### Backend Logs
```bash
# Enable detailed logging
DEBUG=express:* npm start
```

### Frontend Console
```javascript
// Check state in browser console
import { useAppStore } from './store/appStore';

// In component:
const state = useAppStore();
console.log('App State:', state);
```

### Network Requests
```javascript
// In Network tab of DevTools, check:
// 1. API responses
// 2. CORS headers
// 3. Request/response payloads
```

---

## 📞 Support Resources

- **Claude API Docs:** https://docs.anthropic.com
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **Zustand Docs:** https://github.com/pmndrs/zustand

---

## 🎉 You're Ready!

The foundation is set. Now complete the remaining pages and integrate everything. The architecture is solid and scalable!

**Happy coding!** 🚀

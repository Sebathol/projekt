# 🚀 Prototype Generator - AI-powered Ideation & Prototyping

**The fastest way to turn your business idea into a production-ready frontend prototype.**

---

## 📱 What is Prototype Generator?

A revolutionary AI-powered system that transforms business ideas into **95% production-ready frontend prototypes in under 30 minutes**.

### Two Smart Modes:

1. **🧠 Brainstorming Mode** - Expand your idea with AI (8 iterations)
2. **💡 Ideafinder Mode** - Generate 3 business ideas with market scoring

Both lead to:
- ✅ Professional PRD (Product Requirements Document)
- ✅ Functional Frontend Prototype (HTML5 + CSS3 + JavaScript)
- ✅ Multiple Export Formats (ZIP, JSON, Markdown, PDF)

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Chat | Claude-powered brainstorming & idea expansion |
| 📋 Auto PRD | Automatically generate professional PRDs |
| 💻 Code Gen | 95% production-ready HTML/CSS/JS prototypes |
| 🎨 Live Customization | Edit prototypes via chat (up to 8 times) |
| 📦 Multi-Export | ZIP, HTML, JSON, Markdown, PDF |
| ⚡ Ultra-Fast | From idea to prototype in < 30 minutes |
| 📱 Responsive | Works on Mobile, Tablet, Desktop |

---

## 📁 Project Structure

```
/prototype-generator
├── src/                          # React Frontend
│   ├── pages/                   # Main pages
│   │   ├── Home.jsx            # ✅ Landing page
│   │   ├── BrainstormingMode/  # ⏳ Brainstorm workflow
│   │   ├── IdefinderMode/      # ⏳ Ideafinder workflow
│   │   └── Completion/         # ⏳ Success screen
│   ├── components/              # React components
│   │   ├── Button.jsx          # ✅ Button component
│   │   ├── LoadingSpinner.jsx  # ✅ Loading state
│   │   ├── Toast.jsx           # ✅ Notifications
│   │   └── ...                 # More components
│   ├── services/                # API & Utilities
│   │   ├── apiService.js       # ✅ Backend API client
│   │   ├── storageService.js   # ✅ LocalStorage wrapper
│   │   └── exportService.js    # ✅ Export functionality
│   ├── store/                   # State Management
│   │   └── appStore.js         # ✅ Zustand store
│   ├── utils/                   # Helpers
│   │   ├── validators.js       # ✅ Input validation
│   │   └── constants.js        # ✅ App constants
│   └── App.jsx                 # ⏳ Main app + routing
│
├── backend/                      # Express.js Backend
│   ├── server.js               # ✅ Express server
│   ├── .env.example            # ✅ Config template
│   └── package.json            # ✅ Backend deps
│
├── SETUP.md                     # Setup & Implementation Guide
├── PRD.md                       # Product Requirements Document
└── package.json                 # Frontend deps
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Anthropic Claude API Key (free tier available)

### 1. Clone & Setup

```bash
# Navigate to project
cd /home/user/projekt/prototype-generator

# Install frontend dependencies (already done)
npm install

# Setup backend
cd backend
npm install
```

### 2. Configure Environment

**Frontend** (.env):
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Backend** (.env):
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
# Get one free from: https://console.anthropic.com
```

### 3. Run Development

**Terminal 1 - Frontend:**
```bash
cd /home/user/projekt/prototype-generator
npm run dev
# Opens: http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd /home/user/projekt/prototype-generator/backend
npm start
# Runs on: http://localhost:5000
```

---

## 🔧 Current Status

### ✅ Completed
- [x] React + Vite setup
- [x] Zustand state management
- [x] Core components (Button, Spinner, Toast)
- [x] API service layer
- [x] Storage service (localStorage)
- [x] Export service (ZIP, JSON, etc)
- [x] Home page with marketing content
- [x] Express backend with 6 API endpoints
- [x] Claude AI integration
- [x] Input validators & constants

### ⏳ Remaining (Estimated 4-6 hours)
- [ ] Brainstorming Mode pages
- [ ] Ideafinder Mode pages
- [ ] Completion screen
- [ ] Routing setup (App.jsx)
- [ ] End-to-end integration testing
- [ ] Production build & optimization

---

## 📖 Implementation Guide

For detailed setup & implementation instructions, see **[SETUP.md](SETUP.md)**

Key sections:
- Local development setup
- API endpoint documentation
- Step-by-step to-do list
- Debugging tips
- Deployment instructions

---

## 🎯 API Endpoints

All endpoints available at `http://localhost:5000/api`

### Core Endpoints

1. **POST /brainstorm/chat** - AI-powered chat for brainstorming
2. **POST /ideafinder/generate** - Generate 3 business ideas
3. **POST /prd/generate** - Auto-generate PRD
4. **POST /prd/optimize** - Refine PRD via chat
5. **POST /prototype/generate** - Generate HTML prototype
6. **POST /prototype/customize** - Customize prototype

See SETUP.md for full request/response examples.

---

## 💡 How It Works

### Brainstorming Flow
```
1. Enter Idea (10-500 chars)
   ↓
2. AI Chat Expansion (up to 8 iterations)
   - Answer AI questions about your idea
   - Refine concept together
   ↓
3. Auto-Generate PRD
   - Professional PRD created automatically
   - Optionally refine via chat (up to 8x)
   ↓
4. Generate Prototype
   - 95% production-ready code generated
   - Live preview available
   - Customize via chat (up to 8x)
   ↓
5. Export & Done
   - Download as ZIP, HTML, JSON, or Markdown
   - Ready to share or develop further
```

### Ideafinder Flow
```
1. Enter Topic/Industry
   ↓
2. Get 3 AI-Generated Ideas
   - Each with market scoring
   - Risk analysis
   - Highlights
   ↓
3-5. Same as Brainstorming (PRD → Prototype → Export)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (can add)
- **JSZip** - ZIP file creation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Claude API** - AI/LLM
- **CORS** - Cross-origin handling

### Storage
- **LocalStorage** - Client-side (MVP)
- **Firebase/Supabase** - Cloud (Phase 2)
- **PostgreSQL** - Database (Phase 2)

---

## 📊 Project Statistics

- **Total Files**: 20+
- **Frontend Code**: ~2000 lines
- **Backend Code**: ~600 lines
- **Configuration**: package.json, vite.config.js, .env
- **Documentation**: SETUP.md, PRD.md, README.md

---

## 🚀 Deployment

### Frontend
```bash
npm run build  # Creates dist folder

# Deploy to:
# - Vercel: npx vercel deploy
# - Netlify: Drag & drop dist folder
# - GitHub Pages: Push to gh-pages branch
```

### Backend
```bash
# Deploy to:
# - Heroku: git push heroku main
# - Railway: Connect GitHub repo
# - AWS EC2: Push Docker container
# - Google Cloud Run: Deploy Container
```

---

## 📝 Environment Configuration

### Development
```
VITE_API_URL=http://localhost:5000/api
ANTHROPIC_API_KEY=sk-ant-...
```

### Production
```
VITE_API_URL=https://api.prototypegenerator.com/api
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=production
```

---

## 🧪 Testing

### Manual Testing
1. Start both frontend & backend
2. Navigate to http://localhost:5173
3. Click "Brainstorming" or "Ideafinder"
4. Follow the workflow
5. Check Network tab in DevTools for API calls

### API Testing
```bash
# Test brainstorming endpoint
curl -X POST http://localhost:5000/api/brainstorm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What do you think?",
    "topic": "A fitness app idea",
    "chatHistory": []
  }'
```

---

## 📦 Dependencies

### Frontend (see package.json)
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "axios": "^1.x",
  "jszip": "^3.x",
  "date-fns": "^2.x"
}
```

### Backend (see backend/package.json)
```json
{
  "express": "^5.x",
  "@anthropic-ai/sdk": "^0.7.x",
  "cors": "^2.x",
  "dotenv": "^17.x"
}
```

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure backend is running on http://localhost:5000
- Check CORS headers in Express middleware

### Claude API Errors
- Verify API key is valid
- Check you have credits/quota
- Look at response error messages

### State Not Persisting
- Check browser localStorage in DevTools
- Verify Zustand middleware is configured correctly

---

## 📚 Resources

- **Claude API Docs**: https://docs.anthropic.com
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Vite Docs**: https://vitejs.dev

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

MIT License - Free to use and modify

---

## 🎉 Next Steps

1. **Complete the Brainstorming & Ideafinder pages** (see SETUP.md for templates)
2. **Test end-to-end workflows**
3. **Optimize performance** (Lighthouse score > 85)
4. **Deploy to production** (Vercel + Railway/Heroku)

**Total time to MVP: 6-10 hours of implementation work**

---

## 📞 Support

- Check SETUP.md for detailed implementation guide
- See PRD.md for technical requirements
- Review API documentation in backend/server.js
- Check component props in src/components/

---

**Built with ❤️ by Ai Storm Create**

*Transforming ideas into reality, one prototype at a time.*

---

**Version**: 1.0 MVP
**Last Updated**: November 2025
**Status**: In Development

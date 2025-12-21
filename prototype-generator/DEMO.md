# 🎬 Prototype Generator - Complete Demo Guide

**Version**: 1.0
**Status**: ✅ Phase 1 + 2 Complete, Phase 3 Ready
**Last Updated**: 2025-12-21

---

## 🚀 Quick Start (5 minutes)

### Option 1: Automatic Setup
```bash
chmod +x setup-demo.sh
./setup-demo.sh
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd prototype-generator/backend
npm start
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd prototype-generator
npm run dev
# Runs on http://localhost:5173
```

Then open: **http://localhost:5173**

---

## 📋 Demo Credentials

```
Email:    demo@example.com
Password: demo12345
```

---

## 🎯 Demo Features to Test

### Phase 1: Core Features ✅ COMPLETE

#### 1. **Home Page** (`/`)
- [ ] Landing page displays correctly
- [ ] Gradient hero section visible
- [ ] Two mode cards (Brainstorming & Ideafinder) clickable
- [ ] Features grid with 6 items
- [ ] "How It Works" section
- [ ] FAQ visible
- [ ] Responsive on mobile/tablet/desktop

#### 2. **Brainstorming Mode** (`/brainstorming`)
- [ ] Phase 1: Enter topic (10-500 chars)
  - [ ] Character counter works
  - [ ] Topic validation enforced
- [ ] Phase 2: AI Chat (max 8 turns)
  - [ ] Send message to AI mentor
  - [ ] Receive AI response
  - [ ] Chat history displays correctly
  - [ ] Auto-scroll to latest message
  - [ ] Typing indicator shows
  - [ ] Max 8 turns enforced
- [ ] Phase 3: PRD Generation
  - [ ] PRD renders with markdown formatting
  - [ ] Export buttons work (Markdown, JSON, Copy)
  - [ ] Can navigate back to chat
- [ ] Phase 4: Prototype Generation
  - [ ] HTML preview renders in iframe
  - [ ] Responsive toggle (Mobile/Tablet/Desktop)
  - [ ] Customization feature works (max 8 iterations)
  - [ ] Export options work (ZIP, HTML, Code, Session)
- [ ] Phase 5: Completion
  - [ ] Success screen displays
  - [ ] Animation plays (bouncing emoji)
  - [ ] Deliverables listed
  - [ ] Download & Return buttons work

#### 3. **Ideafinder Mode** (`/ideafinder`)
- [ ] Phase 1: Enter topic
- [ ] Phase 2: View 3 generated ideas
  - [ ] Ideas display with title & description
  - [ ] 5 scoring metrics visible (0-10 scale)
  - [ ] Progress bars for scores
  - [ ] Idea selection works
- [ ] Phase 3: AI Chat expansion (same as Brainstorming Phase 2)
- [ ] Phase 4: PRD Generation (same as Brainstorming Phase 3)
- [ ] Phase 5: Prototype (same as Brainstorming Phase 4)
- [ ] Phase 6: Completion (same as Brainstorming Phase 5)

#### 4. **Export Functionality**
- [ ] **ZIP Export**: Creates file with:
  - [ ] index.html
  - [ ] styles.css
  - [ ] script.js
  - [ ] README.md
  - [ ] metadata.json
- [ ] **HTML Export**: Single file with all CSS/JS embedded
- [ ] **JSON Export**: Session data with all project info
- [ ] **Markdown Export**: PRD as .md file
- [ ] **Copy to Clipboard**: Code copies successfully

---

### Phase 2: Authentication & Database ✅ COMPLETE

#### 5. **Authentication**
- [ ] **Register Page** (`/register`)
  - [ ] Form validation (email, username, password)
  - [ ] Password strength requirement (8+ chars)
  - [ ] Confirm password match
  - [ ] Account created successfully
  - [ ] Redirects to home after registration
  - [ ] Link to login page works

- [ ] **Login Page** (`/login`)
  - [ ] Login with demo@example.com / demo12345
  - [ ] Invalid credentials rejected
  - [ ] Session persists on page refresh
  - [ ] Link to register page works
  - [ ] Token stored in localStorage

#### 6. **User Dashboard** (`/dashboard`)
- [ ] User greeting displays correct name
- [ ] **Quota Display**:
  - [ ] Token usage bar shows 25%
  - [ ] Budget usage bar shows 35%
  - [ ] Remaining tokens displayed
  - [ ] Remaining budget displayed
  - [ ] Reset date shown
- [ ] **Projects List**:
  - [ ] 2 demo projects display
  - [ ] "AI Scheduling Assistant" (Brainstorming mode)
  - [ ] "Health & Fitness App" (Ideafinder mode)
  - [ ] Open project button works
  - [ ] Delete project (with confirmation)
- [ ] **New Project Button**: Redirects to home
- [ ] **Logout Button**: Clears session, redirects to login

#### 7. **Protected Routes**
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`
- [ ] Unauthenticated access to `/brainstorming` redirects to `/login`
- [ ] Unauthenticated access to `/ideafinder` redirects to `/login`
- [ ] Authenticated users can access all protected routes

#### 8. **API Integration**
- [ ] All API calls use JWT authentication
- [ ] Tokens sent in Authorization header
- [ ] Error responses handled gracefully
- [ ] Rate limiting enforced (visible in response headers)
- [ ] Cost tracking working (responses include token usage)

---

### Phase 3: Advanced Features (⏳ READY FOR IMPLEMENTATION)

**Note**: Phase 3 components are designed but not yet implemented in UI.
Database and API planning complete. See `PHASE_3_IMPLEMENTATION.md` for details.

#### 9. **Account Settings** (Planned)
```
Routes planned:
GET    /api/settings/profile
PUT    /api/settings/profile
PUT    /api/settings/password
GET    /api/settings/notifications
PUT    /api/settings/notifications
POST   /api/settings/api-keys
GET    /api/settings/api-keys
DELETE /api/settings/api-keys/:id
```

#### 10. **Stripe Payments** (Planned)
```
3-Tier Pricing:
- Free:       $0/month   (100k tokens)
- Pro:        $29/month  (1M tokens)
- Enterprise: $99/month  (Unlimited)

Routes planned for subscription, invoicing, webhooks
```

#### 11. **Analytics Dashboard** (Planned)
```
Metrics to track:
- Project views
- Edits per project
- Tokens used
- Cost breakdown
- Usage trends over time
```

#### 12. **Advanced Projects** (Planned)
```
Features:
- Favorite projects
- Project tags
- Version history
- Project templates
- Bulk operations
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Brainstorming Workflow (10 min)
1. Login with demo credentials
2. Go to Dashboard
3. Click "Brainstorming" on home page
4. Enter topic: "AI-powered recipe suggestion app"
5. Chat with AI (2-3 turns)
6. Generate PRD
7. Generate Prototype
8. Export as ZIP
9. Check downloaded file

**Expected Result**: ZIP file contains all project assets

### Scenario 2: Complete Ideafinder Workflow (12 min)
1. Login
2. Go to home page
3. Click "Ideafinder"
4. Enter topic: "Mobile health and wellness apps"
5. Review 3 generated ideas
6. Select best idea
7. Chat with AI (2-3 turns)
8. Generate PRD
9. Generate Prototype
10. Export as ZIP

**Expected Result**: Project saved with all data

### Scenario 3: Project Persistence (5 min)
1. Login to dashboard
2. Open "AI Scheduling Assistant" project
3. View PRD and Prototype
4. Go back to dashboard
5. Open same project again
6. Verify all data is restored

**Expected Result**: Project data persists across sessions

### Scenario 4: Prototype Customization (8 min)
1. Open any project in Brainstorming mode
2. Go to Phase 4 (Prototype)
3. Click "Responsive Mode Toggle"
4. Try Mobile (320px), Tablet (768px), Desktop
5. Enter customization feedback (e.g., "Make buttons larger")
6. Apply customization
7. View updated prototype

**Expected Result**: Prototype updates with feedback

### Scenario 5: Cost Tracking (3 min)
1. Login to dashboard
2. Check quota display
3. Note token usage: 25,000 / 100,000
4. Note budget: $3.50 / $10.00
5. Open a project and check analytics

**Expected Result**: Accurate usage metrics displayed

---

## 🔍 API Testing (with curl)

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo12345"
  }'
```

### Test Brainstorm Chat (requires token)
```bash
TOKEN="<access_token_from_login>"

curl -X POST http://localhost:5000/api/brainstorm/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my target audience?",
    "chatHistory": [],
    "topic": "AI scheduling assistant",
    "projectId": "project-id"
  }'
```

### Test Quota
```bash
curl -X GET http://localhost:5000/api/quota \
  -H "Authorization: Bearer $TOKEN"
```

### Test Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Demo Data Summary

### User
- Email: demo@example.com
- Name: Demo User
- Status: Active

### Quota
- Tokens Used: 25,000 / 100,000 (25%)
- Budget: $3.50 / $10.00 (35%)
- Reset Date: Next month

### Projects
1. **AI Scheduling Assistant** (Brainstorming)
   - Views: 5
   - Edits: 2
   - Tokens: 5,000
   - Cost: $0.75
   - Status: Favorite

2. **Health & Fitness App** (Ideafinder)
   - Views: 3
   - Edits: 1
   - Tokens: 3,500
   - Cost: $0.52
   - Status: Active

### Templates
1. SaaS Starter
2. Mobile App
3. E-Commerce

### API Keys
- 1 active API key (shown during seed)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version (should be 16+)
node --version

# Clear dependencies and reinstall
rm -rf node_modules
npm install

# Check .env file exists
ls -la backend/.env

# Check database
rm backend/dev.db  # Optional: reset database
npx prisma migrate deploy
```

### Frontend won't start
```bash
# Check npm version
npm --version

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Vite config
cat vite.config.js
```

### Database errors
```bash
# Reset database
cd backend
rm dev.db
npx prisma migrate deploy
node scripts/seed.js
```

### CORS errors
- Ensure backend is running on http://localhost:5000
- Ensure frontend is running on http://localhost:5173
- Check CORS middleware in server.js

---

## 📈 Performance Metrics

Expected performance on demo:
- **Home Page Load**: < 2 seconds
- **Login**: < 1 second
- **Dashboard Load**: < 2 seconds
- **AI Chat Response**: 5-15 seconds (Claude API latency)
- **PRD Generation**: 10-20 seconds
- **Prototype Generation**: 15-30 seconds

---

## ✅ Testing Checklist

- [ ] All pages load without errors
- [ ] Authentication flow works
- [ ] Both modes (Brainstorming & Ideafinder) functional
- [ ] All 5 phases per mode complete
- [ ] Export formats work (ZIP, HTML, JSON, Markdown)
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Dashboard displays correct data
- [ ] Project persistence works
- [ ] API responses include token usage
- [ ] Rate limiting enforced
- [ ] No console errors
- [ ] No memory leaks
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Loading states show correctly

---

## 📸 Screenshots & Flow

### User Journey
```
Home
 ↓
Login/Register
 ↓
Dashboard (Projects & Quota)
 ↓
Choose Mode (Brainstorming or Ideafinder)
 ↓
Phase 1: Input
 ↓
Phase 2: AI Chat
 ↓
Phase 3: PRD Generation
 ↓
Phase 4: Prototype Generation
 ↓
Phase 5: Completion & Export
 ↓
Back to Dashboard or Create New Project
```

---

## 🎓 What You're Testing

### Frontend (React)
- ✅ React Router for navigation
- ✅ Zustand for state management
- ✅ Axios for API calls
- ✅ CSS utilities for styling
- ✅ Form validation
- ✅ Error handling

### Backend (Express)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Prisma ORM
- ✅ Claude API integration
- ✅ Rate limiting
- ✅ Cost tracking
- ✅ Error handling

### Database (SQLite)
- ✅ User management
- ✅ Project persistence
- ✅ Session tracking
- ✅ Cost logging
- ✅ Quota management

---

## 🚀 Next Steps After Demo

1. **Review Phase 3 Implementation Guide** (`PHASE_3_IMPLEMENTATION.md`)
2. **Implement Advanced Features**:
   - Account Settings UI
   - Stripe Integration
   - Analytics Dashboard
   - Advanced Project Features
3. **Deployment**:
   - Frontend: Vercel/Netlify
   - Backend: Railway/Heroku
   - Database: PostgreSQL on production
4. **Monitoring**:
   - Error tracking (Sentry)
   - Analytics (PostHog)
   - Uptime monitoring

---

**Demo Status**: ✅ READY
**Last Tested**: 2025-12-21
**Estimated Demo Duration**: 30-45 minutes

Enjoy the demo! 🎉

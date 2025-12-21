# ⚡ Quick Start Guide (5 minutes)

## 🎯 Start Here

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- ~500MB disk space

### Step 1: Install Dependencies (2 min)

```bash
# Install backend dependencies
cd backend
npm install

# Back to root, install frontend dependencies
cd ..
npm install
```

### Step 2: Start Services (1 min)

**Option A: Automatic (Recommended)**
```bash
chmod +x setup-demo.sh
./setup-demo.sh
```

**Option B: Manual - Terminal 1 (Backend)**
```bash
cd backend
npm start
# Should see: 🚀 Prototype Generator Backend running on http://localhost:5000
```

**Option B: Manual - Terminal 2 (Frontend)**
```bash
npm run dev
# Should see: Local: http://localhost:5173
```

### Step 3: Open in Browser (1 min)

Navigate to: **http://localhost:5173**

### Step 4: Login (1 min)

Demo Credentials:
- **Email**: demo@example.com
- **Password**: demo12345

---

## 🎮 Try These Features

### 1️⃣ View Dashboard
- Click "Login" on home page
- See quota usage and saved projects
- Check "AI Scheduling Assistant" project

### 2️⃣ Create Brainstorming Project
- Click "Brainstorming Mode" on home
- Enter topic: "Mobile fitness app"
- Chat with AI 2-3 times
- Generate PRD (wait 10-20 seconds)
- Generate Prototype
- Export as ZIP

### 3️⃣ Create Ideafinder Project
- Click "Ideafinder Mode" on home
- Enter topic: "SaaS for remote teams"
- View 3 AI-generated ideas
- Select best idea
- Continue with chat, PRD, prototype

### 4️⃣ Test Responsiveness
- In prototype phase, toggle between:
  - 📱 Mobile (320px)
  - 📱 Tablet (768px)
  - 💻 Desktop
- See how prototype adapts

### 5️⃣ Export Project
- After prototype generation
- Try all export formats:
  - ZIP (complete package)
  - HTML (single file)
  - JSON (data export)
  - Markdown (PRD only)

---

## 📊 What You'll See

### Home Page
- Landing page with hero section
- Two mode selection cards
- Features grid
- FAQ section

### Dashboard
- Greeting with user name
- **Quota Cards**:
  - 25,000 / 100,000 tokens used
  - $3.50 / $10.00 budget used
- **Project List**:
  - 2 demo projects
  - Open/Delete buttons
- New Project button

### Brainstorming Mode
- **Phase 1**: Enter your idea
- **Phase 2**: Chat with AI mentor (8 turns max)
- **Phase 3**: View generated PRD
- **Phase 4**: See prototype in iframe
  - Responsive toggle
  - Customization input (8 iterations max)
- **Phase 5**: Success screen + exports

### Ideafinder Mode
- **Phase 1**: Enter topic for ideas
- **Phase 2**: View 3 ideas with scoring
  - Market Potential
  - Complexity
  - Relevance
  - Risk
  - Value
- **Phases 3-6**: Same as Brainstorming

---

## 🔧 Useful Commands

```bash
# Reset database
cd backend
rm dev.db
npx prisma migrate deploy
node scripts/seed.js

# View database
npx prisma studio

# Check logs
tail -f backend/server.log  # If log file exists

# Test API endpoint
curl http://localhost:5000/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## 🚨 If Something Breaks

### Port already in use
```bash
# Find what's using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Find what's using port 5173
lsof -i :5173
```

### Database locked
```bash
cd backend
rm dev.db
npx prisma migrate deploy
node scripts/seed.js
```

### Import errors
```bash
# Clear node modules
rm -rf node_modules
npm install

# Reinstall backend
cd backend
rm -rf node_modules
npm install
```

---

## 📱 Demo Credentials

| Field | Value |
|-------|-------|
| Email | demo@example.com |
| Password | demo12345 |
| Username | demouser |

---

## 🎯 Expected Results

✅ Backend starts on http://localhost:5000
✅ Frontend starts on http://localhost:5173
✅ Can login with demo credentials
✅ Dashboard shows 2 projects
✅ Can create new brainstorming project
✅ Can create new ideafinder project
✅ Can chat with AI
✅ Can generate PRD
✅ Can generate Prototype
✅ Can export as ZIP/HTML/JSON/Markdown
✅ No console errors

---

## ⏱️ Estimated Times

| Action | Duration |
|--------|----------|
| Install dependencies | 2 min |
| Start backend | 1 min |
| Start frontend | 1 min |
| Login | 1 min |
| View dashboard | 1 min |
| Create brainstorming project | 5 min |
| Generate PRD | 15 sec |
| Generate Prototype | 20 sec |
| Export as ZIP | 5 sec |
| **Total for full demo** | **30-45 min** |

---

## 📚 More Info

- **Full Demo Guide**: See `DEMO.md`
- **Testing Guide**: See `TESTING.md`
- **Phase 3 Specs**: See `PHASE_3_IMPLEMENTATION.md`
- **Setup Guide**: See `SETUP.md`
- **API Docs**: See `README.md`

---

## 🎉 You're Ready!

```bash
# Open browser to:
http://localhost:5173

# Login with:
Email: demo@example.com
Password: demo12345

# Start exploring!
```

Enjoy! 🚀

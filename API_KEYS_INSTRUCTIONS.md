# 🔑 API Keys Setup Instructions

## Quick Start - Where to Add Your Keys

### Step 1: Create Backend .env File

Navigate to the `backend` folder and create a file named `.env`:

```bash
cd backend
copy .env.example .env
```

Or manually create `backend/.env` with this content:

```env
# Backend Port
PORT=5000

# Database (existing)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sih_block_planning

# Supabase (existing - optional)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret (existing)
JWT_SECRET=sih_railway_secret_key_2026

# ML Service (existing - optional)
ML_SERVICE_URL=http://localhost:8000

# Anthropic (existing - optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Indian Railways API (existing - optional)
RAILWAY_API_KEY=your_railway_api_key_here
RAILWAY_API_HOST=irctc1.p.rapidapi.com

# 🚀 GROQ API KEY - REQUIRED FOR AI ENGINE
GROQ_API_KEY=PASTE_YOUR_GROQ_KEY_HERE
```

---

## Step 2: Get Your Groq API Key

### Option A: You Already Have the Key
If you have your Groq API key ready:
1. Open `backend/.env`
2. Find the line: `GROQ_API_KEY=PASTE_YOUR_GROQ_KEY_HERE`
3. Replace `PASTE_YOUR_GROQ_KEY_HERE` with your actual key
4. Save the file
5. Restart the backend server

**Example:**
```env
GROQ_API_KEY=gsk_abc123def456ghi789jkl012mno345pqr678
```

### Option B: Get a New Key from Groq
1. Go to: https://console.groq.com
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key
6. Paste it in `backend/.env` as shown above

---

## Step 3: Optional - Railway API Key

The Railway API key is **optional** and only needed for live train data integration.

For the demo with synthetic data, **you don't need this**.

If you want to add it later:
1. Get key from: https://rapidapi.com/hub
2. Search for "IRCTC" or railway APIs
3. Subscribe to an API
4. Copy your RapidAPI key
5. Add to `backend/.env`:
   ```env
   RAILWAY_API_KEY=your_actual_railway_key
   RAILWAY_API_HOST=irctc1.p.rapidapi.com
   ```

---

## Verification

After adding your Groq API key, run:

```bash
node verify-setup.js
```

You should see:
```
✅ All checks passed! System is ready for demonstration.
```

---

## Testing the Setup

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Should show: `Server running on port 5000`

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Should show: `Local: http://localhost:5173/`

3. **Open Browser**:
   - Go to: `http://localhost:5173`
   - Login with any department
   - Navigate to **AI Engine**
   - Click **"Run Optimization"**
   - Should see AI processing stages and results

---

## Troubleshooting

### "AI optimization service is not configured"
**Problem**: Groq API key is missing or incorrect

**Solution**:
1. Check `backend/.env` file exists
2. Verify `GROQ_API_KEY=` line has your actual key (not placeholder text)
3. Ensure no extra spaces or quotes around the key
4. Restart backend server after changes

### Backend won't start
**Problem**: Port already in use or dependencies missing

**Solution**:
```bash
cd backend
npm install
npm run dev
```

### Frontend errors
**Problem**: Dependencies not installed

**Solution**:
```bash
cd frontend
npm install
npm run dev
```

---

## What Works Without API Keys?

Even without the Groq API key configured:
- ✅ All navigation and UI
- ✅ Block request form
- ✅ Data visualization
- ✅ Timeline view
- ✅ Demo data loading
- ✅ PDF report generation
- ❌ AI optimization (requires Groq)
- ❌ What-If simulation (requires Groq)

---

## Security Notes

⚠️ **NEVER commit `.env` file to Git**

The `.env` file is already in `.gitignore`, but always verify:
```bash
# Check if .env is ignored
git status
# Should NOT show .env in the list
```

⚠️ **Keep your API keys secret**
- Don't share them in screenshots
- Don't paste them in public forums
- Rotate keys if accidentally exposed

---

## Need Help?

1. Check the setup guide: `AI_ENGINE_SETUP_GUIDE.md`
2. Run verification: `node verify-setup.js`
3. Check browser console (F12) for frontend errors
4. Check terminal for backend errors
5. Ensure both servers are running

---

## Quick Commands Reference

```bash
# Create .env file
cd backend
copy .env.example .env

# Install all dependencies
cd backend && npm install
cd frontend && npm install

# Run verification
node verify-setup.js

# Start backend
cd backend && npm run dev

# Start frontend (separate terminal)
cd frontend && npm run dev

# Open application
# Browser: http://localhost:5173
```

---

**You're ready to demonstrate the AI Engine and What-If Simulator!** 🚀

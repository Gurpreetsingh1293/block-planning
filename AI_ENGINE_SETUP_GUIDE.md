# AI Engine & What-If Simulator - Setup Guide

## Overview

The Railway Automatic Block Planning system now includes:
- **AI Engine**: Groq-powered intelligent optimization for maintenance block scheduling
- **What-If Simulator**: Interactive scenario analysis before committing to plans
- **Block Request System**: Form-based block request with persistence
- **PDF Report Generation**: Downloadable block-specific reports

---

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** (v9 or higher)
3. **Groq API Key** ([Get it here](https://console.groq.com))
4. **Railway API Key** (Optional - for live train data)

---

## Setup Instructions

### Step 1: Configure Environment Variables

#### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create `.env` file from the example:
   ```bash
   copy .env.example .env
   ```

3. **IMPORTANT**: Open `backend/.env` and add your API keys:
   ```env
   # Required for AI Engine
   GROQ_API_KEY=your_actual_groq_api_key_here
   
   # Optional - for live railway data
   RAILWAY_API_KEY=your_railway_api_key_here
   
   # Other existing keys
   PORT=5000
   DATABASE_URL=your_database_url
   ```

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

## Running the Application

### Option 1: Run Both Services Together

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Backend should start on `http://localhost:5000`

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend should start on `http://localhost:5173` (or similar Vite port)

### Option 2: Production Build

```bash
cd frontend
npm run build
npm run preview
```

---

## Demo Flow for Judges

### Complete End-to-End Demonstration

#### Phase 1: System Login
1. Open browser: `http://localhost:5173`
2. Select Department: **Engineering** (or any department except S&T)
3. Click **Sign In**

#### Phase 2: Request New Maintenance Block
1. Navigate to **AI Engine** (in left sidebar)
2. Click **"Request Block"** button
3. Fill in the form:
   - **Department**: Engineering
   - **Location**: Delhi-Mathura Section, KM 42-45
   - **Issue**: "Rail defect detected - requires immediate inspection and repair"
   - **Criticality**: Critical
   - **Urgency**: Emergency
   - **Start Time**: 21:00
   - **End Time**: 23:00
   - **Duration**: Auto-calculated (2 hours)
   - **Required Workers**: 5
   - **Required Equipment**: Tamping Machine, Rail Grinder
4. Click **"Submit Block Request"**
5. ✅ Request is saved to localStorage and appears in maintenance tasks

#### Phase 3: Run AI Optimization
1. On AI Engine page, click **"Run Optimization"**
2. Watch the processing stages:
   - "Analyzing maintenance demand..."
   - "Filtering railway timetable data..."
   - "Checking train movements..."
   - "Evaluating corridor availability..."
   - "Optimizing block combinations..."
   - "Generating final block plan..."
3. ✅ AI generates optimized schedule with:
   - Prioritized maintenance tasks
   - Recommended block windows
   - Train impact analysis
   - Task grouping suggestions
   - Detailed reasoning

#### Phase 4: Review Optimization Results
1. **Dashboard Cards** show:
   - Pending Tasks: 6
   - Critical Tasks: 3
   - Available Windows: 6
   - Optimized Blocks: Created
   - Trains Protected: All passenger trains
   - Tasks Grouped: 2+ tasks combined

2. **Timeline Visualization** displays:
   - 24-hour corridor view
   - Passenger train movements (🚆)
   - Goods train movements (📦)
   - Corridor availability (green/yellow/red)
   - AI-recommended blocks (purple bars)

3. **Optimized Block Cards** show:
   - Block ID, priority, time window
   - Department, location, duration
   - Required workers and equipment
   - Affected trains (passenger: 0, goods: minimal)
   - AI reasoning for selection

4. **AI Explanation Panel** provides:
   - Summary statistics
   - Key recommendations
   - Decision factors
   - Conflict identification

#### Phase 5: Download Block Report
1. Click on any optimized block to expand details
2. Click **"Download Block Report (PDF)"**
3. ✅ PDF is generated with:
   - Block information (ID, time, location, duration)
   - Maintenance details (tasks, assets, criticality)
   - Operational information (affected trains, risk)
   - AI recommendation and reasoning
   - Worker instructions (step-by-step)
   - Professional formatting for field use

#### Phase 6: What-If Simulation
1. Navigate to **What-If** (in left sidebar)
2. **Step 1**: Select a block from dropdown
3. **Step 2**: Choose scenario type:
   - **Shift Block Time**: Change start/end times
   - **Extend Duration**: Add hours to block
   - **Traffic Increase**: Simulate +20% traffic
   - **Emergency Task**: Add urgent work
   - **Staff Shortage**: Reduce available workers
   - **Equipment Unavailable**: Simulate equipment failure

4. **Step 3**: Configure parameters
   - Example: "Shift Time"
   - New Start: 23:00
   - New End: 01:00

5. Click **"Run Simulation"**
6. ✅ System shows:
   - **Current Plan** vs **Simulated Plan** comparison
   - **Impact Analysis**:
     - Passenger trains affected: 0 → 2
     - Goods trains affected: 0 → 1
     - Tasks delayed: 0 → 1
     - Additional downtime: +2 hours
   - **Risk Assessment**: LOW → HIGH
   - **AI Recommendation**: 
     - Action: REJECT
     - Reasoning: "Shifting block by 2 hours conflicts with passenger train schedules"
     - Alternative: "Recommended window: 21:30-23:30"

---

## Key Features Demonstrated

### 1. Intelligent Optimization (NOT Generic AI)
- ✅ Deterministic preprocessing filters railway data BEFORE AI
- ✅ LLM acts as reasoning engine, NOT database query engine
- ✅ Passenger trains treated as HARD CONSTRAINTS
- ✅ Transparent priority classification (not arbitrary scores)
- ✅ Multi-department task grouping with compatibility checks
- ✅ Corridor availability and train movements considered

### 2. Data Architecture
- ✅ Structured demo data (maintenance, timetable, corridor, goods forecast)
- ✅ localStorage persistence (simulates backend until database connected)
- ✅ Deterministic filtering by section/corridor/date
- ✅ Time window calculations and conflict detection
- ✅ Equipment and resource compatibility checks

### 3. Operational Features
- ✅ Block request form with validation
- ✅ Auto-duration calculation from time inputs
- ✅ Real-time data refresh after new requests
- ✅ PDF reports for field workers (no app access needed)
- ✅ 24-hour timeline visualization
- ✅ Train movement tracking (passenger + goods)

### 4. What-If Analysis
- ✅ 6 realistic scenario types
- ✅ Before/after comparison
- ✅ Train impact calculation
- ✅ Maintenance backlog analysis
- ✅ Resource utilization tracking
- ✅ Risk level assessment
- ✅ AI-powered recommendations with alternatives

---

## Important Notes

### API Keys

**Where to paste your keys:**

1. **Groq API Key**:
   - File: `backend/.env`
   - Line: `GROQ_API_KEY=your_actual_key_here`
   - Get key: https://console.groq.com

2. **Railway API Key** (Optional):
   - File: `backend/.env`
   - Line: `RAILWAY_API_KEY=your_key_here`
   - Get key: https://rapidapi.com/hub

### Without Groq API Key

If you don't configure GROQ_API_KEY:
- AI Engine will show: "AI optimization service is not configured"
- What-If Simulator will show error when running simulation
- All other features (data loading, visualization, forms) work normally

### Data Persistence

- Demo data is stored in localStorage
- Survives page refresh
- Reset by clearing browser data or calling `demoDataService.resetToDefaults()`
- To reset: Open browser console and run:
  ```javascript
  localStorage.clear()
  ```

---

## Architecture Principles

### Design Philosophy
This system is designed as:
```
Existing Railway Systems (TMS, SMMS, TDMS, COA, BDMS)
                ↓
        Data Integration Layer
                ↓
    Filtering + Normalization (Deterministic)
                ↓
    AI Optimization Layer (Groq)
                ↓
        Decision Support UI
                ↓
            Officer
                ↓
         Block Plan
                ↓
       Worker Report
```

### What AI Does vs What It Doesn't

**AI DOES (via Groq)**:
- Prioritization reasoning
- Task grouping suggestions
- Optimization recommendations
- Human-readable explanations
- What-if scenario analysis
- Alternative window suggestions

**AI DOES NOT**:
- Database queries
- Time arithmetic
- Train filtering
- Corridor filtering
- Duration calculations
- Conflict detection (these are deterministic)

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000

# Kill process if needed
taskkill /F /PID <process_id>

# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Groq API errors
- Verify API key is correct in `backend/.env`
- Check Groq console for quota/limits
- Ensure no extra spaces in .env file
- Restart backend after changing .env

### PDF not downloading
- Check browser popup blocker
- Verify jsPDF is installed: `npm list jspdf`
- Check browser console for errors

---

## File Structure

```
backend/
├── .env                          # ⚠️ ADD YOUR KEYS HERE
├── src/
│   ├── routes/
│   │   └── ai.routes.js         # AI API endpoints
│   ├── services/
│   │   └── groqService.js       # Groq integration
│   └── server.js

frontend/
├── src/
│   ├── pages/
│   │   ├── AIEngine.jsx         # Main AI optimization page
│   │   └── WhatIfSimulator.jsx  # Scenario analysis page
│   ├── components/
│   │   ├── aiEngine/
│   │   │   ├── TimelineVisualization.jsx
│   │   │   ├── OptimizedBlockCard.jsx
│   │   │   └── AIExplanationPanel.jsx
│   │   └── blockPlanning/
│   │       └── BlockRequestModal.jsx
│   ├── data/                    # Demo JSON datasets
│   │   ├── demoMaintenanceData.json
│   │   ├── demoRailwayTimetable.json
│   │   ├── demoGoodsForecast.json
│   │   ├── demoCorridorData.json
│   │   └── demoBlockRequests.json
│   ├── services/
│   │   ├── demoDataService.js   # Data persistence
│   │   └── aiService.js         # API client
│   └── utils/
│       ├── dataPreprocessor.js  # Deterministic filtering
│       └── reportGenerator.js   # PDF generation
```

---

## Testing Checklist

Before presenting to judges, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can log in to application
- [ ] AI Engine page loads with demo data
- [ ] Can open "Request Block" modal
- [ ] Block request form validates correctly
- [ ] Can submit new block request
- [ ] New request appears in data
- [ ] "Run Optimization" button works
- [ ] AI returns structured response (requires API key)
- [ ] Timeline visualization displays correctly
- [ ] Optimized blocks show detailed information
- [ ] Can download PDF report
- [ ] What-If page loads
- [ ] Can select block and scenario
- [ ] Simulation runs (requires API key)
- [ ] Impact analysis displays correctly
- [ ] Navigation between pages works

---

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Check backend terminal for API errors
3. Verify .env configuration
4. Ensure all dependencies are installed
5. Clear browser cache/localStorage if needed

---

## Success Criteria

The implementation is complete when:

✅ **AI Engine Page**
- Displays operational status
- Shows dashboard statistics
- Displays alerts and priorities
- Timeline visualization works
- Can request new blocks
- Groq optimization runs successfully
- Block cards show detailed info
- AI explanations are clear
- PDF reports generate correctly

✅ **What-If Simulator**
- 6 scenario types available
- Parameter configuration works
- Before/after comparison clear
- Impact analysis calculated
- Risk assessment shown
- AI recommendations provided
- All scenarios testable

✅ **Data Flow**
- Block requests persist
- Data refreshes after changes
- Preprocessing filters correctly
- AI receives clean dataset
- Results display properly

---

**The system is now ready for demonstration!** 🚀

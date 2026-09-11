/**
 * Setup Verification Script
 * Run this to check if AI Engine is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AI Engine & What-If Simulator Setup...\n');

let errors = 0;
let warnings = 0;

// Check 1: Backend dependencies
console.log('1️⃣  Checking backend dependencies...');
try {
  const backendPackage = require('./backend/package.json');
  const requiredDeps = ['groq-sdk', 'express', 'cors', 'dotenv'];
  
  requiredDeps.forEach(dep => {
    if (backendPackage.dependencies[dep]) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      console.log(`   ❌ ${dep} NOT installed`);
      errors++;
    }
  });
} catch (error) {
  console.log('   ❌ Cannot read backend/package.json');
  errors++;
}

// Check 2: Frontend dependencies
console.log('\n2️⃣  Checking frontend dependencies...');
try {
  const frontendPackage = require('./frontend/package.json');
  const requiredDeps = ['react', 'react-router-dom', 'framer-motion', 'jspdf'];
  
  requiredDeps.forEach(dep => {
    if (frontendPackage.dependencies[dep]) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      console.log(`   ❌ ${dep} NOT installed`);
      errors++;
    }
  });
} catch (error) {
  console.log('   ❌ Cannot read frontend/package.json');
  errors++;
}

// Check 3: Backend .env file
console.log('\n3️⃣  Checking backend .env configuration...');
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('GROQ_API_KEY=') && !envContent.includes('GROQ_API_KEY=your_groq_api_key_here')) {
    console.log('   ✅ GROQ_API_KEY configured');
  } else {
    console.log('   ⚠️  GROQ_API_KEY not configured (AI features will not work)');
    warnings++;
  }
  
  if (envContent.includes('PORT=')) {
    console.log('   ✅ PORT configured');
  } else {
    console.log('   ⚠️  PORT not configured (will use default)');
    warnings++;
  }
} else {
  console.log('   ❌ .env file not found');
  console.log('   💡 Copy backend/.env.example to backend/.env');
  errors++;
}

// Check 4: Critical files exist
console.log('\n4️⃣  Checking critical files...');
const criticalFiles = [
  'backend/src/routes/ai.routes.js',
  'backend/src/services/groqService.js',
  'frontend/src/pages/AIEngine.jsx',
  'frontend/src/pages/WhatIfSimulator.jsx',
  'frontend/src/components/aiEngine/TimelineVisualization.jsx',
  'frontend/src/components/aiEngine/OptimizedBlockCard.jsx',
  'frontend/src/components/aiEngine/AIExplanationPanel.jsx',
  'frontend/src/components/blockPlanning/BlockRequestModal.jsx',
  'frontend/src/services/aiService.js',
  'frontend/src/services/demoDataService.js',
  'frontend/src/utils/dataPreprocessor.js',
  'frontend/src/utils/reportGenerator.js'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} NOT FOUND`);
    errors++;
  }
});

// Check 5: Demo data files
console.log('\n5️⃣  Checking demo data files...');
const dataFiles = [
  'frontend/src/data/demoMaintenanceData.json',
  'frontend/src/data/demoRailwayTimetable.json',
  'frontend/src/data/demoGoodsForecast.json',
  'frontend/src/data/demoCorridorData.json',
  'frontend/src/data/demoBlockRequests.json'
];

dataFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   ✅ ${file} (valid JSON)`);
    } catch (error) {
      console.log(`   ⚠️  ${file} (invalid JSON)`);
      warnings++;
    }
  } else {
    console.log(`   ❌ ${file} NOT FOUND`);
    errors++;
  }
});

// Check 6: Routes configured
console.log('\n6️⃣  Checking route configuration...');
try {
  const appContent = fs.readFileSync('./frontend/src/App.jsx', 'utf8');
  
  if (appContent.includes('AIEngine')) {
    console.log('   ✅ AIEngine imported');
  } else {
    console.log('   ❌ AIEngine not imported');
    errors++;
  }
  
  if (appContent.includes('WhatIfSimulator')) {
    console.log('   ✅ WhatIfSimulator imported');
  } else {
    console.log('   ❌ WhatIfSimulator not imported');
    errors++;
  }
  
  if (appContent.includes('/ai-engine')) {
    console.log('   ✅ /ai-engine route configured');
  } else {
    console.log('   ❌ /ai-engine route not configured');
    errors++;
  }
  
  if (appContent.includes('/what-if')) {
    console.log('   ✅ /what-if route configured');
  } else {
    console.log('   ❌ /what-if route not configured');
    errors++;
  }
} catch (error) {
  console.log('   ❌ Cannot read App.jsx');
  errors++;
}

// Check 7: Navigation configured
console.log('\n7️⃣  Checking navigation...');
try {
  const sidebarContent = fs.readFileSync('./frontend/src/components/layout/Sidebar.jsx', 'utf8');
  
  if (sidebarContent.includes('AI Engine')) {
    console.log('   ✅ AI Engine in navigation');
  } else {
    console.log('   ❌ AI Engine not in navigation');
    errors++;
  }
  
  if (sidebarContent.includes('What-If')) {
    console.log('   ✅ What-If in navigation');
  } else {
    console.log('   ❌ What-If not in navigation');
    errors++;
  }
} catch (error) {
  console.log('   ❌ Cannot read Sidebar.jsx');
  errors++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! System is ready for demonstration.');
  console.log('\n📝 Next steps:');
  console.log('   1. cd backend && npm run dev');
  console.log('   2. cd frontend && npm run dev');
  console.log('   3. Open http://localhost:5173');
  console.log('   4. Navigate to AI Engine page');
  console.log('   5. Click "Run Optimization"');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(s) found - setup incomplete`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) found - may affect functionality`);
  }
  
  console.log('\n💡 Recommendations:');
  if (errors > 0) {
    console.log('   - Review the errors above');
    console.log('   - Check AI_ENGINE_SETUP_GUIDE.md for instructions');
    console.log('   - Run: npm install in both backend and frontend');
  }
  if (warnings > 0) {
    console.log('   - Configure GROQ_API_KEY in backend/.env for AI features');
    console.log('   - Get API key from https://console.groq.com');
  }
  
  process.exit(1);
}

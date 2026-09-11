# How to Delete SIG-442 Task

The SIG-442 task is stored in your browser's **localStorage**. Here are multiple ways to remove it:

---

## 🔥 **Method 1: Browser Console (FASTEST)**

1. **Open the AI Engine page** in your browser
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Paste and run this command:**

```javascript
// Delete specific task SIG-442
const tasks = JSON.parse(localStorage.getItem('railway_maintenance_tasks') || '[]');
const filtered = tasks.filter(task => task.taskId !== 'SIG-442');
localStorage.setItem('railway_maintenance_tasks', JSON.stringify(filtered));
console.log('✅ SIG-442 deleted! Refresh the page to see changes.');
location.reload();
```

5. The page will **automatically refresh** and SIG-442 will be gone!

---

## 📋 **Method 2: Using DemoDataService API**

If you want to use the service API I just added:

1. Open browser console (F12)
2. Run this command:

```javascript
// Import the service
import demoDataService from './services/demoDataService';

// Delete the task
demoDataService.deleteMaintenanceTask('SIG-442');

// Refresh to see changes
location.reload();
```

---

## 🔄 **Method 3: Reset All Data to Defaults**

If you want to reset **all demo data** (removes any custom tasks you added):

1. Open browser console (F12)
2. Run:

```javascript
// Clear all localStorage for railway data
localStorage.removeItem('railway_maintenance_tasks');
localStorage.removeItem('railway_block_requests');
localStorage.removeItem('railway_goods_forecast');
localStorage.removeItem('railway_corridor_availability');
console.log('✅ All data reset to defaults!');
location.reload();
```

3. The page will refresh with original demo data only

---

## 🛠️ **Method 4: Manual Inspection & Edit**

1. Open Developer Tools (F12)
2. Go to **Application** tab (or **Storage** in Firefox)
3. Expand **Local Storage** in left sidebar
4. Click on your site URL (e.g., `http://localhost:5173`)
5. Find key: `railway_maintenance_tasks`
6. Click to view the JSON
7. **Find and remove the SIG-442 entry**
8. Save or refresh the page

---

## 🔍 **View All Tasks in localStorage**

To see what's currently stored:

```javascript
// View all maintenance tasks
const tasks = JSON.parse(localStorage.getItem('railway_maintenance_tasks') || '[]');
console.table(tasks.map(t => ({ taskId: t.taskId, department: t.department, defect: t.defect })));
```

---

## ✅ **Verify SIG-442 is Deleted**

After deleting, verify with:

```javascript
const tasks = JSON.parse(localStorage.getItem('railway_maintenance_tasks') || '[]');
const sig442 = tasks.find(t => t.taskId === 'SIG-442');
console.log(sig442 ? '❌ SIG-442 still exists' : '✅ SIG-442 successfully deleted');
```

---

## 🎯 **Why SIG-442 Appeared**

The task `SIG-442` was likely added when:
1. You clicked "Request Block" button
2. Added a new maintenance task with Signal department
3. The system auto-generated task ID "SIG-442"
4. It was saved to localStorage
5. Now it generates a permanent alert because it's marked as Critical/Emergency

**The alerts are generated from this code:**
```javascript
// In AIEngine.jsx - generateAlerts function
tasks.forEach(task => {
  if (task.urgency === 'Emergency' || task.criticality === 'Critical') {
    newAlerts.push({
      type: 'CRITICAL',
      message: `${task.taskId}: ${task.defect} requires immediate attention`,
      taskId: task.taskId
    });
  }
});
```

---

## 🚀 **Quick Fix Script (Copy-Paste Ready)**

**Just copy-paste this entire block into browser console:**

```javascript
(function deleteSIG442() {
  const STORAGE_KEY = 'railway_maintenance_tasks';
  
  try {
    // Get current tasks
    const tasksStr = localStorage.getItem(STORAGE_KEY);
    if (!tasksStr) {
      console.warn('No maintenance tasks found in localStorage');
      return;
    }
    
    const tasks = JSON.parse(tasksStr);
    const originalLength = tasks.length;
    
    // Filter out SIG-442
    const filtered = tasks.filter(task => task.taskId !== 'SIG-442');
    
    if (filtered.length === originalLength) {
      console.warn('❌ SIG-442 not found in tasks');
      console.log('Available task IDs:', tasks.map(t => t.taskId));
    } else {
      // Save filtered tasks
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log(`✅ Successfully deleted SIG-442!`);
      console.log(`Tasks before: ${originalLength}, after: ${filtered.length}`);
      
      // Reload page
      console.log('🔄 Reloading page...');
      setTimeout(() => location.reload(), 500);
    }
  } catch (error) {
    console.error('❌ Error deleting SIG-442:', error);
  }
})();
```

---

## 📝 **Alternative: Delete ANY Task by ID**

To delete any task (replace `TASK_ID` with actual ID):

```javascript
function deleteTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem('railway_maintenance_tasks') || '[]');
  const filtered = tasks.filter(task => task.taskId !== taskId);
  localStorage.setItem('railway_maintenance_tasks', JSON.stringify(filtered));
  console.log(`✅ Deleted ${taskId}`);
  location.reload();
}

// Usage:
deleteTask('SIG-442');
deleteTask('ENG-001');
deleteTask('DEF-012');
```

---

## 🎨 **Prevent Future Permanent Tasks**

To prevent tasks from persisting permanently, you could:

1. **Add a "Delete" button** to each alert
2. **Add task expiration dates** (auto-delete old tasks)
3. **Add a "Clear Alerts" button** in the UI
4. **Mark tasks as "Completed"** instead of deleting them

Let me know if you want me to implement any of these features!

---

## ⚡ **TL;DR - Quickest Solution**

**Copy this into browser console and press Enter:**

```javascript
const tasks = JSON.parse(localStorage.getItem('railway_maintenance_tasks') || '[]');
localStorage.setItem('railway_maintenance_tasks', JSON.stringify(tasks.filter(t => t.taskId !== 'SIG-442')));
location.reload();
```

Done! 🎉

---

**Date Created:** September 11, 2026  
**Issue:** SIG-442 permanently displayed in AI Engine alerts  
**Root Cause:** Task stored in browser localStorage with Critical/Emergency priority  
**Solution:** Delete from localStorage using browser console

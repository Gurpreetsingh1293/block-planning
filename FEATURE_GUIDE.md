# S&T Operations Control Dashboard - Feature Guide

## Overview
Professional railway operations interface for the Signal & Telecommunication Department, featuring the Delhi-Mumbai corridor with comprehensive maintenance management.

---

## 🎯 Main Features

### 1. Track Diagram Visualization
**Description:** Real-time corridor view with all railway infrastructure

**Key Elements:**
- 7 stations: Delhi → Mathura → Agra → Jhansi → Bhopal → Vadodara → Mumbai
- 28 signals with 3-aspect display (Red/Yellow/Green)
- 32 points (turnouts) with position indicators
- 26 track circuits with occupancy status
- 12 track sections with maintenance overlays
- 5 active trains with location markers

**Visual Features:**
- Dark theme background (#0a0a0a) for reduced eye strain
- Bright infrastructure elements for high contrast
- Kilometer markers at each station
- UP/DN direction indicators
- Platform edge safety markings (yellow dashed lines)
- Track circuit boundary markers

### 2. Maintenance Management System

#### 2.1 Maintenance Status Display
**Color Coding:**
- 🔵 **Blue** - Scheduled (planned maintenance)
- 🟠 **Orange** - In Progress (currently being performed)
- 🔴 **Red** - Overdue (past due date)
- 🔴 **Dark Red** - Blocked (cannot proceed)
- ✅ **Green** - Clear (no maintenance required)

#### 2.2 Multi-Select Mode
**How to Use:**
1. Click "Select Maintenance" button in toolbar
2. Click on colored track sections to select/deselect
3. Selected sections show checkmark icon and pulse animation
4. View selection count and selected task chips
5. Click "View Details" to see combined information
6. Click "Clear" to deselect all

**What It Shows:**
- Selected maintenance tasks
- Combined block path requirements
- Total affected infrastructure elements

#### 2.3 Block Path Highlighting
**Purpose:** Shows infrastructure that must be isolated during maintenance

**Visual Indicators:**
- 🔵 **Cyan pulsing circles** around affected points
- 🔵 **Dashed rectangles** around affected signals
- 🔵 **Animated dashed lines** on affected tracks

**Information Panel Shows:**
- List of affected points (e.g., P1, P4, P7)
- List of affected signals (e.g., S2, S5, S8)
- List of affected tracks (e.g., UP_MAIN, DN_LOOP)
- Total element count

### 3. Filtering System

**Filter Categories:**

#### Station/Section Filter
- Dropdown selection
- Filter by specific station or view all
- Options: All Stations, Delhi, Mathura, Agra, Jhansi, Bhopal, Vadodara, Mumbai

#### Status Filter
- Multiple selection checkboxes
- Options: Scheduled, In Progress, Overdue, Blocked
- Color indicators for each status

#### Task Type Filter
- Multiple selection checkboxes
- Options:
  - 🔴 Signal
  - 🛤️ Track
  - ⚙️ Point
  - 📡 Telecom
  - ⚡ Electrical
  - 🔗 Interlocking

#### Date Range Filter
- Quick select options
- Choices: All, Today, This Week, This Month, Custom

**Filter Controls:**
- Active filter count badge
- "Reset All" button to clear filters
- Filter summary tags showing active filters
- Expand/collapse functionality

### 4. Maintenance Details Overlay

**Accessed By:**
- Clicking "View Details" when maintenance sections are selected
- Shows comprehensive information for selected task(s)

**Information Displayed:**

**Header:**
- Task ID (e.g., MAINT-001)
- Urgency level with color coding
- Current status badge

**Asset Information:**
- Asset name (e.g., "Point Machine P4")
- Location (station and section)
- Asset type icon

**Description:**
- Detailed explanation of maintenance work

**Schedule & Resources:**
- Required duration (e.g., "4 hours")
- Manpower needed (e.g., "4 technicians")
- Recommended time window
- Estimated cost

**Maintenance History:**
- Last maintenance date
- Next due date
- Overdue status (if applicable)

**Block Requirements:**
- Affected track sections
- Required block path elements (points, signals)
- Safety isolation requirements

**Controls:**
- ESC key to close
- Click outside overlay to close
- X button in top corner

### 5. Maintenance Status Side Panel

**Sections:**

#### Summary Statistics
- Grid layout with counts:
  - Scheduled tasks
  - In Progress tasks
  - Overdue tasks
  - Blocked tasks
- Total task count

#### Critical Attention Required
- Urgent priority tasks
- Blocked tasks with reason
- Red highlighted section
- Click task to view details

#### Overdue Tasks
- Tasks past due date
- Shows overdue duration
- Orange/amber highlighted
- Prioritized by urgency

#### Currently In Progress
- Active maintenance work
- Shows work start time
- Green highlighted
- Real-time status

#### Upcoming High Priority
- Next 5 high-priority tasks
- Scheduled maintenance
- Recommended time windows
- Helps with planning

#### Quick Stats
- Average duration
- Total manpower deployed
- Scheduled block windows

**Interaction:**
- All task items are clickable
- Hover for visual feedback
- Auto-updates based on filters

### 6. Point Selection & Route Setting

**Purpose:** Manually set routes through the interlocking

**How to Use:**
1. Click "Select Points" button
2. Click on two point markers
3. Selected points highlighted with checkmark
4. Click "Set Route" button
5. Route locks, signals turn green
6. Points lock in position
7. Click "Clear Route" to release

**Visual Feedback:**
- Selected points show checkmark
- Route path animates with dashed flow
- Locked points cannot be changed
- Route status panel shows active route

### 7. System Status Panel

**Monitors:**
- Signal System status
- Interlocking health
- Track Circuit occupancy (24/26 Clear)
- Point Machine health (12/12 Healthy)
- Communication status
- Active fault count

**Alert System:**
- Color-coded severity:
  - 🟢 Green - Healthy/OK
  - 🟡 Yellow - Warning
  - 🔴 Red - Critical
- Click alerts for details

### 8. Train Information Panel

**Displays:**
- Train number and name
- Current location
- Track occupancy
- Speed information
- Direction of travel

### 9. Footer Information Bar

**System Information:**
- **System Time:** Current time in IST (updates live)
- **User:** Logged in user ID (S&T Officer SNT001)
- **Station:** Current corridor code (DMC-01 · 1384 Km)
- **System Status:** OPERATIONAL with pulse indicator
- **Version:** Software version (v2.4.1)
- **Copyright:** Indian Railways S&T Department © 2024

---

## 🖱️ Interactions Guide

### Mouse Interactions
- **Hover:** Shows additional info in message bar
- **Click:** Select/interact with elements
- **Click & Drag:** Scroll track diagram horizontally

### Keyboard Shortcuts
- **ESC:** Close overlays
- **Tab:** Navigate through interactive elements
- **Enter:** Activate focused button
- **Space:** Toggle checkboxes

### Touch Interactions (Mobile)
- **Tap:** Select elements
- **Swipe:** Scroll track diagram
- **Long Press:** Show context menu (future feature)

---

## 📊 Data Display Conventions

### Railway Codes
- **Signals:** S1, S2, S3... (monospace font)
- **Points:** P1, P2, P3... (monospace font)
- **Track Circuits:** TC1, TC2, TC3... (monospace font)
- **Platforms:** PF1, PF2, PF3... (monospace font)

### Track Naming
- **UP_MAIN:** Main line, up direction (left to right)
- **DN_MAIN:** Main line, down direction (right to left)
- **UP_LOOP:** Loop line, up direction
- **DN_LOOP:** Loop line, down direction

### Time Format
- System times in IST (India Standard Time)
- 12-hour format with AM/PM
- Date format: MMM DD, YYYY

### Distance Markers
- Kilometer positions (KM 0 to KM 1384)
- Shows progression along corridor

---

## 🎨 Visual Design Principles

### Color System
**Dark Theme (Track Diagram):**
- Background: Near black (#0a0a0a)
- Tracks: Light gray (#d0d0d0)
- Active signals: Bright colors with glow
- Status overlays: Semi-transparent

**Light Theme (Controls & Panels):**
- Background: White/light gray
- Text: Navy blue (#1a3a5f)
- Accents: Railway blue (#4a9eff)

### Typography
- **Technical Codes:** Courier New (monospace)
- **Labels:** Arial (sans-serif)
- **Headers:** Bold, uppercase with letter-spacing
- **Body:** Regular weight, readable size

### Spacing & Layout
- Consistent 16px base spacing
- Card-based layout for information
- Clear visual hierarchy
- Generous whitespace

---

## 📱 Responsive Design

### Desktop (>1400px)
- Full layout with all panels
- Side-by-side arrangement
- Maximum information density

### Tablet (960px - 1400px)
- Narrower side panel
- Maintained full functionality
- Compact spacing

### Mobile (<960px)
- Stacked layout
- Side panels become horizontal cards
- Touch-optimized controls
- Scrollable content areas

---

## ♿ Accessibility Features

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus indicators on Tab navigation
- Logical tab order

### Visual Indicators
- High contrast for readability
- Color + text/icons (not color alone)
- Focus outlines (2px blue)

### Screen Reader Support
- Semantic HTML structure
- ARIA labels on controls
- Status announcements

---

## 🚀 Performance

### Optimizations
- Efficient SVG rendering
- React memoization for re-renders
- Smooth 60 FPS animations
- Lazy loading for large datasets

### Load Times
- Initial page load: ~1-2 seconds
- Filter updates: <100ms
- Smooth scrolling and interactions

---

## 💡 Tips & Best Practices

1. **Filter Before Selecting:** Use filters to narrow down maintenance tasks before multi-selecting

2. **Check Block Paths:** Always review required block paths before approving maintenance

3. **Monitor Critical Section:** Keep eye on "Critical Attention Required" panel for urgent issues

4. **Use Empty States:** If no results, adjust filters or check date range

5. **Hover for Details:** Hover over any element to see quick info in message bar

6. **Print Function:** Use browser print (Ctrl+P) for dashboard reports

7. **Refresh Data:** System updates in real-time (when backend connected)

---

## 🔧 Troubleshooting

### Issue: No maintenance tasks visible
**Solution:** Check if filters are too restrictive, click "Reset All Filters"

### Issue: Can't select maintenance sections
**Solution:** Make sure "Select Maintenance" mode is enabled (button highlighted)

### Issue: Block path not showing
**Solution:** At least one maintenance section must be selected

### Issue: Overlay won't close
**Solution:** Press ESC key or click dark area outside the overlay

### Issue: Layout looks broken
**Solution:** Refresh page, check browser zoom level (should be 100%)

---

**For additional support or feature requests, contact the S&T Department development team.**

**System Version:** 2.4.1  
**Last Updated:** 2024  
**Documentation Version:** 1.0

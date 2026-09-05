# 🗄️ Database Documentation & Schema Reference (`/database`)

This folder contains the schema reference documentation and a standalone `seed.js` script to populate a local or cloud MongoDB instance with initial test datasets.

---

## 🚀 Running the Seed Script

Populate your database with sample railway track sections, passenger/freight timetables, and maintenance requests:

```powershell
cd database
npm install
node seed.js
```
*(Optionally specify a custom connection string in `database/.env` or pass `MONGO_URI` directly)*.

---

## 📑 Collections & Schemas Reference

All collections correspond 1-to-1 with the Mongoose models defined in `backend/src/models/`.

### 1. `sections` Collection
Represents individual track blocks/corridors between major stations.

```json
{
  "_id": "ObjectId",
  "sectionCode": "NDLS-GZB",             // Unique string, indexed
  "name": "New Delhi to Ghaziabad Jn",  // Descriptive name
  "startStation": "NDLS",                // Station code
  "endStation": "GZB",                  // Station code
  "lengthKm": 25.6,                     // Distance in kilometers
  "trackType": "Electrified Double",    // 'Single' | 'Double' | 'Multiple' | 'Electrified Double'
  "maxSpeedKmph": 130,                  // Maximum permissible speed
  "signallingType": "Automatic Block Signalling",
  "isActive": true,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### 2. `trainschedules` Collection
Timetables of passenger and freight trains traversing the sections.

```json
{
  "_id": "ObjectId",
  "trainNumber": "22436",                // Unique train number string, indexed
  "trainName": "Vande Bharat Express",  // Train name
  "trainType": "Vande Bharat",          // 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Superfast' | 'Mail/Express' | 'Passenger' | 'Freight'
  "priority": 1,                        // 1 (Highest) to 5 (Lowest)
  "originStation": "NDLS",
  "destinationStation": "BSB",
  "runsOnDays": ["Tue", "Wed", "Fri", "Sat", "Sun"],
  "stops": [
    {
      "stationCode": "NDLS",
      "arrivalTime": "06:00",
      "departureTime": "06:00",
      "haltMinutes": 0
    },
    {
      "stationCode": "GZB",
      "arrivalTime": "06:28",
      "departureTime": "06:30",
      "haltMinutes": 2
    }
  ],
  "traversedSections": ["NDLS-GZB", "GZB-CNB"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### 3. `maintenancerequests` Collection
Demands filed by railway engineering departments requiring track possession.

```json
{
  "_id": "ObjectId",
  "requestId": "MR-2026-001",           // Unique human-readable ID, indexed
  "sectionCode": "NDLS-GZB",            // Targeted track section
  "department": "Engineering (P-Way)",  // 'Engineering (P-Way)' | 'Signal & Telecom (S&T)' | 'Electrical (TRD/OHE)' | 'Mechanical (C&W)'
  "workType": "Track Tamping and Deep Screening",
  "requestedDurationMinutes": 180,      // Required duration in minutes
  "proposedDate": "2026-09-10T00:00:00Z",
  "preferredTimeSlot": "Night",         // 'Day' | 'Night' | 'Any'
  "urgency": "Routine",                 // 'Emergency' | 'High' | 'Routine' | 'Low'
  "status": "Pending",                  // 'Pending' | 'Approved' | 'Rejected' | 'Scheduled' | 'Completed'
  "reason": "Scheduled periodic track geometry alignment",
  "demandedBy": "Divisional Engineer (Track)",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### 4. `goodsforecasts` Collection
Anticipated freight movements across railway divisions.

```json
{
  "_id": "ObjectId",
  "forecastId": "GF-2026-101",          // Unique ID
  "date": "2026-09-10T00:00:00Z",
  "originDivision": "Delhi Division (DLI)",
  "destinationDivision": "Moradabad Division (MB)",
  "corridorSection": "NDLS-GZB",
  "commodity": "Containers",            // 'Coal' | 'Containers' | 'Cement' | 'Fertilizers' | 'Steel' etc.
  "expectedRakes": 6,
  "rakeType": "BOXN",
  "priority": "Standard",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### 5. `blockplans` Collection
The final resolved and approved maintenance blocks with conflict resolutions.

```json
{
  "_id": "ObjectId",
  "planId": "BP-2026-5001",             // Unique plan ID
  "planDate": "2026-09-10T00:00:00Z",
  "sectionCode": "NDLS-GZB",
  "maintenanceRequestId": "ObjectId",   // Ref to MaintenanceRequest
  "windowStart": "2026-09-10T01:30:00Z",
  "windowEnd": "2026-09-10T04:30:00Z",
  "allocatedDurationMinutes": 180,
  "status": "Optimized",                // 'Draft' | 'Conflict_Detected' | 'Optimized' | 'Approved' | 'Executed' | 'Cancelled'
  "impactedTrains": [
    {
      "trainNumber": "12004",
      "trainName": "Lucknow Shatabdi",
      "estimatedDelayMinutes": 0,
      "action": "Unaffected"
    }
  ],
  "mlRiskScore": 0.22,
  "aiRecommendations": "Night window approved with zero passenger delays. Regulate goods freight rake GF-101 by 15 mins.",
  "approvedBy": "Chief Controller / Operating",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

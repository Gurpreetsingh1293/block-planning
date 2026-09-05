# 📑 REST API Contracts Specification (`api-contracts.md`)

This document defines the planned REST endpoints, HTTP methods, URL parameters, request payloads, and response JSON formats across the **sih-block-planning** ecosystem.

---

## 1. Backend Core Service Endpoints (Base URL: `http://localhost:5000/api`)

---

### `GET /api/health`
Verifies backend connectivity, database status, and server uptime.

- **Request Headers**: `None`
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "sih-block-planning-backend",
  "version": "1.0.0",
  "timestamp": "2026-09-05T10:00:00.000Z",
  "uptimeSeconds": 142,
  "database": {
    "status": "connected",
    "isConnected": true
  },
  "environment": "development"
}
```

---

### `GET /api/sections`
Retrieves all configured railway track corridor sections.

- **Query Parameters**:
  - `active` *(optional, boolean)*: Filter by active sections only.
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "66d9b23f87a32e12a40b1001",
      "sectionCode": "NDLS-GZB",
      "name": "New Delhi to Ghaziabad Junction",
      "startStation": "NDLS",
      "endStation": "GZB",
      "lengthKm": 25.6,
      "trackType": "Electrified Double",
      "maxSpeedKmph": 130,
      "signallingType": "Automatic Block Signalling",
      "isActive": true
    }
  ]
}
```

---

### `GET /api/train-schedules`
Fetches passenger and freight timetable schedules.

- **Query Parameters**:
  - `section` *(optional, string)*: Filter trains that traverse a section (e.g. `?section=NDLS-GZB`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "66d9b23f87a32e12a40b2001",
      "trainNumber": "22436",
      "trainName": "Vande Bharat Express",
      "trainType": "Vande Bharat",
      "priority": 1,
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
          "stationCode": "CNB",
          "arrivalTime": "10:08",
          "departureTime": "10:10",
          "haltMinutes": 2
        }
      ],
      "traversedSections": ["NDLS-GZB", "GZB-CNB"]
    }
  ]
}
```

---

### `GET /api/maintenance-requests`
Lists all submitted maintenance block requirements.

- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "66d9b23f87a32e12a40b3001",
      "requestId": "MR-2026-001",
      "sectionCode": "NDLS-GZB",
      "department": "Engineering (P-Way)",
      "workType": "Track Tamping and Deep Screening",
      "requestedDurationMinutes": 180,
      "proposedDate": "2026-09-10T00:00:00.000Z",
      "preferredTimeSlot": "Night",
      "urgency": "Routine",
      "status": "Pending",
      "reason": "Periodic ultrasonic rail testing and track surface realignment",
      "demandedBy": "Sr. DEN (Coordination)"
    }
  ]
}
```

---

### `POST /api/maintenance-requests`
Submits a new maintenance block request.

- **Request Body**:
```json
{
  "requestId": "MR-2026-005",
  "sectionCode": "NDLS-GZB",
  "department": "Electrical (TRD/OHE)",
  "workType": "Contact Wire Replacement",
  "requestedDurationMinutes": 120,
  "proposedDate": "2026-09-12T00:00:00.000Z",
  "preferredTimeSlot": "Night",
  "urgency": "High",
  "reason": "Worn contact wire replacement at Km 12/4",
  "demandedBy": "Sr. DEE (TRD)"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "_id": "66d9b23f87a32e12a40b3005",
    "requestId": "MR-2026-005",
    "status": "Pending"
  }
}
```

---

### `POST /api/block-plans/evaluate-risk`
Proxies request to ML Service and runs predictive congestion analysis.

- **Request Body**:
```json
{
  "sectionCode": "NDLS-GZB",
  "workType": "Track Tamping",
  "requestedDurationMinutes": 180,
  "scheduledHour": 2
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "section_id": "NDLS-GZB",
    "risk_score": 0.25,
    "risk_level": "Low",
    "confidence": 0.88,
    "recommended_window": "01:30 - 04:30 (Night Window)",
    "estimated_passenger_delay_min": 10,
    "factors": [
      {
        "name": "Corridor Train Density",
        "weight": 0.45,
        "description": "High frequency passenger corridor traversing NDLS-GZB"
      }
    ]
  }
}
```

---

## 2. Machine Learning Service Endpoints (Base URL: `http://localhost:8000`)

---

### `GET /health`
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "ml-service",
  "timestamp": "2026-09-05T10:00:00.000Z"
}
```

---

### `POST /predict-risk`
Evaluates maintenance block operational risk.

- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "section_id": "NDLS-GZB",
  "work_type": "Track Tamping",
  "requested_duration_min": 180,
  "scheduled_hour": 2
}
```
- **Response `200 OK`**:
```json
{
  "section_id": "NDLS-GZB",
  "risk_score": 0.25,
  "risk_level": "Low",
  "confidence": 0.88,
  "recommended_window": "01:30 - 04:30 (Night Window)",
  "estimated_passenger_delay_min": 10,
  "factors": [
    {
      "name": "Corridor Train Density",
      "weight": 0.45,
      "description": "High frequency passenger corridor traversing NDLS-GZB"
    }
  ],
  "evaluated_at": "2026-09-05T10:00:00.000Z"
}
```

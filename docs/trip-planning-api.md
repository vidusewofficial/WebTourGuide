# Trip Planning API Reference

**Base URL:** `http://localhost:8080/api/trip-plans`  
**Authentication:** All endpoints require a `Bearer <token>` JWT in the `Authorization` header.  
**Authorized role:** `TOURIST` only. No ADMIN or STAFF override exists for this module.

---

## Endpoints

### 1. Create a Trip Plan
**POST** `/api/trip-plans`

Creates a new, empty itinerary for the logged-in tourist.

**Request body:**
```json
{
  "title": "South Coast Getaway",
  "startDate": "2026-11-10",
  "endDate": "2026-11-13"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | ✅ | Max 150 characters |
| startDate | date (YYYY-MM-DD) | ❌ | Must not be after endDate |
| endDate | date (YYYY-MM-DD) | ❌ | Must not be before startDate |

**Response:** `200 OK` — full `TripPlanResponse` with an empty `items` array.

---

### 2. List My Trip Plans
**GET** `/api/trip-plans/my`

Returns all trip plans belonging to the authenticated tourist.

**Response:** `200 OK` — array of `TripPlanResponse` objects.

---

### 3. Get a Single Trip Plan
**GET** `/api/trip-plans/{id}`

Returns one trip plan by ID. Returns `403 Forbidden` if the plan belongs to a different tourist.

**Response:** `200 OK` — single `TripPlanResponse`.

**Error responses:**
- `404 Not Found` — plan does not exist
- `403 Forbidden` — plan belongs to another tourist

---

### 4. Update a Trip Plan
**PUT** `/api/trip-plans/{id}`

Replaces the title, dates, and **entire** items list. Any existing items not in the new list are permanently deleted (Hibernate orphanRemoval).

**Request body:**
```json
{
  "title": "South Coast Getaway",
  "startDate": "2026-11-10",
  "endDate": "2026-11-13",
  "items": [
    {
      "destinationId": 1,
      "dayNumber": 1,
      "accommodation": "Sigiriya Village Hotel",
      "transportation": "Private van",
      "activities": "Climb the rock fortress, visit museum",
      "notes": "Climb early to avoid heat"
    },
    {
      "destinationId": null,
      "dayNumber": 2,
      "accommodation": "Kandy Guest House",
      "transportation": "Train",
      "activities": null,
      "notes": "Rest day"
    }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | ❌ | Max 150 characters |
| startDate | date | ❌ | |
| endDate | date | ❌ | |
| items | array | ❌ | If omitted, existing items are kept unchanged |
| items[].destinationId | number | ❌ | Null = rest day |
| items[].dayNumber | number | ✅ | Min 1 |
| items[].accommodation | string | ❌ | |
| items[].transportation | string | ❌ | |
| items[].activities | string | ❌ | e.g. "Hiking, wildlife safari" |
| items[].notes | string | ❌ | |

**Response:** `200 OK` — updated `TripPlanResponse` with the new items list.

---

### 5. Delete a Trip Plan
**DELETE** `/api/trip-plans/{id}`

Permanently deletes the trip plan and all its day items.

**Response:** `204 No Content`

**Error responses:**
- `404 Not Found` — plan does not exist
- `403 Forbidden` — plan belongs to another tourist

---

## TripPlanResponse Schema

```json
{
  "id": 1,
  "touristId": 3,
  "title": "South Coast Getaway",
  "startDate": "2026-11-10",
  "endDate": "2026-11-13",
  "createdAt": "2026-09-13T10:00:00",
  "items": [
    {
      "id": 1,
      "destinationId": 1,
      "destinationName": "Sigiriya Rock Fortress",
      "dayNumber": 1,
      "accommodation": "Sigiriya Village Hotel",
      "transportation": "Private van",
      "activities": "Climb the rock fortress, visit museum",
      "notes": "Climb early to avoid heat"
    }
  ]
}
```

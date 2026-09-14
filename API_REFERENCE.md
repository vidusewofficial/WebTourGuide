# Tour Guide API Reference

Base URL: `http://localhost:8080/api`

---

### GET /guides
Returns all guide profiles.
**Auth:** Public
**Response:** `200 OK` — array of `TourGuideResponse`

### GET /guides/{id}
Returns one guide profile.
**Auth:** Public
**Response:** `200 OK` — `TourGuideResponse` | `404` if not found

### GET /guides/available
Returns guides with `isAvailable = true`.
**Auth:** Public
**Response:** `200 OK` — array of `TourGuideResponse`

### GET /guides/search?language={lang}
Case-insensitive substring filter on the `languages` field.
**Auth:** Public
**Response:** `200 OK` — array of `TourGuideResponse`

### POST /guides
Creates a new guide profile.
**Auth:** `ADMIN` or `STAFF` (Bearer token required)
**Body:**
```json
{
  "userId": 3,
  "languages": "English, Sinhala",
  "skills": "Wildlife tours, hiking",
  "certifications": "SLTDA Licensed Guide",
  "yearsExperience": 4
}
```
**Response:** `200 OK` — `TourGuideResponse`
**Errors:** `400` validation | `500` duplicate profile or wrong role

### PUT /guides/{id}
Updates profile fields (partial — only non-null fields applied).
**Auth:** Guide themselves or `ADMIN`
**Body:** same shape as POST (all fields optional)
**Response:** `200 OK` | `403` if not owner/admin

### PATCH /guides/{id}/availability
Toggles availability flag.
**Auth:** Guide themselves or `ADMIN`
**Body:** `{ "isAvailable": false }`
**Response:** `200 OK` | `403` if not owner/admin

### DELETE /guides/{id}
Removes a guide listing permanently.
**Auth:** `ADMIN` only
**Response:** `200 OK` | `404` if not found
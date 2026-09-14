# Testing Guide — Tour Guide Management Module

## Backend (Postman)
Import `postman/WebTourGuide-TourGuideManagement.postman_collection.json`.

Run requests in order:
1. **Auth / Login as ADMIN** — saves `adminToken` variable automatically
2. **Auth / Login as Kasun (TOUR_GUIDE)** — saves `guideToken`
3. **PUBLIC** folder — all 4 GET requests, no auth needed
4. **ADMIN / Create guide profile** — uses `adminToken`
5. **TOUR_GUIDE / Self-Edit** folder — uses `guideToken`
6. **ADMIN / Override edit** folder — ADMIN can edit any guide
7. **ADMIN / Delete** — cleanup

## Expected status codes
| Scenario                          | Expected |
|-----------------------------------|----------|
| Public GET any guide endpoint     | 200      |
| ADMIN creates guide profile       | 200      |
| Guide edits own profile           | 200      |
| Guide edits another guide profile | 403      |
| Non-ADMIN tries DELETE            | 403      |
| Guide ID not found                | 404      |
| Create with non-TOUR_GUIDE userId | 500 (IllegalStateException) |

## Frontend manual checks
1. Browse to `http://localhost:5173/guides` — guide list loads
2. Click a guide card → profile page shows all fields
3. Log in as a TOUR_GUIDE → "Manage Profile" panel appears
4. Edit profile → form pre-populated, saves and redirects
5. Toggle availability → badge updates immediately
6. Log in as non-TOUR_GUIDE → no edit panel visible
7. Try `http://localhost:5173/guides/1/edit` when not logged in → redirected to `/login`
# Guide Pages — Component Overview

## `pages/guides/List.jsx`
- **Purpose:** Browse all guide profiles; search by language; filter available-only
- **Auth:** Public (no login required)
- **Admin extras:** delete (✕) button visible on each card for ADMIN / STAFF

## `pages/guides/Profile.jsx`
- **Purpose:** View full guide profile (bio, skills, certifications, rating)
- **Auth:** Public
- **Guide extras:** "Manage Profile" panel with Edit and Toggle Availability
- **Admin extras:** "Admin Actions" panel with Remove listing button

## `pages/guides/EditForm.jsx`
- **Purpose:** Update languages, skills, certifications, experience, availability
- **Auth:** TOUR_GUIDE (own profile) or ADMIN — enforced by ProtectedRoute + backend
- **UX:** Pre-populated from API; character counter on languages; maxLength enforced

## `api/guideApi.js`
Thin Axios wrapper. All calls go through `axiosClient` which injects the JWT automatically.
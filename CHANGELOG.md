# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added — Tour Guide Management Module
- `TourGuide` JPA entity mapped to `tour_guides` table
- `TourGuideRepository` with availability and language search finders
- `TourGuideService` with ownership-based access control and SLF4J logging
- `TourGuideController` exposing 8 REST endpoints at `/api/guides`
- DTOs: `TourGuideCreateRequest`, `TourGuideUpdateRequest`,
  `AvailabilityUpdateRequest`, `TourGuideResponse`
- Bean Validation (`@Size`, `@Min`, `@NotNull`) on all request DTOs
- Frontend pages: `GuideList`, `GuideProfile`, `GuideEditForm`
- `guideApi.js` Axios helpers for all guide endpoints
- `Guides` nav link in Navbar
- 3 new React Router routes including `ProtectedRoute` for the edit form
- `seed_data.sql` with sample guides for development
- `application-prod.properties` stub for production deployment
- Performance index on `tour_guides.is_available`
- Postman collection with 14 regression test requests

### Changed
- `SecurityConfig` — documented CORS configuration with inline comment
- `application.properties` — added `open-in-view=false` and error message settings

## [0.3.0] — Tour Package Management
- Tour package CRUD and search

## [0.2.0] — Destination Management
- Destination CRUD, category filter, image gallery

## [0.1.0] — User & Auth
- JWT registration and login
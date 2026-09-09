# Architecture Overview

## Backend Package Structure
```
com.webtourguide
├── config/          SecurityConfig, CorsConfig
├── exception/       ResourceNotFoundException, GlobalExceptionHandler
├── security/        JwtAuthFilter, JwtService, CustomUserDetailsService
├── upload/          FileUploadController
├── user/            User, Role, UserRepository, AuthController (register/login)
├── destination/     Destination, DestinationRepository, Service, Controller
├── tourpackage/     TourPackage, Repository, Service, Controller
└── tourguide/       TourGuide, Repository, Service, Controller
    └── dto/         CreateRequest, UpdateRequest, AvailabilityRequest, Response
```

## Security Flow
```
Request → JwtAuthFilter → SecurityFilterChain → Controller → Service → Repository → MySQL
```
- Public GET endpoints bypass authentication entirely.
- JWT is validated on every protected request.
- `@PreAuthorize` at controller level enforces role checks.
- `assertOwnerOrAdmin()` in TourGuideService enforces ownership at the data level.

## Frontend Route Map
```
/                          Home
/destinations              Destination list (public)
/destinations/:id          Destination detail (public)
/packages                  Package list (public)
/packages/:id              Package detail (public)
/guides                    Guide list (public)
/guides/:id                Guide profile (public)
/guides/:id/edit           Edit form (TOUR_GUIDE own / ADMIN — ProtectedRoute)
/login, /register          Auth pages
/admin/destinations/new    Admin form (ADMIN / STAFF — ProtectedRoute)
/admin/packages/new        Admin form (ADMIN / STAFF — ProtectedRoute)
```
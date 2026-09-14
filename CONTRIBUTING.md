# Contributing Guide

## Branch Naming
```
feature/<module-name>      e.g. feature/tour-guide-management
fix/<issue-description>    e.g. fix/availability-toggle-403
docs/<what-you-documented>
```

## Commit Message Format
```
<type>: <short description>

Types: feat | fix | docs | style | refactor | perf | test | config | data | a11y
```

## Adding a New Module
1. Create Java package under `com.webtourguide.<module>`
2. Add entity, repository, DTOs, service, controller
3. Add `package-info.java` with Javadoc
4. Register any new public GET routes in `SecurityConfig`
5. Add frontend api file under `src/api/`
6. Add React pages under `src/pages/<module>/`
7. Register routes in `App.jsx`
8. Add nav link to `Navbar.jsx` if user-facing
9. Export Postman collection to `postman/`

## Code Style
- Java: Google Java Style, max line length 120
- React: functional components with hooks only, no class components
- All public methods must have Javadoc
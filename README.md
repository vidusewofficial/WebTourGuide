# WebTourGuide — Web-Based Tour Guide Platform

A full-stack Spring Boot + React application for managing tourist destinations,
tour packages, tour guides, and bookings in Sri Lanka.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Java 17, Spring Boot 4.x, Spring Security, JWT  |
| Database | MySQL 8.0                                       |
| Frontend | React 18, Vite, React Router, Axios, Framer Motion |

## Modules

| Module                | Package / Path                          | Status |
|-----------------------|-----------------------------------------|--------|
| User & Auth           | `com.webtourguide.user`                 | ✅ Done |
| Destination Mgmt      | `com.webtourguide.destination`          | ✅ Done |
| Tour Package Mgmt     | `com.webtourguide.tourpackage`          | ✅ Done |
| **Tour Guide Mgmt**   | `com.webtourguide.tourguide`            | ✅ Done |
| Booking System        | `com.webtourguide.booking`              | 🔧 In progress |

## Milestones
- Successfully reached 50 commits improving backend, frontend, docs, and UX!

## Quick Start

### Backend
```bash
# Start MySQL, then:
cd webtourguide-api
./mvnw spring-boot:run
```

### Frontend
```bash
cd webtourguide-web
npm install
npm run dev
```

## API Base URL
`http://localhost:8080/api`

## Guide Module Endpoints
| Method | Path                              | Access          |
|--------|-----------------------------------|-----------------|
| GET    | /api/guides                       | Public          |
| GET    | /api/guides/{id}                  | Public          |
| GET    | /api/guides/available             | Public          |
| GET    | /api/guides/search?language=      | Public          |
| POST   | /api/guides                       | ADMIN, STAFF    |
| PUT    | /api/guides/{id}                  | TOUR_GUIDE, ADMIN |
| PATCH  | /api/guides/{id}/availability     | TOUR_GUIDE, ADMIN |
| DELETE | /api/guides/{id}                  | ADMIN           |
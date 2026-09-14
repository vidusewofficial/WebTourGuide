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
| **Customer Support Mgmt** | `com.webtourguide.support`          | ✅ Done |

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

See `API_REFERENCE.md` for the full guide-module endpoint list.
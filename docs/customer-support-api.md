# Customer Support API Reference

**Base URL:** `http://localhost:8080/api/support/tickets`
**Authentication:** All endpoints require a `Bearer <token>` JWT in the `Authorization` header.
**Roles:** TOURIST raises and views their own tickets. STAFF and ADMIN triage every ticket.

---

## Endpoints

### 1. Create a Ticket
**POST** `/api/support/tickets`

Raises a new inquiry, complaint, cancellation, or reschedule request. TOURIST only.

**Request body:**
```json
{
  "type": "COMPLAINT",
  "subject": "Guide arrived 40 minutes late",
  "message": "Our booked guide showed up almost an hour late with no notice."
}
```

**Response:** `200 OK` — `SupportTicketResponse` with `status: "OPEN"`.

---

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

### 2. List My Tickets
**GET** `/api/support/tickets/my`

Returns every ticket raised by the authenticated tourist. TOURIST only.

**Response:** `200 OK` — array of `SupportTicketResponse` objects.

---

### 3. Get a Single Ticket
**GET** `/api/support/tickets/{id}`

Returns one ticket by ID. TOURIST can only view their own ticket; STAFF and ADMIN can view any.

**Response:** `200 OK` — single `SupportTicketResponse`.

**Error responses:**
- `404 Not Found` — ticket does not exist
- `403 Forbidden` — ticket belongs to another tourist

---

### 4. List All Tickets
**GET** `/api/support/tickets`

Returns every ticket in the system, for triage. STAFF and ADMIN only.

**Query params:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| status | OPEN, IN_PROGRESS, RESOLVED, CLOSED | ❌ | Filters the queue by status |

**Response:** `200 OK` — array of `SupportTicketResponse` objects.

---

### 5. Update Ticket Status
**PATCH** `/api/support/tickets/{id}/status`

Moves a ticket to a new status. STAFF and ADMIN only. The first status change on a ticket
automatically assigns `handledBy` to the caller. Moving to RESOLVED or CLOSED stamps `resolvedAt`.

**Request body:**
```json
{ "status": "IN_PROGRESS" }
```

**Response:** `200 OK` — updated `SupportTicketResponse`.

**Error responses:**
- `404 Not Found` — ticket does not exist
- `403 Forbidden` — caller is a TOURIST

---

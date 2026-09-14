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

## SupportTicketResponse Schema

```json
{
  "id": 1,
  "raisedById": 3,
  "raisedByName": "Vidushi Tourist",
  "handledById": 5,
  "handledByName": "Support Staff",
  "type": "COMPLAINT",
  "subject": "Guide arrived 40 minutes late",
  "message": "Our booked guide showed up almost an hour late with no notice.",
  "status": "IN_PROGRESS",
  "createdAt": "2026-09-14T10:00:00",
  "resolvedAt": null
}
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| 403 on every `/api/support/tickets` call | Logged in as TOURIST calling a STAFF/ADMIN-only endpoint | Use a STAFF or ADMIN token for `GET /tickets` and the status update endpoint |
| 403 viewing a specific ticket | Viewing another tourist's ticket | Expected — only the raiser, STAFF, or ADMIN can view a ticket |
| `handledBy` stays null after a status change | Status update failed validation before reaching the service | Confirm the request body has a valid `status` enum value |

---

## Role Access Matrix

| Endpoint | TOURIST | STAFF | ADMIN |
|----------|---------|-------|-------|
| POST /tickets | ✅ (own) | ❌ | ❌ |
| GET /tickets/my | ✅ (own) | ❌ | ❌ |
| GET /tickets/{id} | ✅ (own only) | ✅ | ✅ |
| GET /tickets | ❌ | ✅ | ✅ |
| PATCH /tickets/{id}/status | ❌ | ✅ | ✅ |

---

## Manual Testing Checklist

- [ ] Tourist submits a ticket and sees it as `OPEN` on `/support/my`
- [ ] Staff sees the new ticket on `/staff/support` filtered to `OPEN`
- [ ] Staff moves the ticket to `IN_PROGRESS` and `handledBy` is set automatically
- [ ] Staff moves the ticket to `RESOLVED` and `resolvedAt` is populated
- [ ] A second tourist gets `403 Forbidden` viewing the first tourist's ticket
- [ ] A tourist gets `403 Forbidden` calling the status update endpoint

---

## Related Files

- `SupportTicket`, `SupportTicketRepository`, `SupportTicketService`, `SupportTicketController` — `webtourguide-api/src/main/java/com/webtourguide/support/`
- `supportApi.js`, `NewTicket.jsx`, `MyTickets.jsx`, `StaffQueue.jsx` — `webtourguide-web/src/`
- `WebTourGuide-CustomerSupport.postman_collection.json` — `postman/`

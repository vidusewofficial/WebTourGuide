-- Speeds up GET /api/support/tickets?status=... for the staff triage queue.
USE webtourguide_db;

CREATE INDEX idx_support_tickets_status ON support_tickets(status);

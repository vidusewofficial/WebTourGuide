-- =============================================================================
-- WebTourGuide — Sample seed data for development and testing
-- Run AFTER schema.sql has been applied.
-- =============================================================================
USE webtourguide_db;

-- Sample users (passwords are a real BCrypt hash of "password123",
-- generated with the same BCryptPasswordEncoder SecurityConfig uses -
-- the previous placeholder strings here were not valid bcrypt hashes
-- and could never actually be logged in with)
INSERT IGNORE INTO users (id, full_name, email, password_hash, role) VALUES
(1,  'Admin User',        'admin@webtourguide.com',  '$2a$10$C2bjXgjn6HGbpRgMFUNOgOu8yYYha31tiITGKNto2PdLRjHMLN4sW', 'ADMIN'),
(10, 'Kasun Perera',      'kasun.guide@example.com', '$2a$10$C2bjXgjn6HGbpRgMFUNOgOu8yYYha31tiITGKNto2PdLRjHMLN4sW', 'TOUR_GUIDE'),
(11, 'Nimal Silva',       'nimal.guide@example.com', '$2a$10$C2bjXgjn6HGbpRgMFUNOgOu8yYYha31tiITGKNto2PdLRjHMLN4sW', 'TOUR_GUIDE'),
(12, 'Amara Fernando',    'amara.guide@example.com', '$2a$10$C2bjXgjn6HGbpRgMFUNOgOu8yYYha31tiITGKNto2PdLRjHMLN4sW', 'TOUR_GUIDE'),
(20, 'Tourist User',      'tourist@example.com',     '$2a$10$C2bjXgjn6HGbpRgMFUNOgOu8yYYha31tiITGKNto2PdLRjHMLN4sW', 'TOURIST');

-- Sample guide profiles
INSERT IGNORE INTO tour_guides (user_id, languages, skills, certifications, location, years_experience, is_available, rating) VALUES
(10, 'English, Sinhala',        'Wildlife tours, hiking',           'SLTDA Licensed Guide',            'Sigiriya', 4,  TRUE,  4.5),
(11, 'English, Tamil',          'Cultural tours, city walks',       'SLTDA Licensed Guide, First Aid', 'Kandy',    2,  TRUE,  4.2),
(12, 'English, Sinhala, Tamil', 'Beach tours, water sports, yoga',  'SLTDA Licensed Guide',            'Galle',    7,  FALSE, 4.8);

-- Sample trip plans for the seeded tourist (id 20)
-- destination_id is left NULL (rest days) since this file does not seed any
-- destinations; if destinations exist in your database, feel free to attach
-- one via a follow-up UPDATE.
INSERT IGNORE INTO trip_plans (id, tourist_id, title, start_date, end_date) VALUES
(1, 20, 'South Coast Getaway', '2026-11-10', '2026-11-13'),
(2, 20, 'Hill Country Weekend', '2026-12-05', '2026-12-07');

INSERT IGNORE INTO trip_plan_items (id, trip_plan_id, destination_id, day_number, accommodation, transportation, notes) VALUES
(1, 1, NULL, 1, 'Kandy Guest House', 'Train', 'Rest day before heading south'),
(2, 1, NULL, 2, 'Sigiriya Village Hotel', 'Private van', 'Climb early to avoid heat'),
(3, 2, NULL, 1, 'Ella Flower Garden Resort', 'Public bus', 'Hiking day');
-- =============================================================================
-- WebTourGuide — Sample seed data for development and testing
-- Run AFTER schema.sql has been applied.
-- =============================================================================
USE webtourguide_db;

-- Sample users (passwords are BCrypt of "password123")
INSERT IGNORE INTO users (id, full_name, email, password_hash, role) VALUES
(1,  'Admin User',        'admin@webtourguide.com',  '$2a$10$exampleHashForAdminUser1234567890', 'ADMIN'),
(10, 'Kasun Perera',      'kasun.guide@example.com', '$2a$10$exampleHashForKasunPerera12345678', 'TOUR_GUIDE'),
(11, 'Nimal Silva',       'nimal.guide@example.com', '$2a$10$exampleHashForNimalSilva123456789', 'TOUR_GUIDE'),
(12, 'Amara Fernando',    'amara.guide@example.com', '$2a$10$exampleHashForAmaraFernando123456', 'TOUR_GUIDE'),
(20, 'Tourist User',      'tourist@example.com',     '$2a$10$exampleHashForTouristUser12345678', 'TOURIST');

-- Sample guide profiles
INSERT IGNORE INTO tour_guides (user_id, languages, skills, certifications, years_experience, is_available, rating) VALUES
(10, 'English, Sinhala',        'Wildlife tours, hiking',           'SLTDA Licensed Guide',            4,  TRUE,  4.5),
(11, 'English, Tamil',          'Cultural tours, city walks',       'SLTDA Licensed Guide, First Aid', 2,  TRUE,  4.2),
(12, 'English, Sinhala, Tamil', 'Beach tours, water sports, yoga',  'SLTDA Licensed Guide',            7,  FALSE, 4.8);
DROP DATABASE IF EXISTS webtourguide_db;
CREATE DATABASE webtourguide_db CHARACTER SET utf8mb4;
USE webtourguide_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('TOURIST','TOUR_GUIDE','STAFF','ADMIN') NOT NULL DEFAULT 'TOURIST',
    phone VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE tour_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_participants INT DEFAULT 10,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

CREATE TABLE tour_guides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    languages VARCHAR(255),
    skills VARCHAR(255),
    certifications VARCHAR(255),
    years_experience INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tourist_id BIGINT NOT NULL,
    package_id BIGINT,
    guide_id BIGINT,
    booking_date DATE NOT NULL,
    participants INT DEFAULT 1,
    status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED','RESCHEDULED') DEFAULT 'PENDING',
    total_price DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES tour_packages(id),
    FOREIGN KEY (guide_id) REFERENCES tour_guides(id)
);

CREATE TABLE trip_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tourist_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES users(id)
);

CREATE TABLE trip_plan_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_plan_id BIGINT NOT NULL,
    destination_id BIGINT,
    day_number INT NOT NULL,
    accommodation VARCHAR(150),
    transportation VARCHAR(150),
    notes VARCHAR(500),
    FOREIGN KEY (trip_plan_id) REFERENCES trip_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

CREATE TABLE support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    raised_by BIGINT NOT NULL,
    handled_by BIGINT,
    type ENUM('INQUIRY','COMPLAINT','CANCELLATION_REQUEST','RESCHEDULE_REQUEST') NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT,
    status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (raised_by) REFERENCES users(id),
    FOREIGN KEY (handled_by) REFERENCES users(id)
);
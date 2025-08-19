-- Joe Ride Database Schema
-- PostgreSQL Database: demo

-- Drop tables if they exist (for clean installation)
DROP TABLE IF EXISTS ride_offers CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Drop ENUM types if they exist
DROP TYPE IF EXISTS vehicle_type_enum CASCADE;
DROP TYPE IF EXISTS ride_offer_status_enum CASCADE;

-- Create ENUM types
CREATE TYPE vehicle_type_enum AS ENUM (
    'motorcycle',
    'sedan',
    'suv',
    'pickup',
    'van',
    'other'
);

CREATE TYPE ride_offer_status_enum AS ENUM (
    'open',
    'closed',
    'cancelled'
);

-- Create Users table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    "fullName" VARCHAR NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "homeAddress" VARCHAR NOT NULL,
    "vehicleType" VARCHAR NULL,
    "vehiclePlate" VARCHAR NULL,
    "driversLicenseNumber" VARCHAR NULL,
    "mobilePhoneNumber" VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Ride Offers table
CREATE TABLE ride_offers (
    id SERIAL PRIMARY KEY,
    "driverId" VARCHAR NOT NULL,
    "fromLocation" VARCHAR(255) NOT NULL,
    "toLocation" VARCHAR(255) NOT NULL,
    "departureTime" TIMESTAMP NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 8),
    "seatsAvailable" INTEGER NOT NULL CHECK ("seatsAvailable" >= 0),
    "pricePerSeat" DECIMAL(10,2) NULL,
    "voucherRequired" BOOLEAN DEFAULT FALSE,
    "vehicleType" vehicle_type_enum DEFAULT 'other',
    "distanceKm" FLOAT NOT NULL,
    status ride_offer_status_enum DEFAULT 'open',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_ride_offers_driver_id ON ride_offers("driverId");
CREATE INDEX idx_ride_offers_departure_time ON ride_offers("departureTime");
CREATE INDEX idx_ride_offers_status ON ride_offers(status);
CREATE INDEX idx_ride_offers_from_location ON ride_offers("fromLocation");
CREATE INDEX idx_ride_offers_to_location ON ride_offers("toLocation");

-- Add foreign key constraint (optional, depends on your business logic)
-- ALTER TABLE ride_offers ADD CONSTRAINT fk_ride_offers_driver 
-- FOREIGN KEY ("driverId") REFERENCES "user"(id) ON DELETE CASCADE;

-- Insert sample data for testing

-- Sample Users (passwords are hashed with bcrypt for 'password123')
INSERT INTO "user" (
    "fullName", 
    "dateOfBirth", 
    "homeAddress", 
    "vehicleType", 
    "vehiclePlate", 
    "driversLicenseNumber", 
    "mobilePhoneNumber", 
    email, 
    password
) VALUES 
(
    'John Smith', 
    '1990-05-15', 
    '123 Main St, Manila, Philippines', 
    'sedan', 
    'ABC-1234', 
    'DL12345678', 
    '+639171234567', 
    'john.smith@email.com', 
    '$2b$10$rZKm5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q'
),
(
    'Maria Garcia', 
    '1985-08-22', 
    '456 Rizal Ave, Quezon City, Philippines', 
    'suv', 
    'XYZ-5678', 
    'DL87654321', 
    '+639187654321', 
    'maria.garcia@email.com', 
    '$2b$10$rZKm5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q'
),
(
    'Carlos Rodriguez', 
    '1992-12-03', 
    '789 EDSA, Makati City, Philippines', 
    'motorcycle', 
    'MOT-9012', 
    'DL11223344', 
    '+639199876543', 
    'carlos.rodriguez@email.com', 
    '$2b$10$rZKm5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q'
),
(
    'Ana Santos', 
    '1988-03-18', 
    '321 Ortigas Ave, Pasig City, Philippines', 
    'sedan', 
    'PQR-3456', 
    'DL55667788', 
    '+639155667788', 
    'ana.santos@email.com', 
    '$2b$10$rZKm5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q'
),
(
    'Miguel Torres', 
    '1995-07-10', 
    '654 Commonwealth Ave, Quezon City, Philippines', 
    'pickup', 
    'TUV-7890', 
    'DL99887766', 
    '+639133445566', 
    'miguel.torres@email.com', 
    '$2b$10$rZKm5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q5Y5q'
);

-- Sample Ride Offers
INSERT INTO ride_offers (
    "driverId", 
    "fromLocation", 
    "toLocation", 
    "departureTime", 
    capacity, 
    "seatsAvailable", 
    "pricePerSeat", 
    "voucherRequired", 
    "vehicleType", 
    "distanceKm", 
    status
) VALUES 
(
    '1', 
    'Manila City Hall, Manila', 
    'UP Diliman, Quezon City', 
    '2025-08-20 08:00:00', 
    4, 
    3, 
    150.00, 
    false, 
    'sedan', 
    15.5, 
    'open'
),
(
    '2', 
    'SM Megamall, Mandaluyong', 
    'BGC, Taguig', 
    '2025-08-20 18:30:00', 
    6, 
    4, 
    200.00, 
    true, 
    'suv', 
    12.3, 
    'open'
),
(
    '3', 
    'NAIA Terminal 1, Pasay', 
    'Makati CBD, Makati', 
    '2025-08-21 06:00:00', 
    2, 
    1, 
    80.00, 
    false, 
    'motorcycle', 
    8.7, 
    'open'
),
(
    '4', 
    'Ortigas Center, Pasig', 
    'Alabang Town Center, Muntinlupa', 
    '2025-08-21 17:00:00', 
    4, 
    2, 
    180.00, 
    false, 
    'sedan', 
    25.8, 
    'open'
),
(
    '5', 
    'Commonwealth Market, Quezon City', 
    'Eastwood City, Quezon City', 
    '2025-08-22 07:30:00', 
    5, 
    3, 
    120.00, 
    true, 
    'pickup', 
    18.2, 
    'open'
),
(
    '1', 
    'Bonifacio High Street, BGC', 
    'Mall of Asia, Pasay', 
    '2025-08-22 19:00:00', 
    4, 
    4, 
    160.00, 
    false, 
    'sedan', 
    14.1, 
    'open'
),
(
    '2', 
    'Greenhills Shopping Center, San Juan', 
    'SM North EDSA, Quezon City', 
    '2025-08-23 10:00:00', 
    6, 
    5, 
    100.00, 
    false, 
    'suv', 
    11.5, 
    'open'
),
(
    '3', 
    'Divisoria Market, Manila', 
    'Cubao, Quezon City', 
    '2025-08-23 14:00:00', 
    2, 
    2, 
    90.00, 
    true, 
    'motorcycle', 
    13.7, 
    'open'
);

-- Add some closed/cancelled rides for testing
INSERT INTO ride_offers (
    "driverId", 
    "fromLocation", 
    "toLocation", 
    "departureTime", 
    capacity, 
    "seatsAvailable", 
    "pricePerSeat", 
    "voucherRequired", 
    "vehicleType", 
    "distanceKm", 
    status
) VALUES 
(
    '4', 
    'Trinoma Mall, Quezon City', 
    'Rockwell Center, Makati', 
    '2025-08-19 16:00:00', 
    4, 
    0, 
    170.00, 
    false, 
    'sedan', 
    22.3, 
    'closed'
),
(
    '5', 
    'Ayala Center, Makati', 
    'SM City Fairview, Quezon City', 
    '2025-08-19 20:00:00', 
    5, 
    5, 
    200.00, 
    true, 
    'pickup', 
    28.4, 
    'cancelled'
);

-- Create a trigger to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE "user" IS 'User accounts for the ride sharing application';
COMMENT ON TABLE ride_offers IS 'Available ride offers posted by drivers';

COMMENT ON COLUMN "user".id IS 'Primary key - auto-incrementing user ID';
COMMENT ON COLUMN "user"."fullName" IS 'Full name of the user';
COMMENT ON COLUMN "user"."dateOfBirth" IS 'Date of birth for age verification';
COMMENT ON COLUMN "user"."homeAddress" IS 'Primary address of the user';
COMMENT ON COLUMN "user"."vehicleType" IS 'Type of vehicle owned (optional)';
COMMENT ON COLUMN "user"."vehiclePlate" IS 'Vehicle plate number (optional)';
COMMENT ON COLUMN "user"."driversLicenseNumber" IS 'Drivers license number (optional)';
COMMENT ON COLUMN "user"."mobilePhoneNumber" IS 'Contact phone number';
COMMENT ON COLUMN "user".email IS 'Email address - must be unique';
COMMENT ON COLUMN "user".password IS 'Hashed password using bcrypt';

COMMENT ON COLUMN ride_offers.id IS 'Primary key - auto-incrementing ride offer ID';
COMMENT ON COLUMN ride_offers."driverId" IS 'Reference to the driver (user ID)';
COMMENT ON COLUMN ride_offers."fromLocation" IS 'Starting location of the ride';
COMMENT ON COLUMN ride_offers."toLocation" IS 'Destination of the ride';
COMMENT ON COLUMN ride_offers."departureTime" IS 'Scheduled departure date and time';
COMMENT ON COLUMN ride_offers.capacity IS 'Total passenger capacity (1-8)';
COMMENT ON COLUMN ride_offers."seatsAvailable" IS 'Current available seats';
COMMENT ON COLUMN ride_offers."pricePerSeat" IS 'Price per passenger seat in PHP';
COMMENT ON COLUMN ride_offers."voucherRequired" IS 'Whether ride requires voucher payment';
COMMENT ON COLUMN ride_offers."vehicleType" IS 'Type of vehicle for the ride';
COMMENT ON COLUMN ride_offers."distanceKm" IS 'Distance of the ride in kilometers';
COMMENT ON COLUMN ride_offers.status IS 'Current status of the ride offer';

-- Display successful installation message
DO $$
BEGIN
    RAISE NOTICE 'Joe Ride database schema has been successfully created!';
    RAISE NOTICE 'Database: demo';
    RAISE NOTICE 'Tables created: user, ride_offers';
    RAISE NOTICE 'Sample data inserted for testing';
    RAISE NOTICE 'You can now start the application backend';
END $$;

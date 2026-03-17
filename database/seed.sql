-- ===== BeanBliss Coffee - Database Setup =====
-- Run this SQL in Supabase SQL Editor

-- 1. Tables (โต๊ะ)
CREATE TABLE IF NOT EXISTS tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  seats INTEGER NOT NULL DEFAULT 2,
  zone VARCHAR(30) NOT NULL DEFAULT 'center',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Reservations (การจอง)
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(10) NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admins (แอดมิน)
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Seed Data =====

-- Admin (username: admin, password: admin123)
INSERT INTO admins (username, password_hash) VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Tables - Window Zone (ริมหน้าต่าง)
INSERT INTO tables (name, seats, zone, is_available) VALUES
('W-01', 2, 'window', true),
('W-02', 2, 'window', true),
('W-03', 4, 'window', true);

-- Tables - Center Zone (กลางร้าน)
INSERT INTO tables (name, seats, zone, is_available) VALUES
('C-01', 4, 'center', true),
('C-02', 4, 'center', true),
('C-03', 6, 'center', true),
('C-04', 2, 'center', true),
('C-05', 2, 'center', true);

-- Tables - Garden Zone (สวน)
INSERT INTO tables (name, seats, zone, is_available) VALUES
('G-01', 4, 'garden', true),
('G-02', 6, 'garden', true),
('G-03', 2, 'garden', true);

-- Tables - Private Zone (ห้องส่วนตัว)
INSERT INTO tables (name, seats, zone, is_available) VALUES
('P-01', 8, 'private', true),
('P-02', 10, 'private', true);

-- ===== Enable Row Level Security (optional) =====
-- ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes
-- CREATE POLICY "Allow all" ON tables FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON reservations FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON admins FOR ALL USING (true);

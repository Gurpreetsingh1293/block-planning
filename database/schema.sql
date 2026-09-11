-- =========================================================================
-- INDIAN RAILWAYS MAINTENANCE BLOCK PLANNING - SUPABASE POSTGRESQL SCHEMA
-- =========================================================================

-- 1. RAILWAY USERS / OFFICERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(50) NOT NULL, -- 'engineering', 'snt', 'traction'
  password VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  role VARCHAR(50) DEFAULT 'engineer',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. CORRIDORS & STATIONS
CREATE TABLE IF NOT EXISTS corridors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  tracks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stations (
  code VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  km_position NUMERIC(8,2) DEFAULT 0,
  platforms INT DEFAULT 4,
  station_type VARCHAR(50) DEFAULT 'junction',
  division VARCHAR(100) DEFAULT 'Northern Railway',
  x_coord INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRAIN TIMETABLES & LIVE MOVEMENTS
CREATE TABLE IF NOT EXISTS trains (
  id VARCHAR(50) PRIMARY KEY,
  number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'PASSENGER' | 'CARGO'
  category VARCHAR(100),
  source VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  current_station VARCHAR(100),
  next_station VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ON TIME',
  delay_minutes INT DEFAULT 0,
  eta VARCHAR(20),
  speed VARCHAR(50) DEFAULT '0 km/h',
  route_section VARCHAR(100),
  platform VARCHAR(20),
  coordinates JSONB NOT NULL DEFAULT '{"x": 50, "y": 50}',
  stops JSONB NOT NULL DEFAULT '[]',
  priority INT DEFAULT 3,
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trains_type ON trains(type);
CREATE INDEX IF NOT EXISTS idx_trains_status ON trains(status);

CREATE TABLE IF NOT EXISTS station_timetables (
  id SERIAL PRIMARY KEY,
  station_code VARCHAR(20) REFERENCES stations(code) ON DELETE CASCADE,
  train_number VARCHAR(20) NOT NULL,
  train_name VARCHAR(100) NOT NULL,
  time VARCHAR(20) NOT NULL,
  route VARCHAR(150) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL,
  direction VARCHAR(10) DEFAULT 'DN',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_station ON station_timetables(station_code);

-- 4. UNIFIED MAINTENANCE BLOCKS (Teams Calendar + Department Operations)
CREATE TABLE IF NOT EXISTS maintenance_blocks (
  id VARCHAR(100) PRIMARY KEY,
  slot_id VARCHAR(100) UNIQUE,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(50),
  dept_tag VARCHAR(50),
  section VARCHAR(255) NOT NULL,
  track VARCHAR(100) DEFAULT 'Main Line',
  date DATE,
  date_label VARCHAR(10),
  day_index INT,
  day VARCHAR(10) NOT NULL DEFAULT 'mon',
  start_time VARCHAR(20) NOT NULL,
  end_time VARCHAR(20) NOT NULL,
  start_hour NUMERIC(4,2) NOT NULL DEFAULT 9.0,
  duration VARCHAR(50) DEFAULT '1 hour',
  duration_minutes INT NOT NULL DEFAULT 60,
  duration_hours NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  booked_by VARCHAR(255),
  in_charge VARCHAR(255),
  color_key VARCHAR(50) DEFAULT 'white',
  gang_strength VARCHAR(100),
  machine_type VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'Medium',
  coordinated_with JSONB DEFAULT '[]',
  description TEXT,
  is_clickable BOOLEAN DEFAULT TRUE,
  admin_created BOOLEAN DEFAULT TRUE,
  is_optimized BOOLEAN DEFAULT FALSE,
  optimization_note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Safe Alter statements in case table exists with prior schema
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS slot_id VARCHAR(100);
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS dept_tag VARCHAR(50);
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS track VARCHAR(100) DEFAULT 'Main Line';
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS date_label VARCHAR(10);
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS day_index INT;
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS duration VARCHAR(50) DEFAULT '1 hour';
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 60;
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS booked_by VARCHAR(255);
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS in_charge VARCHAR(255);
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS color_key VARCHAR(50) DEFAULT 'white';
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS admin_created BOOLEAN DEFAULT TRUE;
ALTER TABLE maintenance_blocks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE maintenance_blocks ALTER COLUMN department DROP NOT NULL;
ALTER TABLE maintenance_blocks ALTER COLUMN day DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blocks_dept ON maintenance_blocks(department);
CREATE INDEX IF NOT EXISTS idx_blocks_day ON maintenance_blocks(day);
CREATE INDEX IF NOT EXISTS idx_blocks_date ON maintenance_blocks(date);
CREATE INDEX IF NOT EXISTS idx_blocks_status ON maintenance_blocks(status);
CREATE INDEX IF NOT EXISTS idx_blocks_slot ON maintenance_blocks(slot_id);

-- 5. BLOCK CONFLICTS & AI OPTIMIZATION
CREATE TABLE IF NOT EXISTS block_conflicts (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  section VARCHAR(100) NOT NULL,
  current_window VARCHAR(50) NOT NULL,
  affected_block_id VARCHAR(100) REFERENCES maintenance_blocks(id) ON DELETE CASCADE,
  conflicting_traffic VARCHAR(255) NOT NULL,
  conflict_time VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  impact TEXT,
  suggested_window VARCHAR(50) NOT NULL,
  ai_reason TEXT,
  expected_impact TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. S&T CORRIDOR MAINTENANCE TASKS (Delhi-Mumbai Operations)
CREATE TABLE IF NOT EXISTS st_maintenance_tasks (
  id VARCHAR(50) PRIMARY KEY,
  section_id VARCHAR(50) NOT NULL,
  track_section_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  task_type VARCHAR(50) NOT NULL,
  asset VARCHAR(100) NOT NULL,
  asset_id VARCHAR(50),
  location VARCHAR(255) NOT NULL,
  station_id VARCHAR(20) REFERENCES stations(code) ON DELETE SET NULL,
  urgency VARCHAR(20) DEFAULT 'medium',
  required_duration VARCHAR(50) NOT NULL,
  manpower VARCHAR(100),
  recommended_window VARCHAR(100),
  description TEXT,
  affected_tracks JSONB DEFAULT '[]',
  required_block_path JSONB DEFAULT '[]',
  estimated_cost VARCHAR(50),
  last_maintenance DATE,
  next_due DATE,
  work_started VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_st_tasks_station ON st_maintenance_tasks(station_id);
CREATE INDEX IF NOT EXISTS idx_st_tasks_status ON st_maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_st_tasks_type ON st_maintenance_tasks(task_type);

-- 7. NETWORK MONITORING METRICS
CREATE TABLE IF NOT EXISTS network_metrics (
  id SERIAL PRIMARY KEY,
  total_monitored INT DEFAULT 124,
  on_time INT DEFAULT 118,
  delayed INT DEFAULT 6,
  corridors_active INT DEFAULT 5,
  freight_in_transit INT DEFAULT 38,
  passenger_in_transit INT DEFAULT 86,
  average_network_speed VARCHAR(50) DEFAULT '94.2 km/h',
  critical_alerts INT DEFAULT 1,
  recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. DEDICATED BLOCK PLANNING & OFFICER ASSIGNMENT TABLE (With Foreign Key Relations)
CREATE TABLE IF NOT EXISTS block_planning (
  id SERIAL PRIMARY KEY,
  slot_id VARCHAR(100) NOT NULL REFERENCES maintenance_blocks(slot_id) ON DELETE CASCADE,
  officer_id VARCHAR(50) REFERENCES users(user_id) ON DELETE SET NULL,
  officer_name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) DEFAULT 'Junior Engineer',
  work_title VARCHAR(255) NOT NULL,
  work_description TEXT,
  section VARCHAR(255) NOT NULL,
  track VARCHAR(100) DEFAULT 'Main Line',
  scheduled_date DATE NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  end_time VARCHAR(20) NOT NULL,
  duration VARCHAR(50) DEFAULT '2 hours',
  duration_minutes INT DEFAULT 120,
  status VARCHAR(50) DEFAULT 'Occupied',
  booking_channel VARCHAR(50) DEFAULT 'Teams Calendar Web Portal',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bp_slot_id ON block_planning(slot_id);
CREATE INDEX IF NOT EXISTS idx_bp_officer_id ON block_planning(officer_id);
CREATE INDEX IF NOT EXISTS idx_bp_department ON block_planning(department);
CREATE INDEX IF NOT EXISTS idx_bp_date ON block_planning(scheduled_date);


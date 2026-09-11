const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const { sequelize } = require('../backend/src/config/postgres');
const Block = require('../backend/src/models/Block');

async function migrate() {
  console.log('Connecting to Supabase...');
  await sequelize.authenticate();
  console.log('✅ Connected.');

  // 1. Create table block_planning
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS block_planning (
      id SERIAL PRIMARY KEY,
      slot_id VARCHAR(100) NOT NULL,
      officer_id VARCHAR(50),
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
  `);
  console.log('✅ Table block_planning verified/created.');

  // 2. Add Foreign Key constraints if not present
  try {
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bp_user') THEN
          ALTER TABLE block_planning 
          ADD CONSTRAINT fk_bp_user FOREIGN KEY (officer_id) REFERENCES users(user_id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    console.log('✅ Foreign Key constraint fk_bp_user (users) created/verified.');
  } catch (e) {
    console.warn('FK note:', e.message);
  }

  // 3. Register Gurpreet paji in users table if not exists
  await sequelize.query(`
    INSERT INTO users (user_id, name, department, password, designation, role)
    VALUES ('TRD002', 'Gurpreet Singh (Gurpreet paji)', 'traction', '$2a$10$Bd8yjjxxYymwrXmFjJyDueukgYTddVeY9Lfydlmwzhm41LLbhS13q', 'Junior Engineer (Electrical / Traction)', 'engineer')
    ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, designation = EXCLUDED.designation;
  `);
  console.log('✅ Registered Officer Gurpreet Singh in users table.');

  // 4. Insert / Sync Gurpreet paji booking into block_planning table
  const pajiSlot = await Block.findOne({ where: { slotId: 'SLOT-2026-004' } });
  if (pajiSlot) {
    await sequelize.query(`
      DELETE FROM block_planning WHERE slot_id = 'SLOT-2026-004';
      INSERT INTO block_planning (
        slot_id, officer_id, officer_name, department, designation, 
        work_title, work_description, section, track, 
        scheduled_date, start_time, end_time, duration, duration_minutes, status
      ) VALUES (
        'SLOT-2026-004', 'TRD002', 'gurpreet paji', 'Electrical', 'Junior Engineer (Electrical / Traction)',
        '${pajiSlot.title || 'Electrical Maintenance: oil change'}', '${pajiSlot.description || 'oil change'}', '${pajiSlot.section}', '${pajiSlot.track}',
        '${pajiSlot.date || '2026-09-14'}', '${pajiSlot.startTime || '08:00'}', '${pajiSlot.endTime || '10:00'}', '2 hours', 120, 'Occupied'
      );
    `);
    console.log('✅ Inserted Gurpreet paji booking into block_planning table!');
  }

  // 5. Also sync other occupied blocks into block_planning table
  const occupiedSlots = await Block.findAll({ where: { status: 'Occupied' } });
  for (const slot of occupiedSlots) {
    if (slot.slotId === 'SLOT-2026-004') continue; // already inserted
    const officerName = slot.bookedBy || slot.inCharge || 'Section Officer';
    await sequelize.query(`
      DELETE FROM block_planning WHERE slot_id = '${slot.slotId}';
      INSERT INTO block_planning (
        slot_id, officer_id, officer_name, department, designation, 
        work_title, work_description, section, track, 
        scheduled_date, start_time, end_time, duration, duration_minutes, status
      ) VALUES (
        '${slot.slotId}', null, '${officerName}', '${slot.department || 'Operations'}', 'Section Engineer',
        '${slot.title.replace(/'/g, "''")}', '${(slot.description || '').replace(/'/g, "''")}', '${slot.section}', '${slot.track || 'Main Line'}',
        '${slot.date || '2026-09-11'}', '${slot.startTime}', '${slot.endTime}', '${slot.duration || '2 hours'}', ${slot.durationMinutes || 120}, 'Occupied'
      );
    `);
  }
  console.log(`✅ Synced all ${occupiedSlots.length} occupied slots into block_planning table.`);

  // 6. Query and display rows from block_planning table
  const [rows] = await sequelize.query(`
    SELECT bp.id, bp.slot_id, bp.officer_name, bp.department, bp.work_title, bp.work_description, bp.scheduled_date, bp.start_time, bp.end_time, u.name as registered_user_name, u.designation as user_designation
    FROM block_planning bp
    LEFT JOIN users u ON bp.officer_id = u.user_id
    ORDER BY bp.scheduled_date ASC, bp.start_time ASC;
  `);

  console.log('🎉 ROWS IN NEW block_planning TABLE:');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

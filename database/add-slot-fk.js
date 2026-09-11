const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('[Migration] Updating null slot_ids in maintenance_blocks...');
  await pool.query(`
    UPDATE maintenance_blocks 
    SET slot_id = 'SLOT-AUTO-' || UPPER(REPLACE(id, 'block-', '')) 
    WHERE slot_id IS NULL;
  `);

  console.log('[Migration] Adding UNIQUE constraint to maintenance_blocks(slot_id)...');
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_maintenance_blocks_slot'
      ) THEN
        ALTER TABLE maintenance_blocks ADD CONSTRAINT uq_maintenance_blocks_slot UNIQUE (slot_id);
      END IF;
    END
    $$;
  `);

  console.log('[Migration] Adding foreign key fk_bp_slot to block_planning(slot_id)...');
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_bp_slot'
      ) THEN
        ALTER TABLE block_planning 
        ADD CONSTRAINT fk_bp_slot FOREIGN KEY (slot_id) 
        REFERENCES maintenance_blocks(slot_id) 
        ON UPDATE CASCADE ON DELETE SET NULL;
      END IF;
    END
    $$;
  `);

  const rels = await pool.query(`
    SELECT 
      tc.constraint_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name, 
      ccu.column_name AS foreign_column_name 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name 
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name 
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'block_planning';
  `);

  console.log('\n[Success] Active Foreign Keys for `block_planning`:');
  console.table(rels.rows);
  await pool.end();
}

main().catch(err => {
  console.error('[Migration Error]', err);
  process.exit(1);
});

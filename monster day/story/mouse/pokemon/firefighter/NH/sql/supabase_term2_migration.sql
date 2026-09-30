-- =========================================================================
-- ENGLISH ADVENTURE ACADEMY — TERM 2 DATABASE SCHEMA MIGRATION & RLS REPAIR
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/raraoopavipwypvgpuhe/sql)
-- =========================================================================

-- 1. Ensure students table schema has all required attributes for Term 2
ALTER TABLE students 
  ADD COLUMN IF NOT EXISTS archived_xp INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS stage_name TEXT DEFAULT 'Level 1 • Mystery Egg',
  ADD COLUMN IF NOT EXISTS alice_character TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS korean_role TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS custom_icon TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS xp_history JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);

-- 2. Clear RLS permission blocks for client-side syncing across devices
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon full access" ON students;
CREATE POLICY "Allow anon full access" 
ON students FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- =============================================================================
-- ENGLISH ADVENTURE ACADEMY — PRODUCTION SUPABASE POSTGRESQL SCHEMA (v2.0)
-- Full cross-device persistence tables, migrations, RLS policies, and realtime
-- =============================================================================

-- 1. TEACHER NOTES TABLE
CREATE TABLE IF NOT EXISTS public.teacher_notes (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Mr. Maysam',
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_notes_student ON public.teacher_notes (student_id);
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to teacher notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow insert access to teacher notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow update access to teacher notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow delete access to teacher notes" ON public.teacher_notes;

CREATE POLICY "Allow read access to teacher notes" ON public.teacher_notes FOR SELECT USING (true);
CREATE POLICY "Allow insert access to teacher notes" ON public.teacher_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to teacher notes" ON public.teacher_notes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to teacher notes" ON public.teacher_notes FOR DELETE USING (true);

-- 2. FOUR-SKILL ASSESSMENT RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    assessment_id TEXT NOT NULL,
    reading_score NUMERIC NOT NULL DEFAULT 0,
    listening_score NUMERIC NOT NULL DEFAULT 0,
    writing_score NUMERIC NOT NULL DEFAULT 0,
    speaking_score NUMERIC NOT NULL DEFAULT 0,
    total_score NUMERIC NOT NULL DEFAULT 0,
    max_score NUMERIC NOT NULL DEFAULT 40,
    mastery TEXT NOT NULL DEFAULT 'Developing',
    xp_earned INTEGER NOT NULL DEFAULT 0,
    teacher_note TEXT DEFAULT '',
    date TEXT NOT NULL,
    display_date TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_student ON public.assessment_results (student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_class ON public.assessment_results (class_id);
CREATE INDEX IF NOT EXISTS idx_assessment_check ON public.assessment_results (assessment_id);
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to assessments" ON public.assessment_results;
DROP POLICY IF EXISTS "Allow insert access to assessments" ON public.assessment_results;
DROP POLICY IF EXISTS "Allow update access to assessments" ON public.assessment_results;
DROP POLICY IF EXISTS "Allow delete access to assessments" ON public.assessment_results;

CREATE POLICY "Allow read access to assessments" ON public.assessment_results FOR SELECT USING (true);
CREATE POLICY "Allow insert access to assessments" ON public.assessment_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to assessments" ON public.assessment_results FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to assessments" ON public.assessment_results FOR DELETE USING (true);

-- 3. XP AUDIT LEDGER TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'positive',
    icon TEXT NOT NULL DEFAULT '⭐',
    date TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'manual',
    source_id TEXT,
    class_id TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_xp_student ON public.xp_transactions (student_id);
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to xp transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Allow insert access to xp transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Allow update access to xp transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Allow delete access to xp transactions" ON public.xp_transactions;

CREATE POLICY "Allow read access to xp transactions" ON public.xp_transactions FOR SELECT USING (true);
CREATE POLICY "Allow insert access to xp transactions" ON public.xp_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to xp transactions" ON public.xp_transactions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to xp transactions" ON public.xp_transactions FOR DELETE USING (true);

-- 4. STUDENT PROFILES & COMPLETE STUDENT ROSTER
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    student_id_number TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 8,
    grade TEXT NOT NULL DEFAULT 'Grade 3',
    overall_cefr TEXT NOT NULL DEFAULT 'A1',
    avatar JSONB DEFAULT '{"hair":"girl","outfit":"explorer","accessory":"none"}'::jsonb,
    parent_name TEXT DEFAULT '',
    parent_contact TEXT DEFAULT '',
    parent_email TEXT DEFAULT '',
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak_days INTEGER NOT NULL DEFAULT 0,
    equipped_monster TEXT DEFAULT 'Mystery Egg',
    archived BOOLEAN NOT NULL DEFAULT false,
    latest_teacher_note TEXT DEFAULT '',
    manual_cefr_overrides JSONB DEFAULT '{}'::jsonb,
    monster_profile JSONB DEFAULT '{}'::jsonb,
    extra_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent Column Additions (for updating existing database instances)
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS age INTEGER NOT NULL DEFAULT 8;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS grade TEXT NOT NULL DEFAULT 'Grade 3';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS overall_cefr TEXT NOT NULL DEFAULT 'A1';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar JSONB DEFAULT '{"hair":"girl","outfit":"explorer","accessory":"none"}'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_name TEXT DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_contact TEXT DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_email TEXT DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS equipped_monster TEXT DEFAULT 'Mystery Egg';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS extra_data JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_student_number ON public.students (student_id_number);
CREATE INDEX IF NOT EXISTS idx_student_class ON public.students (class_id);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to students" ON public.students;
DROP POLICY IF EXISTS "Allow insert access to students" ON public.students;
DROP POLICY IF EXISTS "Allow update access to students" ON public.students;
DROP POLICY IF EXISTS "Allow delete access to students" ON public.students;

CREATE POLICY "Allow read access to students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow insert access to students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to students" ON public.students FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to students" ON public.students FOR DELETE USING (true);

-- 5. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance_records (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON public.attendance_records (class_id, date);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow insert access to attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow update access to attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow delete access to attendance" ON public.attendance_records;

CREATE POLICY "Allow read access to attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow insert access to attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to attendance" ON public.attendance_records FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to attendance" ON public.attendance_records FOR DELETE USING (true);

-- 6. CLASSES COHORT TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade 3',
    teacher TEXT NOT NULL DEFAULT 'Mr. Maysam',
    primary_book_id TEXT DEFAULT 'book-global-readings-2',
    academic_year TEXT DEFAULT '2026–2027',
    cefr_target TEXT DEFAULT 'A1',
    room TEXT DEFAULT '',
    schedule TEXT DEFAULT '',
    description TEXT DEFAULT '',
    archived BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to classes" ON public.classes;
DROP POLICY IF EXISTS "Allow insert access to classes" ON public.classes;
DROP POLICY IF EXISTS "Allow update access to classes" ON public.classes;
DROP POLICY IF EXISTS "Allow delete access to classes" ON public.classes;

CREATE POLICY "Allow read access to classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow insert access to classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to classes" ON public.classes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to classes" ON public.classes FOR DELETE USING (true);

-- 7. SUPABASE REALTIME REPLICATION (Instant multi-device live sync)
-- Enable realtime broadcasting for all educational entities
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.teacher_notes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.assessment_results;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.xp_transactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

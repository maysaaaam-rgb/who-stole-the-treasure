-- =============================================================================
-- ENGLISH ADVENTURE ACADEMY — PRODUCTION SUPABASE POSTGRESQL SCHEMA (v2.1)
-- Full cross-device persistence tables, migrations, RLS policies, and realtime
-- Compatible with anon publishable keys (sb_publishable_...) & authenticated roles
-- =============================================================================

-- Ensure schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 1. CLASSES COHORT TABLE
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

-- 2. STUDENT PROFILES & COMPLETE STUDENT ROSTER
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

-- 4. TEACHER NOTES TABLE
CREATE TABLE IF NOT EXISTS public.teacher_notes (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Mr. Maysam',
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FOUR-SKILL ASSESSMENT RESULTS TABLE
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

-- 6. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for high performance
CREATE INDEX IF NOT EXISTS idx_student_number ON public.students (student_id_number);
CREATE INDEX IF NOT EXISTS idx_student_class ON public.students (class_id);
CREATE INDEX IF NOT EXISTS idx_xp_student ON public.xp_transactions (student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_notes_student ON public.teacher_notes (student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_student ON public.assessment_results (student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_class ON public.assessment_results (class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance_records (student_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Clean existing policies safely
DO $$
DECLARE
  t text;
  pol text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['classes', 'students', 'xp_transactions', 'teacher_notes', 'assessment_results', 'attendance_records']) LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol, t);
    END LOOP;
  END LOOP;
END $$;

-- Create comprehensive CRUD policies for anon and authenticated
CREATE POLICY "Allow all access to classes" ON public.classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to students" ON public.students FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to xp_transactions" ON public.xp_transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to teacher_notes" ON public.teacher_notes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to assessment_results" ON public.assessment_results FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance_records" ON public.attendance_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Explicitly grant permissions on all tables to anon, authenticated, and service_role
GRANT ALL ON TABLE public.classes TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.students TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.xp_transactions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.teacher_notes TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.assessment_results TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.attendance_records TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Realtime Publication for instant cross-device synchronization
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.classes, public.students, public.xp_transactions, public.teacher_notes, public.assessment_results, public.attendance_records;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

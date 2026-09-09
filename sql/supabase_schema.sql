-- =============================================================================
-- ENGLISH ADVENTURE ACADEMY — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Tables and Row Level Security (RLS) policies for cross-device persistence
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

CREATE POLICY "Allow read access to xp transactions" ON public.xp_transactions FOR SELECT USING (true);
CREATE POLICY "Allow insert access to xp transactions" ON public.xp_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to xp transactions" ON public.xp_transactions FOR UPDATE USING (true) WITH CHECK (true);

-- 4. STUDENT PROFILES & OVERRIDES TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    student_id_number TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak_days INTEGER NOT NULL DEFAULT 0,
    latest_teacher_note TEXT DEFAULT '',
    manual_cefr_overrides JSONB DEFAULT '{}'::jsonb,
    monster_profile JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_number ON public.students (student_id_number);
CREATE INDEX IF NOT EXISTS idx_student_class ON public.students (class_id);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow insert access to students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to students" ON public.students FOR UPDATE USING (true) WITH CHECK (true);

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

CREATE POLICY "Allow read access to attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow insert access to attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to attendance" ON public.attendance_records FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access to attendance" ON public.attendance_records FOR DELETE USING (true);

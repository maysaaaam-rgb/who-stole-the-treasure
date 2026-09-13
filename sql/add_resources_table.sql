-- =============================================================================
-- ENGLISH ADVENTURE ACADEMY — MIGRATION: ADD PUBLIC.RESOURCES TABLE
-- Run this in the Supabase SQL Editor if you want to initialize/re-sync
-- the dedicated public.resources table for project raraoopavipwypvgpuhe.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'game',
    category TEXT NOT NULL DEFAULT 'Classroom Game',
    description TEXT DEFAULT '',
    cefr_level TEXT DEFAULT 'A1',
    target_age TEXT DEFAULT '7–9',
    grade TEXT DEFAULT 'Grade 3',
    duration INTEGER DEFAULT 30,
    topic TEXT DEFAULT '',
    topics JSONB DEFAULT '[]'::jsonb,
    route TEXT DEFAULT '',
    skills JSONB DEFAULT '[]'::jsonb,
    objectives JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT DEFAULT '',
    worksheet TEXT DEFAULT '',
    teacher_guide BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT DEFAULT 'teacher',
    status TEXT DEFAULT 'active',
    extra_data JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources (category);
CREATE INDEX IF NOT EXISTS idx_resources_grade ON public.resources (grade);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON public.resources (featured);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow all access to resources" ON public.resources;
EXCEPTION WHEN others THEN
    NULL;
END $$;

CREATE POLICY "Allow all access to resources" ON public.resources FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.resources TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END $$;

NOTIFY pgrst, 'reload schema';

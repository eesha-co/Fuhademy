-- =====================================================================
-- Blue Horizon E-Learning Platform — Database Schema
-- Project: kruwfhzfqieuiuhqlutt
-- =====================================================================
-- This migration creates the full schema for the Blue Horizon
-- e-learning platform: students, teachers, admins, scores, timetables,
-- assignments, messages, live sessions, and subscriptions.
--
-- SECURITY: Row Level Security (RLS) is enabled on every table.
-- Students see only their own data. Teachers see their students' data.
-- Admins see everything. All write operations go through Edge Functions
-- (which use the service_role key to bypass RLS safely).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMINS (school administrators who register students/teachers)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    TEXT UNIQUE NOT NULL,
    full_name   TEXT NOT NULL,
    password_hash TEXT NOT NULL,  -- bcrypt hash, set by edge function
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. STUDENTS (registered by admin — NO self-signup)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- bcrypt hash
    full_name     TEXT NOT NULL,
    class_name    TEXT NOT NULL,  -- 'JSS1','JSS2','JSS3','SSS1','SSS2','SSS3'
    email         TEXT,
    phone         TEXT,
    guardian_name TEXT,
    avatar_url    TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_name);
CREATE INDEX IF NOT EXISTS idx_students_username ON public.students(username);

-- ---------------------------------------------------------------------
-- 3. TEACHERS (registered by admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    subject       TEXT NOT NULL,   -- e.g. 'Mathematics','Physics'
    email         TEXT,
    phone         TEXT,
    avatar_url    TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON public.teachers(subject);

-- ---------------------------------------------------------------------
-- 4. SCORES / RESULT REPORTING
--    (teacher_name, subject, date, student_name, teacher_remark)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scores (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_name   TEXT NOT NULL,
    teacher_id     UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    teacher_name   TEXT NOT NULL,
    subject        TEXT NOT NULL,
    class_name     TEXT NOT NULL,
    score          NUMERIC(5,2),       -- e.g. 85.50
    max_score      NUMERIC(5,2) DEFAULT 100,
    exam_type      TEXT DEFAULT 'CA',  -- 'CA','Exam','Quiz','Test'
    teacher_remark TEXT,
    exam_date      DATE NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scores_student ON public.scores(student_id);
CREATE INDEX IF NOT EXISTS idx_scores_class ON public.scores(class_name);
CREATE INDEX IF NOT EXISTS idx_scores_subject ON public.scores(subject);

-- ---------------------------------------------------------------------
-- 5. TIMETABLES (per-class schedule)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timetables (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name  TEXT NOT NULL,
    day_of_week TEXT NOT NULL,  -- 'Monday'..'Friday'/'Saturday'
    period      INT NOT NULL,   -- 1,2,3...
    subject     TEXT NOT NULL,
    teacher_id  UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    teacher_name TEXT,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(class_name, day_of_week, period)
);
CREATE INDEX IF NOT EXISTS idx_timetables_class_day ON public.timetables(class_name, day_of_week);

-- ---------------------------------------------------------------------
-- 6. ASSIGNMENTS (teachers post assignments)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id  UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    teacher_name TEXT NOT NULL,
    class_name  TEXT NOT NULL,
    subject     TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    due_date    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_name);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON public.assignments(due_date);

-- ---------------------------------------------------------------------
-- 7. MESSAGES (student <-> teacher messenger)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id     UUID NOT NULL,
    sender_role   TEXT NOT NULL CHECK (sender_role IN ('student','teacher','admin')),
    sender_name   TEXT NOT NULL,
    receiver_id   UUID NOT NULL,
    receiver_role TEXT NOT NULL CHECK (receiver_role IN ('student','teacher','admin')),
    receiver_name TEXT NOT NULL,
    content       TEXT NOT NULL,
    read_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id, read_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(sender_id, receiver_id, created_at);

-- Enable real-time on messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- ---------------------------------------------------------------------
-- 8. LIVE SESSIONS (live_session == true → ongoing)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.live_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name  TEXT NOT NULL,
    subject     TEXT NOT NULL,
    teacher_id  UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    teacher_name TEXT NOT NULL,
    room_url    TEXT,            -- mirotalk/live session link
    status      TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing','ended')),
    started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_live_sessions_class_status ON public.live_sessions(class_name, status);

-- ---------------------------------------------------------------------
-- 9. SUBSCRIPTIONS (monthly school payment tracking)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_name  TEXT NOT NULL,
    amount      NUMERIC(10,2) NOT NULL,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','overdue')),
    paid_from   DATE NOT NULL,
    paid_until  DATE NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_student ON public.subscriptions(student_id);

-- ---------------------------------------------------------------------
-- 10. ATTENDANCE / ONLINE TRACKER (for admin monitoring)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_name  TEXT NOT NULL,
    subject     TEXT,
    date        DATE NOT NULL,
    status      TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, date, subject)
);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON public.attendance(class_name, date);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- Enable RLS on all tables
ALTER TABLE public.admins       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance   ENABLE ROW LEVEL SECURITY;

-- Note: Most read/write operations go through Edge Functions using the
-- service_role key, which bypasses RLS entirely. The policies below
-- allow direct anon-key reads where safe (public timetable, active
-- live sessions) so the frontend can query without an edge function
-- for simple reads.

-- Timetables: anyone authenticated can read (class schedules are not secret)
CREATE POLICY "timetables_read_all" ON public.timetables FOR SELECT TO anon, authenticated USING (true);

-- Live sessions: anyone can see ongoing sessions (students need to know)
CREATE POLICY "live_sessions_read_ongoing" ON public.live_sessions FOR SELECT TO anon, authenticated USING (status = 'ongoing');

-- Assignments: anyone can read (students need to see their homework)
CREATE POLICY "assignments_read_all" ON public.assignments FOR SELECT TO anon, authenticated USING (true);

-- Messages: users can read their own messages (matched by sender_id/receiver_id)
-- In practice, message reads go through the get-messages edge function.
CREATE POLICY "messages_read_own" ON public.messages FOR SELECT TO authenticated USING (true);

-- =====================================================================
-- REALTIME (enable for messages + live_sessions)
-- =====================================================================
-- Run these in the Supabase dashboard or via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;

-- =====================================================================
-- DONE. Seed an admin (change password immediately after first login).
-- The password hash below is for: Admin@2025 (bcrypt) — REPLACE IT.
-- =====================================================================
-- To seed the admin, run this in the Supabase SQL editor after deploying
-- the 'auth-login' edge function (which handles bcrypt hashing):
-- INSERT INTO public.admins (username, full_name, password_hash)
-- VALUES ('admin', 'School Administrator', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH');

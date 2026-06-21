-- ============================================
-- JUANOVA CORTEX - COMPLETE DATABASE SETUP
-- Run this script in Supabase SQL Editor
-- Creates all required tables with RLS policies
-- ============================================

-- ============================================
-- 1. USER_STATS TABLE
-- Tracks overall user statistics
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    overall_average DECIMAL(5,2) DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    total_study_minutes INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

-- Create RLS policies
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_stats TO authenticated;


-- ============================================
-- 2. QUIZ_RESULTS TABLE
-- Stores all quiz attempt records
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_name VARCHAR(255),
    subject VARCHAR(100),
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    quiz_type VARCHAR(50) DEFAULT 'practice',
    difficulty VARCHAR(20) DEFAULT 'medium',
    questions_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_subject ON public.quiz_results(subject);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at DESC);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can insert own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can delete own quiz results" ON public.quiz_results;

-- Create RLS policies
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz results" ON public.quiz_results
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.quiz_results TO authenticated;


-- ============================================
-- 3. USER_PROGRESS TABLE
-- Tracks subject-wise progress for each user
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    total_quizzes INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    average_percentage DECIMAL(5,2) DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject ON public.user_progress(subject);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

-- Create RLS policies
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_progress TO authenticated;


-- ============================================
-- 4. USER_GOALS TABLE
-- Stores user learning goals
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    unit VARCHAR(20) DEFAULT '%',
    deadline DATE,
    status VARCHAR(20) DEFAULT 'active',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON public.user_goals(status);

-- Enable RLS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.user_goals;

-- Create RLS policies
CREATE POLICY "Users can view own goals" ON public.user_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_goals TO authenticated;


-- ============================================
-- 5. STUDY_SESSIONS TABLE
-- Tracks study time and sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) DEFAULT 'study',
    subject VARCHAR(100),
    duration_minutes INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    questions_practiced INTEGER DEFAULT 0,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON public.study_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can insert own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can delete own study sessions" ON public.study_sessions;

-- Create RLS policies
CREATE POLICY "Users can view own study sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions" ON public.study_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.study_sessions TO authenticated;


-- ============================================
-- 6. QUESTION_RESPONSES TABLE
-- Stores individual question responses for analysis
-- ============================================
CREATE TABLE IF NOT EXISTS public.question_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_result_id UUID REFERENCES public.quiz_results(id) ON DELETE CASCADE,
    question_id VARCHAR(255),
    question_text TEXT,
    subject VARCHAR(100),
    topic VARCHAR(100),
    user_answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    time_taken_seconds INTEGER DEFAULT 0,
    difficulty VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_question_responses_user_id ON public.question_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_subject ON public.question_responses(subject);
CREATE INDEX IF NOT EXISTS idx_question_responses_quiz ON public.question_responses(quiz_result_id);

-- Enable RLS
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own responses" ON public.question_responses;
DROP POLICY IF EXISTS "Users can insert own responses" ON public.question_responses;

-- Create RLS policies
CREATE POLICY "Users can view own responses" ON public.question_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" ON public.question_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.question_responses TO authenticated;


-- ============================================
-- 7. SUBJECTS TABLE
-- Reference table for available subjects
-- ============================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10),
    color VARCHAR(20),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subjects if not exist
INSERT INTO public.subjects (name, icon, color, category) VALUES
    ('Mathematics', '📐', 'red', 'Science'),
    ('English Language', '📚', 'blue', 'Arts'),
    ('Physics', '⚛️', 'green', 'Science'),
    ('Chemistry', '🧪', 'yellow', 'Science'),
    ('Biology', '🧬', 'purple', 'Science'),
    ('Geography', '🌍', 'cyan', 'Arts'),
    ('History', '🏛️', 'pink', 'Arts'),
    ('Economics', '💰', 'lime', 'Social Science'),
    ('Computer Science', '💻', 'orange', 'Science'),
    ('Literature in English', '📖', 'indigo', 'Arts'),
    ('Government', '🏛️', 'red', 'Social Science'),
    ('Commerce', '📊', 'teal', 'Social Science'),
    ('Accounting', '📈', 'emerald', 'Social Science'),
    ('Agricultural Science', '🌾', 'lime', 'Science'),
    ('Civic Education', '⚖️', 'cyan', 'Social Science')
ON CONFLICT (name) DO NOTHING;

-- Grant read access to all
GRANT SELECT ON public.subjects TO authenticated;
GRANT SELECT ON public.subjects TO anon;


-- ============================================
-- 8. TRIGGER FOR UPDATED_AT
-- ============================================
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_goals_updated_at ON public.user_goals;
CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON public.user_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify setup:
-- SELECT * FROM public.user_stats LIMIT 1;
-- SELECT * FROM public.quiz_results LIMIT 1;
-- SELECT * FROM public.user_progress LIMIT 1;
-- SELECT * FROM public.user_goals LIMIT 1;
-- SELECT * FROM public.study_sessions LIMIT 1;
-- SELECT * FROM public.subjects;
-- SELECT * FROM pg_policies WHERE tablename IN ('user_stats', 'quiz_results', 'user_progress', 'user_goals', 'study_sessions');

-- ============================================
-- DONE! All tables created with RLS policies
-- ============================================

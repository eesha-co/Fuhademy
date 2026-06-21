-- =====================================================
-- Topic Progress Tracking Tables for Juanova Cortex
-- =====================================================
-- Run this SQL in Supabase SQL Editor to create the required tables
-- for tracking user progress through educational topics

-- 1. TOPIC PROGRESS TABLE
-- Tracks user's viewing progress through each topic
-- =====================================================
CREATE TABLE IF NOT EXISTS topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id VARCHAR(255) NOT NULL,
    topic_title VARCHAR(500),
    subject VARCHAR(100),
    sections_viewed TEXT[] DEFAULT '{}',
    total_sections INTEGER DEFAULT 0,
    progress_percent INTEGER DEFAULT 0,
    time_spent BIGINT DEFAULT 0, -- milliseconds
    quiz_passed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_topic_id ON topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_subject ON topic_progress(subject);

-- Enable Row Level Security
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topic_progress
DROP POLICY IF EXISTS "Users can view own topic progress" ON topic_progress;
CREATE POLICY "Users can view own topic progress" ON topic_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own topic progress" ON topic_progress;
CREATE POLICY "Users can insert own topic progress" ON topic_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own topic progress" ON topic_progress;
CREATE POLICY "Users can update own topic progress" ON topic_progress
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own topic progress" ON topic_progress;
CREATE POLICY "Users can delete own topic progress" ON topic_progress
    FOR DELETE USING (auth.uid() = user_id);


-- 2. TOPIC QUIZ RESULTS TABLE
-- Stores quiz results for each topic attempt
-- =====================================================
CREATE TABLE IF NOT EXISTS topic_quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id VARCHAR(255) NOT NULL,
    topic_title VARCHAR(500),
    subject VARCHAR(100),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '[]',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_topic_quiz_results_user_id ON topic_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_quiz_results_topic_id ON topic_quiz_results(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_quiz_results_subject ON topic_quiz_results(subject);
CREATE INDEX IF NOT EXISTS idx_topic_quiz_results_completed_at ON topic_quiz_results(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE topic_quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topic_quiz_results
DROP POLICY IF EXISTS "Users can view own quiz results" ON topic_quiz_results;
CREATE POLICY "Users can view own quiz results" ON topic_quiz_results
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz results" ON topic_quiz_results;
CREATE POLICY "Users can insert own quiz results" ON topic_quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quiz results" ON topic_quiz_results;
CREATE POLICY "Users can delete own quiz results" ON topic_quiz_results
    FOR DELETE USING (auth.uid() = user_id);


-- 3. USER STATS TABLE (if not exists)
-- Aggregated statistics for user dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    topics_completed INTEGER DEFAULT 0,
    total_quiz_score INTEGER DEFAULT 0,
    total_quizzes_taken INTEGER DEFAULT 0,
    total_time_spent BIGINT DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
CREATE POLICY "Users can view own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
CREATE POLICY "Users can insert own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);


-- 4. STUDY SESSIONS TABLE (for detailed tracking)
-- Records individual study sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    session_start TIMESTAMPTZ NOT NULL,
    session_end TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    sections_viewed TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic_id ON study_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_session_start ON study_sessions(session_start DESC);

-- Enable Row Level Security
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own study sessions" ON study_sessions;
CREATE POLICY "Users can view own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study sessions" ON study_sessions;
CREATE POLICY "Users can insert own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own study sessions" ON study_sessions;
CREATE POLICY "Users can update own study sessions" ON study_sessions
    FOR UPDATE USING (auth.uid() = user_id);


-- 5. SUBJECT PROGRESS VIEW
-- Aggregated view of progress per subject
-- =====================================================
CREATE OR REPLACE VIEW subject_progress_view AS
SELECT 
    user_id,
    subject,
    COUNT(*) as total_topics,
    SUM(CASE WHEN quiz_passed = TRUE THEN 1 ELSE 0 END) as topics_completed,
    ROUND(AVG(progress_percent)::numeric, 2) as avg_progress,
    SUM(time_spent) as total_time_spent
FROM topic_progress
WHERE subject IS NOT NULL
GROUP BY user_id, subject;


-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to get user's overall progress
CREATE OR REPLACE FUNCTION get_user_overall_progress(p_user_id UUID)
RETURNS TABLE (
    total_topics BIGINT,
    completed_topics BIGINT,
    total_quizzes BIGINT,
    passed_quizzes BIGINT,
    avg_score NUMERIC,
    total_time BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM topic_progress WHERE user_id = p_user_id),
        (SELECT COUNT(*) FROM topic_progress WHERE user_id = p_user_id AND quiz_passed = TRUE),
        (SELECT COUNT(*) FROM topic_quiz_results WHERE user_id = p_user_id),
        (SELECT COUNT(*) FROM topic_quiz_results WHERE user_id = p_user_id AND passed = TRUE),
        (SELECT ROUND(AVG(percentage)::numeric, 2) FROM topic_quiz_results WHERE user_id = p_user_id),
        (SELECT COALESCE(SUM(time_spent), 0) FROM topic_progress WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to get subject-specific progress
CREATE OR REPLACE FUNCTION get_subject_progress(p_user_id UUID, p_subject VARCHAR)
RETURNS TABLE (
    topic_id VARCHAR,
    topic_title VARCHAR,
    progress_percent INTEGER,
    quiz_passed BOOLEAN,
    time_spent BIGINT,
    last_accessed TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.topic_id,
        tp.topic_title,
        tp.progress_percent,
        tp.quiz_passed,
        tp.time_spent,
        tp.last_accessed
    FROM topic_progress tp
    WHERE tp.user_id = p_user_id AND tp.subject = p_subject
    ORDER BY tp.last_accessed DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify tables were created correctly:
-- 
-- SELECT * FROM topic_progress LIMIT 1;
-- SELECT * FROM topic_quiz_results LIMIT 1;
-- SELECT * FROM user_stats LIMIT 1;
-- SELECT * FROM study_sessions LIMIT 1;
-- SELECT * FROM subject_progress_view LIMIT 1;
-- SELECT * FROM get_user_overall_progress('USER_ID_HERE');
-- SELECT * FROM get_subject_progress('USER_ID_HERE', 'chemistry');

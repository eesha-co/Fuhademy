-- ============================================
-- JUANOVA CORTEX - STUDY TRACKING TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. TOPIC PROGRESS TABLE
-- Tracks user progress on each topic
CREATE TABLE IF NOT EXISTS topic_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    subject_id TEXT,
    topic_id TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    time_spent_min INTEGER DEFAULT 0,
    quiz_score DECIMAL(5,2),
    quiz_attempts INTEGER DEFAULT 0,
    quiz_best_score DECIMAL(5,2),
    last_accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic)
);

-- 2. STUDY SESSIONS TABLE
-- Records individual study sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT,
    subject_id TEXT,
    topic_id TEXT,
    activity_type TEXT DEFAULT 'reading',
    duration_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY STUDY STATS TABLE
-- Aggregated daily statistics
CREATE TABLE IF NOT EXISTS daily_study_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_minutes INTEGER DEFAULT 0,
    topics_studied INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    avg_quiz_score DECIMAL(5,2),
    subjects TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 4. USER STATS TABLE
-- Overall user statistics
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_study_minutes INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    overall_average DECIMAL(5,2),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TOPIC QUIZZES TABLE
-- Stores quiz questions for topics
CREATE TABLE IF NOT EXISTS topic_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_ans TEXT NOT NULL CHECK (correct_ans IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEEKLY STUDY STATS TABLE
-- Aggregated weekly statistics
CREATE TABLE IF NOT EXISTS weekly_study_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    total_minutes INTEGER DEFAULT 0,
    topics_studied INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    avg_quiz_score DECIMAL(5,2),
    subjects TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_topic_progress_user ON topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_subject ON topic_progress(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_study_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_quizzes_topic ON topic_quizzes(topic_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_study_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_study_stats ENABLE ROW LEVEL SECURITY;

-- Policies for topic_progress
CREATE POLICY "Users can view own topic progress" ON topic_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topic progress" ON topic_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topic progress" ON topic_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for study_sessions
CREATE POLICY "Users can view own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for daily_study_stats
CREATE POLICY "Users can view own daily stats" ON daily_study_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats" ON daily_study_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats" ON daily_study_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_stats
CREATE POLICY "Users can view own user stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for topic_quizzes (public read for all authenticated users)
CREATE POLICY "Authenticated users can view quizzes" ON topic_quizzes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for weekly_study_stats
CREATE POLICY "Users can view own weekly stats" ON weekly_study_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly stats" ON weekly_study_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly stats" ON weekly_study_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_topic_progress_updated_at
    BEFORE UPDATE ON topic_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_study_stats_updated_at
    BEFORE UPDATE ON daily_study_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_study_stats_updated_at
    BEFORE UPDATE ON weekly_study_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE QUIZ QUESTIONS
-- ============================================

-- Chemistry - Acids and Bases
INSERT INTO topic_quizzes (topic_id, subject, topic, question, option_a, option_b, option_c, option_d, correct_ans, explanation, difficulty) VALUES
('chemistry-acids-bases', 'Chemistry', 'Acids and Bases', 'What is the pH of a neutral solution?', '0', '7', '14', '1', 'B', 'A neutral solution has a pH of 7, which is neither acidic nor basic.', 'easy'),
('chemistry-acids-bases', 'Chemistry', 'Acids and Bases', 'Which of the following is a strong acid?', 'Acetic acid', 'Hydrochloric acid', 'Carbonic acid', 'Citric acid', 'B', 'Hydrochloric acid (HCl) is a strong acid that completely dissociates in water.', 'easy'),
('chemistry-acids-bases', 'Chemistry', 'Acids and Bases', 'What ion is responsible for acidic properties?', 'OH⁻', 'H⁺', 'O²⁻', 'Na⁺', 'B', 'Hydrogen ions (H⁺) are responsible for acidic properties in solutions.', 'medium'),
('chemistry-acids-bases', 'Chemistry', 'Acids and Bases', 'What is the product of a neutralization reaction?', 'Salt and water', 'Acid and base', 'Hydrogen and oxygen', 'Metal and non-metal', 'A', 'Neutralization produces salt and water when an acid reacts with a base.', 'medium'),
('chemistry-acids-bases', 'Chemistry', 'Acids and Bases', 'Which indicator turns red in acidic solution?', 'Phenolphthalein', 'Litmus', 'Methyl orange', 'Both B and C', 'D', 'Both litmus and methyl orange turn red in acidic solutions.', 'hard');

-- Chemistry - Atomic Structure
INSERT INTO topic_quizzes (topic_id, subject, topic, question, option_a, option_b, option_c, option_d, correct_ans, explanation, difficulty) VALUES
('chemistry-atomic-structure', 'Chemistry', 'Atomic Structure', 'What is the mass number of an atom?', 'Number of protons', 'Number of neutrons', 'Protons + neutrons', 'Protons + electrons', 'C', 'Mass number = protons + neutrons in the nucleus.', 'easy'),
('chemistry-atomic-structure', 'Chemistry', 'Atomic Structure', 'Which subatomic particle has a negative charge?', 'Proton', 'Neutron', 'Electron', 'Nucleus', 'C', 'Electrons have a negative charge and orbit the nucleus.', 'easy'),
('chemistry-atomic-structure', 'Chemistry', 'Atomic Structure', 'What determines the chemical properties of an element?', 'Mass number', 'Atomic number', 'Neutron count', 'Nucleus size', 'B', 'The atomic number (number of protons/electrons) determines chemical properties.', 'medium'),
('chemistry-atomic-structure', 'Chemistry', 'Atomic Structure', 'Isotopes differ in their number of:', 'Protons', 'Electrons', 'Neutrons', 'Energy levels', 'C', 'Isotopes have the same number of protons but different numbers of neutrons.', 'medium'),
('chemistry-atomic-structure', 'Chemistry', 'Atomic Structure', 'The maximum number of electrons in the first energy level is:', '2', '8', '18', '32', 'A', 'The first energy level can hold a maximum of 2 electrons (2n² formula).', 'hard');

-- Biology - Cell Structure
INSERT INTO topic_quizzes (topic_id, subject, topic, question, option_a, option_b, option_c, option_d, correct_ans, explanation, difficulty) VALUES
('biology-cell-structure', 'Biology', 'Cell Structure', 'Which organelle is the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body', 'B', 'Mitochondria produce ATP through cellular respiration.', 'easy'),
('biology-cell-structure', 'Biology', 'Cell Structure', 'The cell membrane is mainly composed of:', 'Proteins only', 'Carbohydrates', 'Phospholipids', 'Nucleic acids', 'C', 'The cell membrane is a phospholipid bilayer with embedded proteins.', 'medium'),
('biology-cell-structure', 'Biology', 'Cell Structure', 'Which organelle contains genetic material?', 'Ribosome', 'Mitochondria', 'Nucleus', 'Vacuole', 'C', 'The nucleus contains DNA, the genetic material of the cell.', 'easy'),
('biology-cell-structure', 'Biology', 'Cell Structure', 'Plant cells have which structure that animal cells lack?', 'Nucleus', 'Cell wall', 'Mitochondria', 'Ribosome', 'B', 'Plant cells have a cell wall made of cellulose.', 'medium'),
('biology-cell-structure', 'Biology', 'Cell Structure', 'Chloroplasts are responsible for:', 'Respiration', 'Photosynthesis', 'Digestion', 'Reproduction', 'B', 'Chloroplasts contain chlorophyll and carry out photosynthesis.', 'easy');

-- Physics - Newton's Laws
INSERT INTO topic_quizzes (topic_id, subject, topic, question, option_a, option_b, option_c, option_d, correct_ans, explanation, difficulty) VALUES
('physics-newtons-laws', 'Physics', 'Newton''s Laws', 'Newton''s First Law describes:', 'F = ma', 'Action-reaction', 'Inertia', 'Gravity', 'C', 'Newton''s First Law is the law of inertia - objects resist changes in motion.', 'easy'),
('physics-newtons-laws', 'Physics', 'Newton''s Laws', 'What is the unit of force?', 'Kilogram', 'Newton', 'Joule', 'Watt', 'B', 'Force is measured in Newtons (N) = kg·m/s²', 'easy'),
('physics-newtons-laws', 'Physics', 'Newton''s Laws', 'According to Newton''s Third Law:', 'F = ma', 'Every action has an equal and opposite reaction', 'Objects in motion stay in motion', 'Energy is conserved', 'B', 'Newton''s Third Law states that forces come in action-reaction pairs.', 'medium'),
('physics-newtons-laws', 'Physics', 'Newton''s Laws', 'If mass doubles and force stays constant, acceleration:', 'Doubles', 'Halves', 'Stays same', 'Quadruples', 'B', 'From F = ma, if mass doubles, acceleration halves.', 'hard'),
('physics-newtons-laws', 'Physics', 'Newton''s Laws', 'Which is NOT a force?', 'Gravity', 'Friction', 'Mass', 'Tension', 'C', 'Mass is a measure of matter, not a force. The others are forces.', 'medium');

-- Mathematics - Quadratic Equations
INSERT INTO topic_quizzes (topic_id, subject, topic, question, option_a, option_b, option_c, option_d, correct_ans, explanation, difficulty) VALUES
('math-quadratic-equations', 'Mathematics', 'Quadratic Equations', 'The general form of a quadratic equation is:', 'ax + b = 0', 'ax² + bx + c = 0', 'y = mx + c', 'a² + b² = c²', 'B', 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0.', 'easy'),
('math-quadratic-equations', 'Mathematics', 'Quadratic Equations', 'The quadratic formula gives solutions for:', 'Linear equations', 'Quadratic equations', 'Simultaneous equations', 'Inequalities', 'B', 'x = (-b ± √(b²-4ac)) / 2a solves quadratic equations.', 'easy'),
('math-quadratic-equations', 'Mathematics', 'Quadratic Equations', 'The discriminant is:', 'b² - 4ac', 'b² + 4ac', '-b/2a', '√(b²-4ac)', 'A', 'The discriminant Δ = b² - 4ac determines the nature of roots.', 'medium'),
('math-quadratic-equations', 'Mathematics', 'Quadratic Equations', 'If discriminant > 0, the roots are:', 'Real and equal', 'Real and different', 'Imaginary', 'No roots', 'B', 'When Δ > 0, there are two distinct real roots.', 'hard'),
('math-quadratic-equations', 'Mathematics', 'Quadratic Equations', 'What method uses factoring perfect squares?', 'Factorization', 'Completing the square', 'Formula method', 'Graphical method', 'B', 'Completing the square rewrites the quadratic as a perfect square.', 'medium');

-- ============================================
-- VIEWS FOR STATISTICS
-- ============================================

-- View for subject performance summary
CREATE OR REPLACE VIEW subject_performance AS
SELECT
    user_id,
    subject,
    COUNT(*) as total_topics,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_topics,
    SUM(time_spent_min) as total_time_min,
    AVG(quiz_score) as avg_quiz_score,
    MAX(quiz_best_score) as best_quiz_score,
    SUM(quiz_attempts) as total_quiz_attempts
FROM topic_progress
GROUP BY user_id, subject;

-- View for recent activity
CREATE OR REPLACE VIEW recent_study_activity AS
SELECT
    user_id,
    date,
    total_minutes,
    topics_studied,
    quizzes_taken,
    avg_quiz_score
FROM daily_study_stats
ORDER BY date DESC;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON topic_progress TO authenticated;
GRANT ALL ON study_sessions TO authenticated;
GRANT ALL ON daily_study_stats TO authenticated;
GRANT ALL ON user_stats TO authenticated;
GRANT SELECT ON topic_quizzes TO authenticated;
GRANT ALL ON weekly_study_stats TO authenticated;

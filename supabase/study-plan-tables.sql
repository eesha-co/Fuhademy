-- ============================================
-- STUDY PLAN TABLES FOR SUPABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- First, create the update_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. STUDY_PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    exam_type VARCHAR(20) NOT NULL,
    subjects JSONB NOT NULL,
    months_to_exam INTEGER NOT NULL,
    learner_type VARCHAR(20) NOT NULL,
    daily_hours INTEGER NOT NULL,
    exam_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    total_topics INTEGER DEFAULT 0,
    completed_topics INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add foreign key constraint separately (in case auth.users isn't accessible during table creation)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'study_plans_user_id_fkey' 
        AND table_name = 'study_plans'
    ) THEN
        ALTER TABLE public.study_plans 
        ADD CONSTRAINT study_plans_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON public.study_plans(status);

-- Enable RLS
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can insert own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can update own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can delete own study plans" ON public.study_plans;

-- Create policies
CREATE POLICY "Users can view own study plans" ON public.study_plans
    FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert own study plans" ON public.study_plans
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update own study plans" ON public.study_plans
    FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own study plans" ON public.study_plans
    FOR DELETE USING (auth.uid()::uuid = user_id);

-- Grant permissions
GRANT ALL ON public.study_plans TO authenticated;


-- ============================================
-- 2. STUDY_PLAN_DAYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_plan_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, day_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_plan_days_plan_id ON public.study_plan_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_days_date ON public.study_plan_days(date);
CREATE INDEX IF NOT EXISTS idx_study_plan_days_status ON public.study_plan_days(status);

-- Enable RLS
ALTER TABLE public.study_plan_days ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own plan days" ON public.study_plan_days;
DROP POLICY IF EXISTS "Users can insert own plan days" ON public.study_plan_days;
DROP POLICY IF EXISTS "Users can update own plan days" ON public.study_plan_days;

-- Create policies
CREATE POLICY "Users can view own plan days" ON public.study_plan_days
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.study_plans 
            WHERE study_plans.id = study_plan_days.plan_id 
            AND study_plans.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert own plan days" ON public.study_plan_days
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.study_plans 
            WHERE study_plans.id = study_plan_days.plan_id 
            AND study_plans.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can update own plan days" ON public.study_plan_days
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.study_plans 
            WHERE study_plans.id = study_plan_days.plan_id 
            AND study_plans.user_id = auth.uid()::uuid
        )
    );

-- Grant permissions
GRANT ALL ON public.study_plan_days TO authenticated;


-- ============================================
-- 3. STUDY_PLAN_TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_plan_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_id UUID NOT NULL REFERENCES public.study_plan_days(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    topic_id VARCHAR(255),
    description TEXT,
    prerequisites JSONB,
    order_index INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 30,
    task_type VARCHAR(50) DEFAULT 'study',
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_plan_tasks_day_id ON public.study_plan_tasks(day_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_tasks_subject ON public.study_plan_tasks(subject);
CREATE INDEX IF NOT EXISTS idx_study_plan_tasks_status ON public.study_plan_tasks(status);

-- Enable RLS
ALTER TABLE public.study_plan_tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.study_plan_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.study_plan_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.study_plan_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.study_plan_tasks;

-- Create policies
CREATE POLICY "Users can view own tasks" ON public.study_plan_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.study_plan_days spd
            JOIN public.study_plans sp ON sp.id = spd.plan_id
            WHERE spd.id = study_plan_tasks.day_id 
            AND sp.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert own tasks" ON public.study_plan_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.study_plan_days spd
            JOIN public.study_plans sp ON sp.id = spd.plan_id
            WHERE spd.id = study_plan_tasks.day_id 
            AND sp.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can update own tasks" ON public.study_plan_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.study_plan_days spd
            JOIN public.study_plans sp ON sp.id = spd.plan_id
            WHERE spd.id = study_plan_tasks.day_id 
            AND sp.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can delete own tasks" ON public.study_plan_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.study_plan_days spd
            JOIN public.study_plans sp ON sp.id = spd.plan_id
            WHERE spd.id = study_plan_tasks.day_id 
            AND sp.user_id = auth.uid()::uuid
        )
    );

-- Grant permissions
GRANT ALL ON public.study_plan_tasks TO authenticated;


-- ============================================
-- 4. TOPIC_PREREQUISITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.topic_prerequisites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    topic_id VARCHAR(255),
    prerequisite_subject VARCHAR(100) NOT NULL,
    prerequisite_topic VARCHAR(255) NOT NULL,
    prerequisite_topic_id VARCHAR(255),
    strength INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subject, topic, prerequisite_subject, prerequisite_topic)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topic_prerequisites_subject ON public.topic_prerequisites(subject);
CREATE INDEX IF NOT EXISTS idx_topic_prerequisites_topic ON public.topic_prerequisites(topic);

-- Grant read access
GRANT SELECT ON public.topic_prerequisites TO authenticated;
GRANT SELECT ON public.topic_prerequisites TO anon;


-- ============================================
-- INSERT PREREQUISITE DATA
-- ============================================
INSERT INTO public.topic_prerequisites (subject, topic, prerequisite_subject, prerequisite_topic, strength) VALUES
-- Physics prerequisites
('Physics', 'Equations of Motion', 'Mathematics', 'Algebraic Foundations', 3),
('Physics', 'Equations of Motion', 'Mathematics', 'Linear Equations', 2),
('Physics', 'Projectile Motion', 'Mathematics', 'Quadratic Equations', 3),
('Physics', 'Projectile Motion', 'Physics', 'Equations of Motion', 3),
('Physics', 'Dimensions', 'Mathematics', 'Indices', 3),
('Physics', 'Dimensions', 'Mathematics', 'Algebraic Foundations', 2),
('Physics', 'Work, Energy and Power', 'Mathematics', 'Algebraic Foundations', 2),
('Physics', 'Momentum', 'Mathematics', 'Algebraic Foundations', 2),
('Physics', 'Circular Motion', 'Mathematics', 'Trigonometry', 3),
('Physics', 'Simple Harmonic Motion', 'Mathematics', 'Trigonometry', 2),
('Physics', 'Waves', 'Mathematics', 'Trigonometry', 2),
('Physics', 'Electricity', 'Mathematics', 'Algebraic Foundations', 2),
('Physics', 'Electromagnetism', 'Physics', 'Electricity', 3),
('Physics', 'Electromagnetism', 'Mathematics', 'Algebraic Foundations', 2),
-- Chemistry prerequisites
('Chemistry', 'Atomic Structure', 'Physics', 'Atomic Structure', 2),
('Chemistry', 'Periodic Table', 'Chemistry', 'Atomic Structure', 3),
('Chemistry', 'Chemical Bonding', 'Chemistry', 'Atomic Structure', 3),
('Chemistry', 'Chemical Bonding', 'Chemistry', 'Periodic Table', 2),
('Chemistry', 'Chemical Equations', 'Mathematics', 'Algebraic Foundations', 2),
('Chemistry', 'Stoichiometry', 'Mathematics', 'Algebraic Foundations', 3),
('Chemistry', 'Stoichiometry', 'Chemistry', 'Chemical Equations', 3),
('Chemistry', 'Gas Laws', 'Mathematics', 'Algebraic Foundations', 2),
('Chemistry', 'Gas Laws', 'Physics', 'Thermodynamics', 2),
('Chemistry', 'Electrochemistry', 'Chemistry', 'Atomic Structure', 2),
('Chemistry', 'Electrochemistry', 'Physics', 'Electricity', 2),
('Chemistry', 'Organic Chemistry', 'Chemistry', 'Atomic Structure', 2),
('Chemistry', 'Organic Chemistry', 'Chemistry', 'Chemical Bonding', 3),
-- Biology prerequisites
('Biology', 'Cell Division', 'Biology', 'Cell Structure', 3),
('Biology', 'Genetics', 'Biology', 'Cell Division', 3),
('Biology', 'Genetics', 'Mathematics', 'Probability', 2),
('Biology', 'Evolution', 'Biology', 'Genetics', 3),
('Biology', 'Ecology', 'Biology', 'Ecosystems', 2),
('Biology', 'Physiology', 'Chemistry', 'Atomic Structure', 2),
-- Mathematics prerequisites
('Mathematics', 'Quadratic Equations', 'Mathematics', 'Algebraic Foundations', 3),
('Mathematics', 'Quadratic Equations', 'Mathematics', 'Factorization', 2),
('Mathematics', 'Trigonometry', 'Mathematics', 'Algebraic Foundations', 2),
('Mathematics', 'Trigonometry', 'Mathematics', 'Geometry Basics', 2),
('Mathematics', 'Calculus', 'Mathematics', 'Algebraic Foundations', 3),
('Mathematics', 'Calculus', 'Mathematics', 'Trigonometry', 2),
('Mathematics', 'Calculus', 'Mathematics', 'Functions', 3),
('Mathematics', 'Statistics', 'Mathematics', 'Probability', 2),
('Mathematics', 'Probability', 'Mathematics', 'Fractions and Decimals', 2),
-- Economics prerequisites
('Economics', 'Demand and Supply', 'Mathematics', 'Algebraic Foundations', 2),
('Economics', 'Market Structures', 'Economics', 'Demand and Supply', 3),
('Economics', 'National Income', 'Mathematics', 'Algebraic Foundations', 2),
('Economics', 'International Trade', 'Economics', 'Market Structures', 2),
-- Government prerequisites
('Government', 'Constitution', 'Government', 'Basic Concepts', 2),
('Government', 'Arms of Government', 'Government', 'Constitution', 3),
('Government', 'Political Parties', 'Government', 'Arms of Government', 2),
-- English prerequisites
('English', 'Essay Writing', 'English', 'Sentence Structure', 3),
('English', 'Essay Writing', 'English', 'Paragraph Development', 2),
('English', 'Comprehension', 'English', 'Vocabulary', 2),
('English', 'Summary Writing', 'English', 'Comprehension', 3)
ON CONFLICT (subject, topic, prerequisite_subject, prerequisite_topic) DO NOTHING;


-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON public.study_plans;
CREATE TRIGGER update_study_plans_updated_at
    BEFORE UPDATE ON public.study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- DONE! Tables created successfully
-- ============================================

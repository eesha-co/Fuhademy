-- ============================================
-- JUANOVA CORTEX - USER GOALS TABLE SETUP
-- Run this script in Supabase SQL Editor
-- This version handles existing policies
-- ============================================

-- 1. Create the user_goals table (if not exists)
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

-- 2. Create index for faster queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON public.user_goals(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Users can view own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.user_goals;

-- 5. Create RLS policies
CREATE POLICY "Users can view own goals" ON public.user_goals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Create a trigger to update the updated_at timestamp (drop if exists)
DROP TRIGGER IF EXISTS update_user_goals_updated_at ON public.user_goals;
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON public.user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Create subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Insert default subjects if table is empty
INSERT INTO public.subjects (name, icon, color) VALUES
    ('Mathematics', '📐', 'blue'),
    ('English', '📚', 'indigo'),
    ('Physics', '⚛️', 'green'),
    ('Chemistry', '🧪', 'yellow'),
    ('Biology', '🧬', 'purple'),
    ('Geography', '🌍', 'cyan'),
    ('History', '🏛️', 'pink'),
    ('Economics', '💰', 'lime'),
    ('Computer Science', '💻', 'orange'),
    ('Literature', '📖', 'rose'),
    ('Government', '🏛️', 'red'),
    ('Commerce', '📊', 'teal'),
    ('Accounting', '📈', 'emerald')
ON CONFLICT (name) DO NOTHING;

-- 9. Grant permissions
GRANT ALL ON public.user_goals TO authenticated;
GRANT ALL ON public.subjects TO authenticated;
GRANT SELECT ON public.subjects TO anon;

-- ============================================
-- DONE! Your user_goals table is ready.
-- ============================================

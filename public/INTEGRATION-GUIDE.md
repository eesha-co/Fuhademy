# 🎯 Goals Integration Guide for Your Dashboard

## 📁 Files to Copy to Your Project

Copy these files to your Netlify project:

```
your-project/
├── js/
│   ├── goals-manager.js              ← Copy this
│   ├── goals-modal.js                ← Copy this
│   └── goals-dashboard-integration.js ← Copy this
│
└── pages/
    └── student-dashboard.html        ← Add script tags here
```

---

## ✏️ Changes to Your student-dashboard.html

### Step 1: Add Script Tags

Add these lines **after** your existing scripts (before the closing `</body>` tag):

```html
<!-- Goals System Scripts -->
<script src="../js/goals-manager.js"></script>
<script src="../js/goals-modal.js"></script>
<script src="../js/goals-dashboard-integration.js"></script>
```

**Where to add:**
```html
<!-- ... your existing code ... -->

<script src="../js/supabase-bootstrap.js"></script>
<script type="module" src="./js/dashboard-main.js"></script>
<script type="module" src="../js/user-cache.js"></script>
<script type="module" src="./js/sidebar-fragment.js"></script>

<!-- 👇 ADD THESE LINES HERE -->
<script src="../js/goals-manager.js"></script>
<script src="../js/goals-modal.js"></script>
<script src="../js/goals-dashboard-integration.js"></script>

</body>
</html>
```

---

### Step 2: Add Modal CSS (Optional but Recommended)

Add these styles to your `<style>` section or CSS file:

```css
/* Goals Modal Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

/* Range Slider Custom Styles */
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);
    transition: transform 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
}

/* Custom Scrollbar for Modal */
#goalsModal ::-webkit-scrollbar {
    width: 6px;
}

#goalsModal ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

#goalsModal ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

#goalsModal ::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
```

---

## 🗄️ Supabase SQL Setup

Run this in your Supabase SQL Editor:

```sql
-- ============================================
-- USER GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    goal_type TEXT CHECK (goal_type IN ('score_target', 'study_hours', 'quiz_count', 'streak_days', 'subject_mastery')) NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit TEXT DEFAULT '%',
    deadline DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'failed', 'paused')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own goals
CREATE POLICY "Users can view own goals"
    ON user_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
    ON user_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
    ON user_goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
    ON user_goals FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SUBJECTS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#0ea5e9',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO subjects (name, category, icon, color) VALUES
('Mathematics', 'Science', '📐', '#ef4444'),
('English', 'Language', '📚', '#3b82f6'),
('Physics', 'Science', '⚛️', '#10b981'),
('Chemistry', 'Science', '🧪', '#f59e0b'),
('Biology', 'Science', '🧬', '#8b5cf6'),
('Geography', 'Social Studies', '🌍', '#06b6d4'),
('History', 'Social Studies', '🏛️', '#ec4899'),
('Economics', 'Social Studies', '💰', '#84cc16'),
('Computer Science', 'Technology', '💻', '#f97316'),
('Literature', 'Language', '📖', '#6366f1')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

---

## 🎨 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT DASHBOARD                           │
│                                                                 │
│   Page Loads                                                    │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────┐                      │
│   │ goals-dashboard-integration.js      │                      │
│   │ (auto-initializes)                  │                      │
│   └─────────────────┬───────────────────┘                      │
│                     │                                           │
│                     ▼                                           │
│   ┌─────────────────────────────────────┐                      │
│   │ Insert Goals Section after Hero     │                      │
│   └─────────────────┬───────────────────┘                      │
│                     │                                           │
│                     ▼                                           │
│   ┌─────────────────────────────────────┐                      │
│   │ Check Supabase for user goals       │                      │
│   └─────────────────┬───────────────────┘                      │
│                     │                                           │
│           ┌─────────┴─────────┐                                 │
│           │                   │                                 │
│       Has Goals           No Goals                             │
│           │                   │                                 │
│           ▼                   ▼                                 │
│   ┌───────────────┐   ┌───────────────────┐                   │
│   │ Show Goals    │   │ Show "Set Goals"  │                   │
│   │ Cards         │   │ Empty State       │                   │
│   └───────────────┘   └─────────┬─────────┘                   │
│                                 │                               │
│                                 ▼                               │
│                     ┌───────────────────┐                      │
│                     │ After 1.5 seconds │                      │
│                     │ Show Modal        │                      │
│                     └───────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

After setup, verify:

- [ ] Goals section appears on dashboard
- [ ] Modal shows for first-time users (no existing goals)
- [ ] Modal shows for users who already have goals (when clicking "Edit Goals")
- [ ] Goals are saved to Supabase after completing modal
- [ ] Goals display correctly on dashboard after creation
- [ ] Progress bars show correct percentages
- [ ] "Edit Goals" button opens modal

---

## 🔧 Configuration Options

You can customize the integration by setting these before the script loads:

```html
<script>
// Configure before loading
window.GoalsDashboardConfig = {
    // Where to insert goals section: 'after-hero', 'before-subjects', 'after-subjects'
    insertPosition: 'after-hero',
    
    // Auto-show modal for first-time users
    autoCheckOnLoad: true,
    
    // Delay before showing modal (milliseconds)
    modalDelay: 1500
};
</script>
<script src="../js/goals-dashboard-integration.js"></script>
```

---

## 🐛 Troubleshooting

### Modal doesn't appear
- Check browser console for errors
- Ensure all 3 JS files are loaded
- Verify Supabase connection is working

### Goals not saving
- Check Supabase SQL was run successfully
- Verify user is authenticated
- Check browser console for error messages

### Goals section not appearing
- Check the `insertPosition` config
- Verify your dashboard has a `<main>` or `#main-content` element

### "Table not found" error
- Run the SQL script in Supabase SQL Editor
- Check RLS policies are enabled

---

## 📞 Need Help?

If you encounter issues, check the browser console (F12 → Console) for error messages. The most common issues are:

1. **Supabase not initialized** - Ensure `supabase-bootstrap.js` loads before goals scripts
2. **Table doesn't exist** - Run the SQL setup script
3. **Permission denied** - Check RLS policies are correct

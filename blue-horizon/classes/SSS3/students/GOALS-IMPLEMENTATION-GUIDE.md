# 🎯 User Goals Onboarding System - Implementation Guide

## 📁 Files Created

```
public/
├── js/
│   ├── goals-manager.js     ← Database operations (CRUD)
│   └── goals-modal.js       ← Modal UI & interactions
│
├── components/
│   └── (modal is injected via JS)
│
└── student-dashboard.html   ← Example integration
```

---

## 🔧 Setup Instructions

### Step 1: Update Supabase Credentials

In `student-dashboard.html`, find and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

With your actual credentials from Supabase Dashboard > Settings > API.

### Step 2: Run SQL in Supabase

Execute the SQL script I provided earlier in Supabase SQL Editor to create:
- `user_goals` table
- `subjects` table
- All RLS policies

### Step 3: Add to Your Existing Dashboard

Include these scripts in your existing `student-dashboard.html`:

```html
<!-- After your existing Supabase setup -->
<script src="js/goals-manager.js"></script>
<script src="js/goals-modal.js"></script>

<!-- Add this initialization code -->
<script>
    // Check for goals on page load
    document.addEventListener('DOMContentLoaded', () => {
        // ... your existing code ...
        
        // Add goals check (runs automatically)
        GoalsModal.checkGoals();
    });
</script>
```

---

## 🎨 Modal Flow

```
User Signs Up/Logs In
        │
        ▼
Check user_goals table
        │
        ├── Has Goals? ──→ Show Dashboard
        │
        └── No Goals? ──→ Show Modal
                              │
                              ▼
                    Step 1: Main Goal
                    (Improve grades, Exam prep, etc.)
                              │
                              ▼
                    Step 2: Target Score
                    (Slider: 50-100%)
                              │
                              ▼
                    Step 3: Focus Subjects
                    (Select multiple)
                              │
                              ▼
                    Step 4: Study Schedule
                    (Hours/week + time preference)
                              │
                              ▼
                    Save to Database
                              │
                              ▼
                    Show Completion Screen
                              │
                              ▼
                    Close Modal → Dashboard
```

---

## 📊 Data Saved to Database

### Goals Created (Example):

| goal_type | title | target_value | unit |
|-----------|-------|--------------|------|
| score_target | Target Average Score | 75 | % |
| study_hours | Weekly Study Hours | 10 | hours |
| subject_mastery | Master Mathematics | 80 | % |
| subject_mastery | Master Physics | 80 | % |

---

## 🔌 API Reference

### GoalsManager Functions

```javascript
// Check if user has goals
const result = await GoalsManager.checkUserGoals();
// Returns: { hasGoals: boolean, goals: Array, firstTime: boolean }

// Create single goal
await GoalsManager.createGoal({
    goal_type: 'score_target',
    title: 'Target Score',
    target_value: 80,
    unit: '%'
});

// Create multiple goals
await GoalsManager.createMultipleGoals([
    { goal_type: 'score_target', title: '...', target_value: 75, unit: '%' },
    { goal_type: 'study_hours', title: '...', target_value: 10, unit: 'hours' }
]);

// Get all user goals
const { success, goals } = await GoalsManager.getUserGoals();

// Update goal progress
await GoalsManager.updateGoalProgress(goalId, newValue);

// Format goal for display
const formatted = GoalsManager.formatGoal(goal);
// Returns: { ...goal, progress: number, icon: string, daysRemaining: number }

// Recalculate all goal progress (call after quiz completion)
await GoalsManager.recalculateGoalProgress();
```

### GoalsModal Functions

```javascript
// Open modal manually
GoalsModal.open();

// Close modal
GoalsModal.close();

// Check goals and show modal if needed
GoalsModal.checkGoals();

// Access current state
console.log(GoalsModal.state.selections);
```

---

## 🎯 Integration Points

### 1. After User Signs Up

```javascript
// In your signup success handler
supabase.auth.signUp({ email, password }).then(({ data, error }) => {
    if (!error) {
        // Redirect to dashboard
        window.location.href = '/student-dashboard.html';
        // Modal will auto-show on first visit
    }
});
```

### 2. After User Logs In

```javascript
// In your login success handler
supabase.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
    if (!error) {
        window.location.href = '/student-dashboard.html';
        // GoalsModal.checkGoals() runs automatically
    }
});
```

### 3. After Quiz Completion

```javascript
// After saving quiz result, update goals
await supabase.from('quiz_results').insert(quizData);

// Recalculate goal progress
await GoalsManager.recalculateGoalProgress();
```

---

## 🎨 Customization Options

### Change Modal Colors

In `goals-modal.js`, find and modify:

```javascript
// Change primary color (currently emerald/teal)
from-emerald-500 to-teal-600

// To use different colors:
from-blue-500 to-purple-600
from-rose-500 to-pink-600
from-amber-500 to-orange-600
```

### Add Custom Goal Types

In `goals-manager.js`:

```javascript
goalTypes: {
    score_target: { icon: '📊', label: 'Score Target', unit: '%' },
    study_hours: { icon: '⏰', label: 'Study Hours', unit: 'hours' },
    // Add your custom type:
    custom_goal: { icon: '🎯', label: 'Custom Goal', unit: 'points' }
}
```

### Change Subjects List

Edit `getStep3HTML()` in `goals-modal.js` to show your subjects.

---

## 📱 Responsive Design

The modal and dashboard are fully responsive:

- **Desktop**: Full 4-column goal cards, side-by-side layout
- **Tablet**: 2-column cards, stacked sections
- **Mobile**: Single column, touch-friendly buttons

---

## 🔒 Security Features

✅ Row Level Security (RLS) enabled on all tables
✅ Users can only access their own data
✅ Auth validation before every operation
✅ No sensitive data exposed to client

---

## 🧪 Testing Checklist

- [ ] User without goals sees modal on first login
- [ ] User with existing goals doesn't see modal
- [ ] Can navigate forward/backward in modal
- [ ] Can skip modal and create goals later
- [ ] Goals are saved to database correctly
- [ ] Goal progress updates after quiz completion
- [ ] Modal closes properly on completion
- [ ] Goals display correctly on dashboard
- [ ] Edit button reopens modal

---

## 📞 Need Help?

If you encounter issues:

1. **Check browser console** for errors
2. **Verify Supabase credentials** are correct
3. **Confirm tables exist** in Supabase dashboard
4. **Check RLS policies** are enabled
5. **Test authentication** is working

---

## 🚀 Next Steps

1. **Integrate with your CBT** - Save quiz results to database
2. **Build Learning Report Page** - Display detailed analytics
3. **Add Study Session Tracking** - Log time spent studying
4. **Implement Achievements** - Award badges for milestones

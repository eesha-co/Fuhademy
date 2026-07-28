# JAMB CBT Simulator - Juanova Cortex

## 📁 Folder Structure

```
cbt/
├── cbt.html                    ← Main CBT file (open this)
├── images (2).png              ← JAMB logo (copy from original location)
└── js/
    ├── cbt-results-saver.js    ← Saves results to Supabase
    ├── questions.js            ← Main questions loader
    ├── maths-questions.js      ← Math questions
    ├── english-questions.js    ← English questions
    ├── physics-questions.js    ← Physics questions
    ├── chemistry-questions.js  ← Chemistry questions
    ├── biology-questions.js    ← Biology questions
    └── economics-questions.js  ← Economics questions
```

## 🚀 Setup

### Step 1: Copy Question Files
Copy your existing question files to `cbt/js/`:
- `questions.js`
- `maths-questions.js`
- `english-questions.js`
- `physics-questions.js`
- `chem-questions.js`
- `biology-questions.js`
- `economics-questions.js`

### Step 2: Copy Logo
Copy `images (2).png` to the `cbt/` folder

### Step 3: Access the CBT
Open `cbt.html` in your browser or navigate to:
```
https://juanovacortex.netlify.app/cbt/cbt.html
```

## 💾 What Gets Saved to Database

When a user completes a test, the following is saved to Supabase:

### 1. `quiz_results` Table
| Field | Description |
|-------|-------------|
| quiz_name | "JAMB CBT Practice" or "JAMB CBT Full Exam" |
| subject | Comma-separated list of subjects |
| score | Number of correct answers |
| total_questions | Total questions in test |
| time_taken | Time spent in seconds |
| passed | true if score >= 50% |

### 2. `question_responses` Table
Every individual answer is saved for detailed analysis:
- Question text
- User's answer
- Correct answer
- Whether correct or not
- Subject/topic

### 3. `user_progress` Table
Updated for each subject:
- Total quizzes taken
- Average score per subject
- Best/worst scores

### 4. `user_stats` Table
Overall statistics:
- Total quizzes taken
- Overall average
- Study time
- Streak days

### 5. `study_sessions` Table
Study time tracking:
- Duration
- Subjects studied
- Date/time

## ⚠️ Important Notes

### If User is Not Logged In
- Results are saved to `localStorage` temporarily
- When user logs in, results are synced automatically

### Authentication Required
The CBT uses the same Supabase authentication as the main site. Make sure users are logged in through the main dashboard first.

## 🔧 Troubleshooting

### "jambQuestions is not defined"
- Make sure `questions.js` is in the `cbt/js/` folder
- Check that `questions.js` defines `jambQuestions` variable

### Results not saving
- Check browser console for errors
- Verify user is logged in
- Check Supabase tables exist (run the SQL)

### Questions not loading
- Ensure all question files are in `cbt/js/`
- Check file paths in `cbt.html` match your file names

## 📊 Testing the Integration

1. Log in through the main dashboard
2. Navigate to `/cbt/cbt.html`
3. Complete a quick practice test
4. Check Supabase `quiz_results` table for new entry
5. Go to Learning Report page to see your results

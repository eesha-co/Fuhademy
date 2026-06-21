const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// multer for handling multipart/form-data (file uploads)
let multer;
try { multer = require('multer'); } catch (e) { console.warn('multer not installed; upload endpoints will fail until multer is added to dependencies'); }

// Import z-ai-web-dev-sdk for LLM functionality
let ZAI;
try {
  ZAI = require('z-ai-web-dev-sdk').default;
} catch (e) {
  console.warn('z-ai-web-dev-sdk not installed; AI study plan generation will use fallback');
}

// Import Supabase client for database queries
let supabaseClient = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
  console.log('Supabase config:', { url: supabaseUrl ? 'SET' : 'NOT SET', key: supabaseKey ? 'SET' : 'NOT SET' });
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized for study plan generation');
  } else {
    console.warn('Supabase credentials not found - study plan will use fallback topics');
  }
} catch (e) {
  console.warn('Supabase client not available for study plan generation:', e.message);
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir); } catch (err) { console.warn('Could not create uploads directory:', err.message); }
}

const storage = multer ? multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) { const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_'); cb(null, safe); }
}) : null;
const upload = multer ? multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }) : null;

// AI tutor endpoint
router.post('/cortex-ai/chat', async (req, res) => {
  try {
    const { message, subject, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are an expert tutor specializing in ${subject || 'all subjects'}. 
    The student's question is: "${message}"
    ${context ? `Previous context: ${context}` : ''}
    
    Provide a detailed, educational response that helps the student understand the concept thoroughly. 
    Include examples and explanations where appropriate.`;

    const geminiResponse = await getGeminiResponse(prompt);
    res.json({ response: geminiResponse });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// News API endpoint
router.get('/news', async (req, res) => {
  try {
    const news = [
      {
        title: 'Educational Technology Updates',
        description: 'Latest advancements in educational technology and their impact on learning.',
        source: 'EduTech Weekly',
        publishedAt: new Date().toLocaleDateString(),
        url: '#'
      },
      {
        title: 'Study Tips for Success',
        description: 'Expert advice on effective study techniques and time management.',
        source: 'Learning Hub',
        publishedAt: new Date().toLocaleDateString(),
        url: '#'
      }
    ];
    res.json({ news });
  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Upload endpoints: photos, videos, quizzes
// POST /api/uploads/photo - field name: file
router.post('/uploads/photo', upload ? upload.single('file') : (req,res)=>res.status(500).json({ error: 'multer not configured' }), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, url, filename: req.file.filename });
  } catch (err) { console.error('Photo upload error', err); res.status(500).json({ error: 'Upload failed' }); }
});

// POST /api/uploads/video - field name: file
router.post('/uploads/video', upload ? upload.single('file') : (req,res)=>res.status(500).json({ error: 'multer not configured' }), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, url, filename: req.file.filename });
  } catch (err) { console.error('Video upload error', err); res.status(500).json({ error: 'Upload failed' }); }
});

// POST /api/uploads/quiz - accept JSON body describing quiz or optional file
router.post('/uploads/quiz', async (req, res) => {
  try {
    // Accept either JSON quiz in body or a small file via multipart (not handled here)
    const quiz = req.body;
    if (!quiz || Object.keys(quiz).length === 0) return res.status(400).json({ error: 'Quiz payload required' });
    const id = 'quiz-' + Date.now();
    const target = path.join(uploadsDir, id + '.json');
    fs.writeFileSync(target, JSON.stringify(quiz, null, 2));
    const url = `/uploads/${id}.json`;
    res.json({ ok: true, url, id });
  } catch (err) { console.error('Quiz save error', err); res.status(500).json({ error: 'Failed to save quiz' }); }
});

// Study Plan Generation Endpoint
router.post('/study-plan/generate', async (req, res) => {
  console.log('Study plan generate request:', req.body);
  try {
    const { examType, subjects, monthsToExam, learnerType, dailyHours, planId } = req.body;
    
    if (!examType || !subjects || subjects.length === 0) {
      return res.status(400).json({ error: 'Exam type and subjects are required' });
    }

    // Generate study plan using AI or fallback
    const studyPlan = await generateStudyPlan(examType, subjects, monthsToExam, learnerType, dailyHours);
    console.log('Generated study plan with', studyPlan.days?.length || 0, 'days');
    res.json(studyPlan);
  } catch (err) {
    console.error('Study Plan Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate study plan: ' + err.message });
  }
});

// Study plan generation function - fetches from database
async function generateStudyPlan(examType, subjects, monthsToExam, learnerType, dailyHours) {
  // Calculate total days
  const totalDays = Math.max(1, monthsToExam * 30);
  
  // Try to fetch topics from database
  let allTopics = [];
  
  if (supabaseClient) {
    try {
      // Fetch topics for selected subjects
      const { data: topics, error: topicsError } = await supabaseClient
        .from('subject_topics')
        .select('*')
        .in('subject', subjects);

      if (!topicsError && topics && topics.length > 0) {
        // Fetch prerequisites
        const topicIds = topics.map(t => t.id);
        const { data: prerequisites } = await supabaseClient
          .from('topic_prerequisites')
          .select(`
            topic_id,
            prerequisite_topic_id,
            strength
          `)
          .in('topic_id', topicIds);

        // Build topic map
        const topicMap = {};
        topics.forEach(t => {
          topicMap[t.id] = {
            ...t,
            prerequisites: []
          };
        });

        // Add prerequisites
        if (prerequisites) {
          prerequisites.forEach(p => {
            if (topicMap[p.topic_id] && topicMap[p.prerequisite_topic_id]) {
              topicMap[p.topic_id].prerequisites.push({
                topic: topicMap[p.prerequisite_topic_id].topic,
                subject: topicMap[p.prerequisite_topic_id].subject,
                strength: p.strength
              });
            }
          });
        }

        allTopics = Object.values(topicMap);
        console.log(`Loaded ${allTopics.length} topics from database`);
      }
    } catch (dbError) {
      console.warn('Failed to fetch from database, using fallback:', dbError.message);
    }
  }

  // Fallback to hardcoded topics if database fetch failed
  if (allTopics.length === 0) {
    allTopics = getFallbackTopics(subjects);
  }

  // Topological sort for prerequisites
  const sortedTopics = topologicalSort(allTopics);

  // Distribute topics across days
  const tasksPerDay = Math.ceil(sortedTopics.length / totalDays);
  const days = [];

  // Adjust based on learner type and daily hours
  let adjustedTasksPerDay = tasksPerDay;
  if (learnerType === 'Slow') adjustedTasksPerDay = Math.max(1, Math.floor(tasksPerDay * 0.7));
  if (learnerType === 'Fast') adjustedTasksPerDay = Math.ceil(tasksPerDay * 1.3);
  if (dailyHours === 0) adjustedTasksPerDay = Math.ceil(adjustedTasksPerDay * 1.5);

  for (let day = 0; day < totalDays; day++) {
    const startIndex = day * adjustedTasksPerDay;
    const dayTopics = sortedTopics.slice(startIndex, startIndex + adjustedTasksPerDay);

    if (dayTopics.length === 0) continue;

    const dayTasks = dayTopics.map((t, idx) => ({
      subject: t.subject,
      topic: t.topic,
      topicId: t.id || `${t.subject.toLowerCase().replace(/\s+/g, '-')}-${t.topic.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Study ${t.topic} in ${t.subject}`,
      prerequisites: t.prerequisites || [],
      estimatedMinutes: dailyHours === 0 ? 45 : Math.round((dailyHours * 60) / adjustedTasksPerDay),
      type: idx % 4 === 1 ? 'practice' : idx % 4 === 2 ? 'quiz' : idx % 4 === 3 ? 'review' : 'study'
    }));

    days.push({
      dayNumber: day + 1,
      title: `Day ${day + 1}`,
      description: day === 0 ? 'Welcome to your personalized study journey!' : 
                   day === totalDays - 1 ? 'Final day - Review and consolidation!' :
                   `${dayTasks.length} topics scheduled`,
      tasks: dayTasks
    });
  }

  return {
    totalTopics: sortedTopics.length,
    totalDays: days.length,
    examType,
    learnerType,
    dailyHours,
    days
  };
}

// Fallback topics when database is unavailable
function getFallbackTopics(subjects) {
  const fallbackData = {
    'Mathematics': [
      { subject: 'Mathematics', topic: 'Number Bases', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Indices', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Logarithms', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Algebraic Expressions', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Linear Equations', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Quadratic Equations', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Trigonometric Ratios', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Differentiation', difficulty: 'hard', estimated_hours: 4, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Integration', difficulty: 'hard', estimated_hours: 4, prerequisites: [] },
      { subject: 'Mathematics', topic: 'Probability', difficulty: 'medium', estimated_hours: 3, prerequisites: [] }
    ],
    'English Language': [
      { subject: 'English Language', topic: 'Parts of Speech', difficulty: 'easy', estimated_hours: 3, prerequisites: [] },
      { subject: 'English Language', topic: 'Verbs and Tenses', difficulty: 'medium', estimated_hours: 4, prerequisites: [] },
      { subject: 'English Language', topic: 'Sentence Structure', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'English Language', topic: 'Essay Writing', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'English Language', topic: 'Comprehension', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'English Language', topic: 'Summary Writing', difficulty: 'medium', estimated_hours: 3, prerequisites: [] }
    ],
    'Physics': [
      { subject: 'Physics', topic: 'Fundamental Quantities', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Physics', topic: 'Scalars and Vectors', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Physics', topic: 'Equations of Motion', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Physics', topic: 'Newtons Laws', difficulty: 'medium', estimated_hours: 4, prerequisites: [] },
      { subject: 'Physics', topic: 'Energy and Power', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'Physics', topic: 'Electric Current', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Physics', topic: 'Electrical Circuits', difficulty: 'medium', estimated_hours: 3, prerequisites: [] }
    ],
    'Chemistry': [
      { subject: 'Chemistry', topic: 'Nature of Matter', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Chemistry', topic: 'Atomic Structure', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Chemistry', topic: 'Periodic Table', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'Chemistry', topic: 'Chemical Bonding', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Chemistry', topic: 'Chemical Equations', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'Chemistry', topic: 'Acids and Bases', difficulty: 'medium', estimated_hours: 3, prerequisites: [] }
    ],
    'Biology': [
      { subject: 'Biology', topic: 'Characteristics of Living Things', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { subject: 'Biology', topic: 'Cell Structure', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Biology', topic: 'Cell Division', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { subject: 'Biology', topic: 'Nutrition', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { subject: 'Biology', topic: 'Genetics', difficulty: 'hard', estimated_hours: 3, prerequisites: [] },
      { subject: 'Biology', topic: 'Ecosystems', difficulty: 'medium', estimated_hours: 3, prerequisites: [] }
    ]
  };

  const allTopics = [];
  subjects.forEach(subject => {
    const topics = fallbackData[subject] || [];
    topics.forEach(t => {
      allTopics.push({
        ...t,
        id: `${subject.toLowerCase().replace(/\s+/g, '-')}-${t.topic.toLowerCase().replace(/\s+/g, '-')}`,
        prerequisites: []
      });
    });
  });
  
  return allTopics;
}

// Topological sort for prerequisite ordering
function topologicalSort(topics) {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(topic) {
    if (visited.has(topic.topic)) return;
    if (visiting.has(topic.topic)) return; // Skip cycles

    visiting.add(topic.topic);

    // Visit prerequisites first
    topic.prerequisites.forEach(prereq => {
      const prereqTopic = topics.find(t => t.topic === prereq.topic && t.subject === prereq.subject);
      if (prereqTopic && !visited.has(prereqTopic.topic)) {
        visit(prereqTopic);
      }
    });

    visiting.delete(topic.topic);
    visited.add(topic.topic);
    sorted.push(topic);
  }

  topics.forEach(topic => visit(topic));
  return sorted;
}

// Helper function for Gemini API
async function getGeminiResponse(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get Gemini response');
  }

  return data;
}

module.exports = router;


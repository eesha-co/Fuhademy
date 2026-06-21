/**
 * Study Plan Generation API
 * Fetches topics from Supabase and uses AI to generate personalized study plans
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Import z-ai-web-dev-sdk for AI generation
let ZAI = null;
try {
  ZAI = require('z-ai-web-dev-sdk').default;
} catch (e) {
  console.warn('z-ai-web-dev-sdk not available for AI study plan generation');
}

/**
 * POST /api/study-plan/generate
 * Generates a personalized AI-powered study plan
 */
router.post('/study-plan/generate', async (req, res) => {
  try {
    const { examType, subjects, monthsToExam, learnerType, dailyHours } = req.body;
    
    if (!examType || !subjects || subjects.length === 0) {
      return res.status(400).json({ error: 'Exam type and subjects are required' });
    }

    console.log(`Generating study plan for ${examType}: ${subjects.join(', ')}`);
    
    // Fetch topics from database
    const topicsData = await fetchTopicsFromDatabase(subjects);
    
    // Generate study plan using AI or algorithm
    const studyPlan = await generateAIStudyPlan({
      examType,
      subjects,
      monthsToExam,
      learnerType,
      dailyHours,
      topicsData
    });
    
    res.json(studyPlan);
  } catch (err) {
    console.error('Study Plan Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate study plan', message: err.message });
  }
});

/**
 * Fetch topics and their prerequisites from Supabase
 */
async function fetchTopicsFromDatabase(subjects) {
  if (!supabase) {
    console.warn('Supabase not configured, using fallback topics');
    return getFallbackTopics(subjects);
  }

  try {
    // Fetch topics for selected subjects
    const { data: topics, error: topicsError } = await supabase
      .from('subject_topics')
      .select('*')
      .in('subject', subjects)
      .order('subject')
      .order('category');

    if (topicsError) throw topicsError;

    // Fetch prerequisites
    const topicIds = topics.map(t => t.id);
    const { data: prerequisites, error: prereqError } = await supabase
      .from('topic_prerequisites')
      .select(`
        topic_id,
        prerequisite_topic_id,
        strength
      `)
      .in('topic_id', topicIds);

    if (prereqError) throw prereqError;

    // Build topic map with prerequisites
    const topicMap = {};
    topics.forEach(t => {
      topicMap[t.id] = {
        ...t,
        prerequisites: []
      };
    });

    // Add prerequisites to topics
    prerequisites.forEach(p => {
      if (topicMap[p.topic_id] && topicMap[p.prerequisite_topic_id]) {
        topicMap[p.topic_id].prerequisites.push({
          topicId: p.prerequisite_topic_id,
          topic: topicMap[p.prerequisite_topic_id].topic,
          subject: topicMap[p.prerequisite_topic_id].subject,
          strength: p.strength
        });
      }
    });

    // Group by subject
    const result = {};
    subjects.forEach(subject => {
      result[subject] = topics
        .filter(t => t.subject === subject)
        .map(t => topicMap[t.id]);
    });

    return result;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return getFallbackTopics(subjects);
  }
}

/**
 * Fallback topics if database is unavailable
 */
function getFallbackTopics(subjects) {
  const allTopics = {
    'Mathematics': [
      { id: 'm1', topic: 'Number Bases', category: 'Number and Numeration', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { id: 'm2', topic: 'Indices', category: 'Number and Numeration', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
      { id: 'm3', topic: 'Logarithms', category: 'Number and Numeration', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Indices' }] },
      { id: 'm4', topic: 'Algebraic Expressions', category: 'Algebra', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { id: 'm5', topic: 'Linear Equations', category: 'Algebra', difficulty: 'easy', estimated_hours: 2, prerequisites: [{ topic: 'Algebraic Expressions' }] },
      { id: 'm6', topic: 'Quadratic Equations', category: 'Algebra', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Linear Equations' }] },
      { id: 'm7', topic: 'Trigonometric Ratios', category: 'Trigonometry', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { id: 'm8', topic: 'Differentiation', category: 'Calculus', difficulty: 'hard', estimated_hours: 4, prerequisites: [{ topic: 'Trigonometric Ratios' }] },
    ],
    'English Language': [
      { id: 'e1', topic: 'Parts of Speech', category: 'Grammar', difficulty: 'easy', estimated_hours: 3, prerequisites: [] },
      { id: 'e2', topic: 'Sentence Types', category: 'Sentence Structure', difficulty: 'easy', estimated_hours: 2, prerequisites: [{ topic: 'Parts of Speech' }] },
      { id: 'e3', topic: 'Verbs and Tenses', category: 'Grammar', difficulty: 'medium', estimated_hours: 4, prerequisites: [{ topic: 'Parts of Speech' }] },
      { id: 'e4', topic: 'Essay Structure', category: 'Writing', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Sentence Types' }] },
      { id: 'e5', topic: 'Comprehension', category: 'Comprehension', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
    ],
    'Physics': [
      { id: 'p1', topic: 'Fundamental Quantities', category: 'Fundamentals', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { id: 'p2', topic: 'Scalars and Vectors', category: 'Fundamentals', difficulty: 'medium', estimated_hours: 3, prerequisites: [] },
      { id: 'p3', topic: 'Equations of Motion', category: 'Mechanics', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Scalars and Vectors' }] },
      { id: 'p4', topic: 'Newtons Laws of Motion', category: 'Mechanics', difficulty: 'medium', estimated_hours: 4, prerequisites: [{ topic: 'Equations of Motion' }] },
      { id: 'p5', topic: 'Energy', category: 'Energy', difficulty: 'medium', estimated_hours: 2, prerequisites: [{ topic: 'Newtons Laws of Motion' }] },
      { id: 'p6', topic: 'Electric Current', category: 'Electricity', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
    ],
    'Chemistry': [
      { id: 'c1', topic: 'Nature of Matter', category: 'Introduction', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { id: 'c2', topic: 'Atomic Structure', category: 'Atomic Structure', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Nature of Matter' }] },
      { id: 'c3', topic: 'Periodic Table Overview', category: 'Periodic Table', difficulty: 'medium', estimated_hours: 2, prerequisites: [{ topic: 'Atomic Structure' }] },
      { id: 'c4', topic: 'Ionic Bonding', category: 'Chemical Bonding', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Atomic Structure' }] },
      { id: 'c5', topic: 'Chemical Equations', category: 'Chemical Reactions', difficulty: 'medium', estimated_hours: 2, prerequisites: [] },
    ],
    'Biology': [
      { id: 'b1', topic: 'Characteristics of Living Things', category: 'Introduction', difficulty: 'easy', estimated_hours: 2, prerequisites: [] },
      { id: 'b2', topic: 'Cell Structure', category: 'Cell Biology', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Characteristics of Living Things' }] },
      { id: 'b3', topic: 'Cell Division Mitosis', category: 'Cell Biology', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Cell Structure' }] },
      { id: 'b4', topic: 'Photosynthesis', category: 'Nutrition', difficulty: 'medium', estimated_hours: 3, prerequisites: [{ topic: 'Cell Structure' }] },
      { id: 'b5', topic: 'Genetics', category: 'Genetics', difficulty: 'hard', estimated_hours: 3, prerequisites: [{ topic: 'Cell Division Mitosis' }] },
    ]
  };

  const result = {};
  subjects.forEach(subject => {
    result[subject] = allTopics[subject] || [];
  });
  return result;
}

/**
 * Generate AI-powered study plan
 */
async function generateAIStudyPlan(config) {
  const { examType, subjects, monthsToExam, learnerType, dailyHours, topicsData } = config;
  
  // Calculate total study days
  const totalDays = Math.max(1, monthsToExam * 30);
  
  // Gather all topics with prerequisites resolved
  const allTopics = [];
  subjects.forEach(subject => {
    if (topicsData[subject]) {
      topicsData[subject].forEach(topic => {
        allTopics.push({
          ...topic,
          subject
        });
      });
    }
  });

  console.log(`Processing ${allTopics.length} topics across ${subjects.length} subjects`);

  // Sort topics by prerequisites (topological sort)
  const sortedTopics = topologicalSort(allTopics);

  // Adjust based on learner type
  let difficultyMultiplier = 1;
  if (learnerType === 'Slow') difficultyMultiplier = 0.7;
  if (learnerType === 'Fast') difficultyMultiplier = 1.3;

  // Calculate tasks per day
  const baseTasksPerDay = Math.ceil(sortedTopics.length / totalDays);
  let tasksPerDay = Math.max(1, Math.ceil(baseTasksPerDay * difficultyMultiplier));
  
  // Adjust for daily hours
  if (dailyHours === 0) {
    // "Always free" - more tasks per day
    tasksPerDay = Math.ceil(tasksPerDay * 1.5);
  } else if (dailyHours <= 2) {
    // Limited time - fewer tasks
    tasksPerDay = Math.max(1, Math.floor(tasksPerDay * 0.8));
  } else if (dailyHours >= 6) {
    // Lots of time - more tasks
    tasksPerDay = Math.ceil(tasksPerDay * 1.2);
  }

  // Generate AI-enhanced plan description if available
  let aiDescription = null;
  if (ZAI) {
    try {
      aiDescription = await generateAIPlanDescription(config, sortedTopics.length, totalDays);
    } catch (e) {
      console.warn('AI description generation failed:', e.message);
    }
  }

  // Build days array
  const days = [];
  let currentDay = 1;
  let topicIndex = 0;

  while (topicIndex < sortedTopics.length && currentDay <= totalDays) {
    const dayTopics = sortedTopics.slice(topicIndex, topicIndex + tasksPerDay);
    if (dayTopics.length === 0) break;

    // Calculate estimated minutes per task
    const totalHours = dayTopics.reduce((sum, t) => sum + (t.estimated_hours || 2), 0);
    const minutesPerTask = dailyHours > 0 
      ? Math.round((dailyHours * 60) / dayTopics.length)
      : Math.round((totalHours * 60) / dayTopics.length);

    const tasks = dayTopics.map((t, idx) => ({
      subject: t.subject,
      topic: t.topic,
      topicId: t.id || `${t.subject.toLowerCase()}-${t.topic.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Study ${t.topic} in ${t.subject}`,
      estimatedMinutes: Math.max(15, minutesPerTask),
      type: idx % 4 === 1 ? 'practice' : idx % 4 === 2 ? 'quiz' : idx % 4 === 3 ? 'review' : 'study',
      difficulty: t.difficulty || 'medium',
      prerequisites: t.prerequisites ? t.prerequisites.map(p => p.topic) : []
    }));

    days.push({
      dayNumber: currentDay,
      title: `Day ${currentDay}`,
      description: currentDay === 1 ? 'Welcome to your personalized study journey!' : 
                   currentDay === totalDays ? 'Final day - Review and consolidation!' :
                   `${tasks.length} topics scheduled`,
      tasks
    });

    topicIndex += tasksPerDay;
    currentDay++;
  }

  return {
    totalTopics: sortedTopics.length,
    totalDays: days.length,
    examType,
    learnerType,
    dailyHours,
    aiDescription,
    days
  };
}

/**
 * Generate AI description for the study plan
 */
async function generateAIPlanDescription(config, totalTopics, totalDays) {
  try {
    const zai = await ZAI.create();
    
    const prompt = `You are an expert study planner. Create a brief, encouraging description for a student's study plan.

Exam: ${config.examType}
Subjects: ${config.subjects.join(', ')}
Time until exam: ${config.monthsToExam} months (${totalDays} days)
Learning style: ${config.learnerType} learner
Daily study time: ${config.dailyHours === 0 ? 'Always available' : config.dailyHours + ' hours'}
Total topics to cover: ${totalTopics}

Write a short (2-3 sentences) encouraging message about this study plan.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are an encouraging study planner.' },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content || null;
  } catch (e) {
    console.error('AI generation error:', e);
    return null;
  }
}

/**
 * Topological sort to order topics by prerequisites
 */
function topologicalSort(topics) {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();
  const topicMap = {};

  // Build topic map
  topics.forEach(t => {
    topicMap[`${t.subject}:${t.topic}`] = t;
  });

  function visit(topic) {
    const key = `${topic.subject}:${topic.topic}`;
    
    if (visited.has(key)) return;
    if (visiting.has(key)) return; // Skip cycles

    visiting.add(key);

    // Visit prerequisites first
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      topic.prerequisites.forEach(prereq => {
        // Handle both object and string prerequisites
        const prereqKey = prereq.subject 
          ? `${prereq.subject}:${prereq.topic}`
          : `${topic.subject}:${prereq.topic || prereq}`;
        
        const prereqTopic = topicMap[prereqKey];
        if (prereqTopic && !visited.has(prereqKey)) {
          visit(prereqTopic);
        }
      });
    }

    visiting.delete(key);
    visited.add(key);
    sorted.push(topic);
  }

  topics.forEach(topic => visit(topic));
  return sorted;
}

/**
 * GET /api/study-plan/topics/:subject
 * Get all topics for a specific subject
 */
router.get('/study-plan/topics/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const topicsData = await fetchTopicsFromDatabase([subject]);
    res.json(topicsData[subject] || []);
  } catch (err) {
    console.error('Error fetching topics:', err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

module.exports = router;

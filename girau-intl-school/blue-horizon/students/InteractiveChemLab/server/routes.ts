import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

let questions: any[] = [];
let currentQuestionIndex = 0;

// Load questions from JSON file
async function loadQuestions() {
  try {
    const questionsPath = path.join(process.cwd(), 'server', 'questions.json');
    const data = await fs.readFile(questionsPath, 'utf-8');
    questions = JSON.parse(data);
    shuffleQuestions();
    console.log(`Loaded ${questions.length} chemistry questions`);
  } catch (error) {
    console.error('Error loading questions:', error);
    questions = [];
  }
}

// Shuffle questions array
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Calculate titration accuracy
function calculateTitrationScore(submitted: any, expected: any) {
  const scores: any = {
    titrations: 0,
    calculations: 0,
    feedback: []
  };

  // Check titration readings
  const volumes = [
    submitted.titrations.first.final - submitted.titrations.first.initial,
    submitted.titrations.second.final - submitted.titrations.second.initial,
    submitted.titrations.third.final - submitted.titrations.third.initial
  ];

  const average = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const expectedTitre = expected.averageTitre || 18.0;
  
  // Titration accuracy (40 points)
  const titreError = Math.abs(average - expectedTitre);
  if (titreError < 0.5) {
    scores.titrations = 40;
    scores.feedback.push({ correct: true, message: `Excellent titration accuracy! Average titre: ${average.toFixed(2)} cm³` });
  } else if (titreError < 1.0) {
    scores.titrations = 30;
    scores.feedback.push({ correct: true, message: `Good titration work. Average titre: ${average.toFixed(2)} cm³ (within acceptable range)` });
  } else if (titreError < 2.0) {
    scores.titrations = 20;
    scores.feedback.push({ correct: false, message: `Titration needs improvement. Average titre: ${average.toFixed(2)} cm³ (expected around ${expectedTitre.toFixed(2)} cm³)` });
  } else {
    scores.titrations = 10;
    scores.feedback.push({ correct: false, message: `Titration results are significantly off. Expected around ${expectedTitre.toFixed(2)} cm³, got ${average.toFixed(2)} cm³` });
  }

  // Check consistency of readings (10 points)
  const stdDev = Math.sqrt(volumes.map(v => Math.pow(v - average, 2)).reduce((a, b) => a + b) / volumes.length);
  if (stdDev < 0.2) {
    scores.titrations += 10;
    scores.feedback.push({ correct: true, message: 'Excellent consistency between titrations!' });
  } else if (stdDev < 0.5) {
    scores.titrations += 5;
    scores.feedback.push({ correct: true, message: 'Good consistency, slight variation between readings' });
  } else {
    scores.feedback.push({ correct: false, message: 'Titration readings show too much variation. Practice steady burette control.' });
  }

  // Check calculations (50 points total)
  if (expected.concA) {
    const concAError = Math.abs(submitted.calculations.concA - expected.concA) / expected.concA;
    if (concAError < 0.05) {
      scores.calculations += 25;
      scores.feedback.push({ correct: true, message: `Concentration of A calculated correctly: ${submitted.calculations.concA.toFixed(3)} mol dm⁻³` });
    } else if (concAError < 0.1) {
      scores.calculations += 15;
      scores.feedback.push({ correct: false, message: `Concentration of A is close but check your calculation. Expected around ${expected.concA.toFixed(3)} mol dm⁻³` });
    } else {
      scores.feedback.push({ correct: false, message: `Concentration of A is incorrect. Review your molar mass calculations.` });
    }
  }

  if (expected.concB) {
    const concBError = Math.abs(submitted.calculations.concB - expected.concB) / expected.concB;
    if (concBError < 0.05) {
      scores.calculations += 25;
      scores.feedback.push({ correct: true, message: `Concentration of B calculated correctly: ${submitted.calculations.concB.toFixed(3)} mol dm⁻³` });
    } else if (concBError < 0.1) {
      scores.calculations += 15;
      scores.feedback.push({ correct: false, message: `Concentration of B is close. Double-check your stoichiometry.` });
    } else {
      scores.feedback.push({ correct: false, message: `Concentration of B is incorrect. Review the balanced equation and mole ratio.` });
    }
  }

  return scores;
}

// Generate AI-powered feedback using Gemini
async function generateAIFeedback(data: any, basicScores: any): Promise<any> {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    console.log('GEMINI_API_KEY not found, using basic grading only');
    return {
      score: basicScores.titrations + basicScores.calculations,
      feedback: basicScores.feedback,
      improvements: [
        'Practice maintaining steady burette control for consistent readings',
        'Double-check your calculations using the balanced equation',
        'Ensure you record all readings to 2 decimal places',
        'Review molar mass calculations for common compounds'
      ]
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    const volumes = [
      data.titrations.first.final - data.titrations.first.initial,
      data.titrations.second.final - data.titrations.second.initial,
      data.titrations.third.final - data.titrations.third.initial
    ];
    
    const systemPrompt = `You are a chemistry teacher grading a student's titration practical. Analyze their results and provide specific, constructive feedback in JSON format.`;
    
    const userPrompt = `Student's Results:
- Titration volumes: ${volumes.map(v => v.toFixed(2)).join(' cm³, ')} cm³
- Average titre: ${(volumes.reduce((a,b) => a+b) / volumes.length).toFixed(2)} cm³
- Concentration A: ${data.calculations.concA.toFixed(3)} mol dm⁻³
- Concentration B: ${data.calculations.concB.toFixed(3)} mol dm⁻³

Basic Scores:
- Titration score: ${basicScores.titrations}/50
- Calculation score: ${basicScores.calculations}/50

Provide specific, constructive feedback with:
1. Two areas where the student performed well
2. Two areas for improvement
3. One practical tip for next time

Respond with JSON in this format: {"improvements": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            improvements: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["improvements"]
        }
      },
      contents: userPrompt
    });

    const aiResponse = response.text;
    let aiSuggestions: any = { improvements: [] };
    
    try {
      aiSuggestions = JSON.parse(aiResponse || '{}');
    } catch {
      // Fallback if parsing fails
      aiSuggestions = { 
        improvements: [
          'Practice maintaining steady burette control',
          'Review stoichiometric calculations',
          'Ensure precise reading of meniscus at eye level'
        ]
      };
    }

    return {
      score: basicScores.titrations + basicScores.calculations,
      feedback: basicScores.feedback,
      improvements: aiSuggestions.improvements || []
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      score: basicScores.titrations + basicScores.calculations,
      feedback: basicScores.feedback,
      improvements: [
        'Practice maintaining steady burette control',
        'Review stoichiometric calculations',
        'Ensure precise reading of meniscus at eye level'
      ]
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Load questions on startup
  await loadQuestions();

  // Get current question
  app.get("/api/question", (req, res) => {
    if (questions.length === 0) {
      return res.status(500).json({ error: "No questions available" });
    }
    
    const question = questions[currentQuestionIndex];
    res.json({ question });
  });

  // Submit practical for grading
  app.post("/api/submit", async (req, res) => {
    try {
      const data = req.body;
      const currentQuestion = questions[currentQuestionIndex];
      
      if (!currentQuestion) {
        return res.status(400).json({ error: "No active question" });
      }

      // Calculate basic scores
      const basicScores = calculateTitrationScore(data, currentQuestion.expectedResults);
      
      // Get AI-enhanced feedback
      const result = await generateAIFeedback(data, basicScores);
      
      res.json(result);
    } catch (error) {
      console.error('Error grading practical:', error);
      res.status(500).json({ error: "Failed to grade practical" });
    }
  });

  // Get next question
  app.get("/api/next-question", (req, res) => {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    const question = questions[currentQuestionIndex];
    res.json({ question });
  });

  const httpServer = createServer(app);
  return httpServer;
}

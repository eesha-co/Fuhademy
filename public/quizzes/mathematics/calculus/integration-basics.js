/**
 * Quiz: Integration Basics
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'integration-basics', [
    {
        question: "What is ∫x² dx?",
        options: ["x³ + C", "(1/3)x³ + C", "2x + C", "x³/2 + C"],
        correct: 1,
        explanation: "Using ∫xⁿ dx = xⁿ⁺¹/(n+1) + C: ∫x² dx = x³/3 + C"
    },
    {
        question: "Evaluate ∫(3x² + 2x) dx",
        options: ["x³ + x² + C", "6x + 2 + C", "3x³ + x² + C", "x³ + 2x² + C"],
        correct: 0,
        explanation: "∫3x² dx = x³, ∫2x dx = x², so result is x³ + x² + C"
    },
    {
        question: "What is ∫cos x dx?",
        options: ["sin x + C", "-sin x + C", "cos x + C", "-cos x + C"],
        correct: 0,
        explanation: "The integral of cos x is sin x."
    },
    {
        question: "Evaluate ∫₁³ 2x dx",
        options: ["4", "8", "6", "2"],
        correct: 1,
        explanation: "∫2x dx = x², evaluate from 1 to 3: 9 - 1 = 8"
    },
    {
        question: "What is ∫eˣ dx?",
        options: ["xeˣ⁻¹ + C", "eˣ + C", "eˣ⁻¹ + C", "ln x + C"],
        correct: 1,
        explanation: "The integral of eˣ is eˣ + C."
    }
]);

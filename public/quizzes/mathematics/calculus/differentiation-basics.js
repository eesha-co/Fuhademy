/**
 * Quiz: Differentiation Basics
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'differentiation-basics', [
    {
        question: "What is the derivative of x³?",
        options: ["3x²", "x²", "3x", "x³"],
        correct: 0,
        explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x²"
    },
    {
        question: "Find dy/dx if y = 5x² + 3x - 7",
        options: ["10x + 3", "5x + 3", "10x - 7", "5x²"],
        correct: 0,
        explanation: "Differentiate term by term: d/dx(5x²) = 10x, d/dx(3x) = 3, d/dx(-7) = 0"
    },
    {
        question: "What is the derivative of sin x?",
        options: ["cos x", "-cos x", "sin x", "-sin x"],
        correct: 0,
        explanation: "The derivative of sin x is cos x."
    },
    {
        question: "Find d/dx(1/x)",
        options: ["1/x²", "-1/x²", "-x⁻²", "Both b and c"],
        correct: 3,
        explanation: "1/x = x⁻¹, so d/dx(x⁻¹) = -x⁻² = -1/x²"
    },
    {
        question: "What is the derivative of eˣ?",
        options: ["xeˣ⁻¹", "eˣ", "eˣ⁻¹", "ln x"],
        correct: 1,
        explanation: "The derivative of eˣ is eˣ (it's its own derivative)."
    }
]);

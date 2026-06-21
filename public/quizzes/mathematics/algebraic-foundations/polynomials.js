/**
 * Quiz: Polynomials
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'polynomials', [
    {
        question: "What is the degree of the polynomial 3x⁴ - 2x² + 5x - 7?",
        options: ["2", "4", "3", "7"],
        correct: 1,
        explanation: "The degree is the highest power of x, which is 4."
    },
    {
        question: "Add: (3x² + 2x - 1) + (x² - 3x + 4)",
        options: ["4x² - x + 3", "4x² + 5x + 3", "4x² - 5x + 3", "4x² - x - 3"],
        correct: 0,
        explanation: "Add like terms: (3+1)x² + (2-3)x + (-1+4) = 4x² - x + 3"
    },
    {
        question: "Multiply: (x + 2)(x - 3)",
        options: ["x² - 6", "x² - x - 6", "x² + x - 6", "x² - x + 6"],
        correct: 1,
        explanation: "(x + 2)(x - 3) = x² - 3x + 2x - 6 = x² - x - 6"
    },
    {
        question: "Divide: (2x² + 5x + 3) ÷ (x + 1)",
        options: ["2x + 3", "2x - 3", "x + 3", "2x + 1"],
        correct: 0,
        explanation: "(2x² + 5x + 3) ÷ (x + 1) = 2x + 3"
    },
    {
        question: "If x = 2 is a root of x³ - 6x² + 11x - 6 = 0, find another root.",
        options: ["x = 1", "x = 3", "Both x = 1 and x = 3", "x = -2"],
        correct: 2,
        explanation: "The polynomial factors as (x-1)(x-2)(x-3), so roots are 1, 2, 3."
    }
]);

/**
 * Quiz: Factorization
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'factorization', [
    {
        question: "Factorize: x² - 16",
        options: ["(x - 4)²", "(x + 4)(x - 4)", "(x + 8)(x - 2)", "Cannot factorize"],
        correct: 1,
        explanation: "Difference of two squares: x² - 16 = (x + 4)(x - 4)"
    },
    {
        question: "Factorize: x² + 7x + 12",
        options: ["(x + 3)(x + 4)", "(x + 6)(x + 2)", "(x + 12)(x + 1)", "(x + 3)²"],
        correct: 0,
        explanation: "Find two numbers that multiply to 12 and add to 7: 3 and 4."
    },
    {
        question: "Factorize: 2x² + 5x - 3",
        options: ["(2x - 1)(x + 3)", "(2x + 3)(x - 1)", "(2x + 1)(x - 3)", "(2x - 3)(x + 1)"],
        correct: 0,
        explanation: "2x² + 5x - 3 = (2x - 1)(x + 3)"
    },
    {
        question: "Factorize completely: 4x² - 9",
        options: ["(2x - 3)²", "(2x + 3)(2x - 3)", "(4x + 9)(x - 1)", "4(x² - 9/4)"],
        correct: 1,
        explanation: "Difference of squares: (2x)² - 3² = (2x + 3)(2x - 3)"
    },
    {
        question: "Factorize: x³ - 8",
        options: ["(x - 2)³", "(x - 2)(x² + 2x + 4)", "(x + 2)(x² - 2x + 4)", "(x - 2)(x + 2)²"],
        correct: 1,
        explanation: "Difference of cubes: x³ - 2³ = (x - 2)(x² + 2x + 4)"
    }
]);

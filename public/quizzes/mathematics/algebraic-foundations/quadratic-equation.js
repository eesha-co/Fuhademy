/**
 * Quiz: Quadratic Equation
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'quadratic-equation', [
    {
        question: "The general form of a quadratic equation is:",
        options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + bx² + cx + d = 0", "ax² + bx = 0"],
        correct: 1,
        explanation: "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0."
    },
    {
        question: "Using the quadratic formula, solve x² - 5x + 6 = 0",
        options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, -6"],
        correct: 0,
        explanation: "x = (5 ± √(25-24))/2 = (5 ± 1)/2, so x = 3 or x = 2."
    },
    {
        question: "How many roots can a quadratic equation have?",
        options: ["One only", "Two only", "Up to two", "Unlimited"],
        correct: 2,
        explanation: "A quadratic equation can have 0, 1, or 2 real roots depending on the discriminant."
    },
    {
        question: "If the discriminant b² - 4ac is negative, the quadratic has:",
        options: ["Two real roots", "One real root", "No real roots", "Three real roots"],
        correct: 2,
        explanation: "When the discriminant is negative, the quadratic has no real roots (only complex roots)."
    },
    {
        question: "The sum of the roots of ax² + bx + c = 0 equals:",
        options: ["c/a", "-b/a", "b/a", "-c/a"],
        correct: 1,
        explanation: "For a quadratic equation, sum of roots = -b/a (by Vieta's formulas)."
    }
]);

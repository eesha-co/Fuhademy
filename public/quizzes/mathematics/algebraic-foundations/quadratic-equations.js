/**
 * Quiz: Quadratic Equations
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'quadratic-equations', [
    {
        question: "The general form of a quadratic equation is:",
        options: ["ax + b = 0", "ax² + bx + c = 0", "y = mx + c", "a² + b² = c²"],
        correct: 1,
        explanation: "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0."
    },
    {
        question: "Solve: x² - 9 = 0",
        options: ["x = 3", "x = -3", "x = 3 or x = -3", "x = 9"],
        correct: 2,
        explanation: "x² = 9, x = ±√9 = ±3"
    },
    {
        question: "Using the quadratic formula, solve: x² - 5x + 6 = 0",
        options: ["x = 2 or x = 3", "x = -2 or x = -3", "x = 1 or x = 6", "x = 6 or x = -1"],
        correct: 0,
        explanation: "x = (5 ± √(25-24))/2 = (5 ± 1)/2 = 3 or 2"
    },
    {
        question: "The discriminant of x² + 4x + 4 = 0 is:",
        options: ["0", "16", "8", "-16"],
        correct: 0,
        explanation: "Discriminant = b² - 4ac = 16 - 16 = 0"
    },
    {
        question: "If discriminant < 0, the roots are:",
        options: ["Real and equal", "Real and different", "Imaginary", "One real root"],
        correct: 2,
        explanation: "When discriminant < 0, the quadratic has no real roots (imaginary)."
    }
]);

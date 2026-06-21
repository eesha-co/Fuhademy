/**
 * Quiz: Coordinate Geometry
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'coordinate-geometry', [
    {
        question: "What is the distance between points A(1, 2) and B(4, 6)?",
        options: ["3", "4", "5", "7"],
        correct: 2,
        explanation: "d = √[(4-1)² + (6-2)²] = √(9 + 16) = √25 = 5"
    },
    {
        question: "Find the midpoint of the line joining (2, 4) and (6, 8)",
        options: ["(4, 6)", "(3, 5)", "(5, 7)", "(4, 5)"],
        correct: 0,
        explanation: "Midpoint = ((2+6)/2, (4+8)/2) = (4, 6)"
    },
    {
        question: "What is the gradient of the line passing through (0, 0) and (3, 6)?",
        options: ["1", "2", "3", "1/2"],
        correct: 1,
        explanation: "m = (6-0)/(3-0) = 6/3 = 2"
    },
    {
        question: "The equation of a line with gradient 2 and y-intercept 3 is:",
        options: ["y = 2x - 3", "y = 2x + 3", "y = 3x + 2", "y = -2x + 3"],
        correct: 1,
        explanation: "Using y = mx + c: y = 2x + 3"
    },
    {
        question: "Lines with gradients m₁ = 2 and m₂ = -1/2 are:",
        options: ["Parallel", "Perpendicular", "Same line", "Intersecting but not perpendicular"],
        correct: 1,
        explanation: "m₁ × m₂ = 2 × (-1/2) = -1, so the lines are perpendicular."
    }
]);

/**
 * Quiz: Logarithms
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'logarithms', [
    {
        question: "What is log₁₀ 100?",
        options: ["1", "2", "10", "100"],
        correct: 1,
        explanation: "log₁₀ 100 = 2 because 10² = 100"
    },
    {
        question: "Evaluate: log₂ 8",
        options: ["2", "3", "4", "8"],
        correct: 1,
        explanation: "log₂ 8 = 3 because 2³ = 8"
    },
    {
        question: "If log₁₀ x = 3, find x",
        options: ["30", "100", "300", "1000"],
        correct: 3,
        explanation: "x = 10³ = 1000"
    },
    {
        question: "Simplify: log 6 + log 5",
        options: ["log 30", "log 11", "log 1", "2 log 30"],
        correct: 0,
        explanation: "log a + log b = log(ab), so log 6 + log 5 = log 30"
    },
    {
        question: "What is log 1?",
        options: ["0", "1", "10", "Undefined"],
        correct: 0,
        explanation: "log 1 = 0 because any base raised to power 0 equals 1."
    }
]);

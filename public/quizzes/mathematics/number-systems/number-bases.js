/**
 * Quiz: Number Bases
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'number-bases', [
    {
        question: "Convert 101₂ to base 10",
        options: ["3", "5", "7", "101"],
        correct: 1,
        explanation: "101₂ = 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5"
    },
    {
        question: "Convert 15₁₀ to binary",
        options: ["1010", "1110", "1111", "1101"],
        correct: 2,
        explanation: "15 = 8 + 4 + 2 + 1 = 1111₂"
    },
    {
        question: "Add: 101₂ + 110₂",
        options: ["1011₂", "1111₂", "1001₂", "211₂"],
        correct: 0,
        explanation: "101₂ = 5, 110₂ = 6, Sum = 11 = 1011₂"
    },
    {
        question: "Convert 23₄ to base 10",
        options: ["23", "11", "7", "5"],
        correct: 1,
        explanation: "23₄ = 2×4¹ + 3×4⁰ = 8 + 3 = 11"
    },
    {
        question: "What is 6₇ + 5₇ in base 7?",
        options: ["11₇", "14₇", "13₇", "12₇"],
        correct: 1,
        explanation: "6 + 5 = 11, in base 7: 11 = 1×7 + 4 = 14₇"
    }
]);

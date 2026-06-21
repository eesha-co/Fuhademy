/**
 * Quiz: Modular Arithmetic
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'modular-arithmetic', [
    {
        question: "What is 17 mod 5?",
        options: ["2", "3", "12", "5"],
        correct: 0,
        explanation: "17 ÷ 5 = 3 remainder 2, so 17 ≡ 2 (mod 5)"
    },
    {
        question: "Find: 23 mod 7",
        options: ["2", "3", "4", "16"],
        correct: 0,
        explanation: "23 ÷ 7 = 3 remainder 2, so 23 ≡ 2 (mod 7)"
    },
    {
        question: "What is 8 + 7 (mod 5)?",
        options: ["0", "1", "2", "15"],
        correct: 0,
        explanation: "8 + 7 = 15, 15 mod 5 = 0"
    },
    {
        question: "Find the value of x: 3x ≡ 2 (mod 7) where 0 ≤ x < 7",
        options: ["3", "4", "5", "6"],
        correct: 0,
        explanation: "3 × 3 = 9 ≡ 2 (mod 7)"
    },
    {
        question: "What day of the week will it be 100 days after Monday?",
        options: ["Monday", "Wednesday", "Thursday", "Friday"],
        correct: 2,
        explanation: "100 mod 7 = 2. Monday + 2 days = Wednesday"
    }
]);

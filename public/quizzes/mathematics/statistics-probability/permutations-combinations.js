/**
 * Quiz: Permutations and Combinations
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'permutations-combinations', [
    {
        question: "What is the value of 5! (5 factorial)?",
        options: ["25", "60", "120", "720"],
        correct: 2,
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120."
    },
    {
        question: "In how many ways can 4 books be arranged on a shelf?",
        options: ["4", "16", "24", "120"],
        correct: 2,
        explanation: "This is a permutation: 4! = 4 × 3 × 2 × 1 = 24 ways."
    },
    {
        question: "How many ways can 3 students be selected from 8 students?",
        options: ["24", "56", "336", "512"],
        correct: 1,
        explanation: "This is a combination: ⁸C₃ = 8!/(3! × 5!) = (8 × 7 × 6)/(3 × 2 × 1) = 56."
    },
    {
        question: "The difference between permutations and combinations is:",
        options: ["Permutations consider order, combinations do not", "Combinations consider order, permutations do not", "There is no difference", "Permutations are for small numbers only"],
        correct: 0,
        explanation: "Permutations consider the arrangement (order) while combinations do not consider order."
    },
    {
        question: "In how many ways can the letters of the word 'MATH' be arranged?",
        options: ["4", "12", "24", "120"],
        correct: 2,
        explanation: "4 distinct letters can be arranged in 4! = 24 ways."
    }
]);

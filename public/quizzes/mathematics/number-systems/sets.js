/**
 * Quiz: Sets
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'sets', [
    {
        question: "What is the intersection of A = {1, 2, 3} and B = {2, 3, 4}?",
        options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{}"],
        correct: 1,
        explanation: "A ∩ B contains elements common to both sets: {2, 3}"
    },
    {
        question: "The union of sets P = {a, b} and Q = {b, c, d} is:",
        options: ["{a, b, c, d}", "{b}", "{a, b, b, c, d}", "{a, c, d}"],
        correct: 0,
        explanation: "P ∪ Q contains all elements from both sets without repetition."
    },
    {
        question: "How many subsets does the set {a, b, c} have?",
        options: ["3", "6", "8", "9"],
        correct: 2,
        explanation: "A set with n elements has 2^n subsets. 2³ = 8 subsets."
    },
    {
        question: "What is the complement of set A if U = {1, 2, 3, 4, 5} and A = {1, 3, 5}?",
        options: ["{1, 3, 5}", "{2, 4}", "{1, 2, 3, 4, 5}", "{}"],
        correct: 1,
        explanation: "A' contains elements in universal set U but not in A: {2, 4}"
    },
    {
        question: "If n(A) = 15, n(B) = 20, and n(A ∪ B) = 30, find n(A ∩ B)",
        options: ["5", "10", "15", "35"],
        correct: 0,
        explanation: "n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = 15 + 20 - 30 = 5"
    }
]);

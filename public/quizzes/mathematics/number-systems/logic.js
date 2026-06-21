/**
 * Quiz: Logic
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'logic', [
    {
        question: "What is the negation of 'All students are present'?",
        options: ["No students are present", "Some students are not present", "All students are absent", "Some students are present"],
        correct: 1,
        explanation: "The negation of 'All A are B' is 'Some A are not B'."
    },
    {
        question: "If p → q is true and q is false, what can we conclude about p?",
        options: ["p is true", "p is false", "p could be true or false", "Cannot determine"],
        correct: 1,
        explanation: "If p → q and q is false, then p must be false (modus tollens)."
    },
    {
        question: "What is the truth value of p AND q when p is true and q is false?",
        options: ["True", "False", "Cannot determine", "Both true and false"],
        correct: 1,
        explanation: "AND operation requires both p and q to be true for the result to be true."
    },
    {
        question: "The contrapositive of 'If it rains, then the ground is wet' is:",
        options: ["If the ground is wet, then it rains", "If it doesn't rain, the ground is not wet", "If the ground is not wet, then it doesn't rain", "It rains and the ground is wet"],
        correct: 2,
        explanation: "Contrapositive of p → q is ¬q → ¬p"
    },
    {
        question: "What is p OR q when p is true and q is false?",
        options: ["True", "False", "Cannot determine", "Both"],
        correct: 0,
        explanation: "OR operation gives true if at least one operand is true."
    }
]);

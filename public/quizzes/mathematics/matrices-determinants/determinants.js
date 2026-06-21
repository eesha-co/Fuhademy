/**
 * Quiz: Determinants
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'determinants', [
    {
        question: "What is the determinant of [[2, 0], [0, 3]]?",
        options: ["5", "6", "0", "2"],
        correct: 1,
        explanation: "det = 2×3 - 0×0 = 6"
    },
    {
        question: "The determinant of a singular matrix is:",
        options: ["1", "0", "-1", "Undefined"],
        correct: 1,
        explanation: "A singular matrix has no inverse, and its determinant is 0."
    },
    {
        question: "What is the determinant of [[1, 2], [3, 4]]?",
        options: ["10", "-2", "2", "-10"],
        correct: 1,
        explanation: "det = 1×4 - 2×3 = 4 - 6 = -2"
    },
    {
        question: "If det(A) = 5, what is det(2A) for a 2×2 matrix A?",
        options: ["10", "20", "5", "25"],
        correct: 1,
        explanation: "For n×n matrix, det(kA) = kⁿ det(A). So det(2A) = 4×5 = 20"
    },
    {
        question: "A matrix is invertible if its determinant is:",
        options: ["Zero", "Non-zero", "Positive", "Negative"],
        correct: 1,
        explanation: "A matrix is invertible if and only if its determinant is non-zero."
    }
]);

/**
 * Quiz: Matrices
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'matrices', [
    {
        question: "What is the order of a matrix with 2 rows and 3 columns?",
        options: ["2×2", "3×3", "2×3", "3×2"],
        correct: 2,
        explanation: "Order is rows × columns, so 2×3."
    },
    {
        question: "Add: [1 2] + [3 4]",
        options: ["[4 6]", "[3 8]", "[4 8]", "[1 2 3 4]"],
        correct: 0,
        explanation: "Add corresponding elements: 1+3=4, 2+4=6"
    },
    {
        question: "What is the identity matrix?",
        options: ["A matrix of all 1s", "A matrix with 1s on diagonal and 0s elsewhere", "A zero matrix", "A matrix with equal elements"],
        correct: 1,
        explanation: "Identity matrix has 1s on the main diagonal and 0s elsewhere."
    },
    {
        question: "If A is a 2×3 matrix and B is a 3×2 matrix, what is the order of AB?",
        options: ["2×2", "3×3", "2×3", "3×2"],
        correct: 0,
        explanation: "Product of m×n and n×p matrices gives an m×p matrix. So 2×2."
    },
    {
        question: "What is the transpose of a 2×3 matrix?",
        options: ["2×3", "3×2", "1×6", "6×1"],
        correct: 1,
        explanation: "Transpose swaps rows and columns, so 2×3 becomes 3×2."
    }
]);

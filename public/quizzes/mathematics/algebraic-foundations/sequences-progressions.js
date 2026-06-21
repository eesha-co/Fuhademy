/**
 * Quiz: Sequences & Progressions
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'sequences-progressions', [
    {
        question: "Find the 10th term of the AP: 2, 5, 8, 11, ...",
        options: ["29", "32", "27", "35"],
        correct: 0,
        explanation: "a = 2, d = 3. a₁₀ = 2 + (10-1)×3 = 2 + 27 = 29"
    },
    {
        question: "Find the sum of the first 20 natural numbers",
        options: ["200", "210", "190", "220"],
        correct: 1,
        explanation: "S = n(n+1)/2 = 20×21/2 = 210"
    },
    {
        question: "The 5th term of a GP is 48 and the 3rd term is 12. Find the common ratio.",
        options: ["2", "4", "±2", "3"],
        correct: 2,
        explanation: "ar⁴/ar² = r² = 4, so r = ±2"
    },
    {
        question: "Find the sum of the GP: 2 + 6 + 18 + ... to 6 terms",
        options: ["728", "486", "1458", "729"],
        correct: 0,
        explanation: "S = a(rⁿ - 1)/(r - 1) = 2(3⁶ - 1)/2 = 728"
    },
    {
        question: "Find the nth term of the sequence: 1, 4, 9, 16, ...",
        options: ["n²", "2n - 1", "n + 3", "n³"],
        correct: 0,
        explanation: "This is a sequence of perfect squares: 1², 2², 3², 4², ..."
    }
]);

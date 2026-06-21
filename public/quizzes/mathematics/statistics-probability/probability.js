/**
 * Quiz: Probability
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'probability', [
    {
        question: "A fair die is rolled. What is the probability of getting a 4?",
        options: ["1/6", "1/4", "1/3", "1/2"],
        correct: 0,
        explanation: "A die has 6 faces, so P(4) = 1/6"
    },
    {
        question: "If P(A) = 0.3, what is P(not A)?",
        options: ["0.3", "0.7", "0.6", "1.0"],
        correct: 1,
        explanation: "P(not A) = 1 - P(A) = 1 - 0.3 = 0.7"
    },
    {
        question: "A bag contains 3 red and 2 blue balls. What is the probability of picking a red ball?",
        options: ["2/5", "3/5", "1/2", "3/2"],
        correct: 1,
        explanation: "Total = 5 balls, Red = 3, P(Red) = 3/5"
    },
    {
        question: "Two coins are tossed. What is the probability of getting two heads?",
        options: ["1/2", "1/4", "1/8", "3/4"],
        correct: 1,
        explanation: "Sample space = {HH, HT, TH, TT}, P(HH) = 1/4"
    },
    {
        question: "If A and B are independent events with P(A) = 0.4 and P(B) = 0.5, find P(A and B)",
        options: ["0.9", "0.2", "0.1", "0.45"],
        correct: 1,
        explanation: "For independent events: P(A and B) = P(A) × P(B) = 0.4 × 0.5 = 0.2"
    }
]);

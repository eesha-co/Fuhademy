/**
 * Quiz: Variations
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'variations', [
    {
        question: "If y varies directly as x, and y = 15 when x = 3, find the constant of variation.",
        options: ["3", "5", "45", "12"],
        correct: 1,
        explanation: "y = kx, so k = y/x = 15/3 = 5"
    },
    {
        question: "If y varies inversely as x, and y = 6 when x = 2, find y when x = 3",
        options: ["4", "9", "18", "2"],
        correct: 0,
        explanation: "y = k/x, k = 12, so y = 12/3 = 4"
    },
    {
        question: "p varies directly as q and inversely as r. If p = 12 when q = 6 and r = 2, find p when q = 9 and r = 3",
        options: ["12", "9", "18", "6"],
        correct: 0,
        explanation: "p = kq/r, k = 4, so p = 4×9/3 = 12"
    },
    {
        question: "If A varies as the square of B, and A = 36 when B = 3, find A when B = 5",
        options: ["60", "100", "25", "125"],
        correct: 1,
        explanation: "A = kB², k = 4, so A = 4 × 25 = 100"
    },
    {
        question: "The time (t) for a journey varies inversely as the speed (s). If t = 4 hours at 60 km/h, find t at 80 km/h",
        options: ["3 hours", "5 hours", "3.5 hours", "2 hours"],
        correct: 0,
        explanation: "t = k/s, k = 240, so t = 240/80 = 3 hours"
    }
]);

/**
 * Quiz: Bearings
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'bearings', [
    {
        question: "Bearings are measured from which direction?",
        options: ["South", "East", "North", "West"],
        correct: 2,
        explanation: "Bearings are always measured clockwise from the North direction."
    },
    {
        question: "What is the bearing of East from North?",
        options: ["045°", "090°", "180°", "270°"],
        correct: 1,
        explanation: "East is 90° clockwise from North, so the bearing is 090°."
    },
    {
        question: "If the bearing of B from A is 060°, what is the bearing of A from B?",
        options: ["060°", "120°", "240°", "300°"],
        correct: 2,
        explanation: "The back bearing is 180° + 60° = 240°."
    },
    {
        question: "A ship sails from point A on a bearing of 135° for 10km. How far East has it traveled?",
        options: ["10sin 45° km", "10cos 45° km", "10sin 135° km", "10tan 45° km"],
        correct: 1,
        explanation: "East distance = 10 × sin(135° - 90°) = 10 × sin 45° = 10cos 45° km."
    },
    {
        question: "The bearing of South-West is:",
        options: ["045°", "135°", "225°", "315°"],
        correct: 2,
        explanation: "South-West is 180° + 45° = 225° from North."
    }
]);

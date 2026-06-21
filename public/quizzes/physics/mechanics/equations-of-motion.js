/**
 * Quiz: Equations of Motion
 * Subject: Physics
 */

registerTopicQuiz('physics', 'equations-of-motion', [
    {
        question: "The three equations of motion are valid for:",
        options: ["Non-uniform acceleration", "Uniform acceleration", "Variable acceleration", "Zero acceleration only"],
        correct: 1,
        explanation: "The equations of motion (v = u + at, s = ut + ½at², v² = u² + 2as) are valid only for motion with uniform (constant) acceleration."
    },
    {
        question: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. Its acceleration is:",
        options: ["4 m/s²", "5 m/s²", "10 m/s²", "100 m/s²"],
        correct: 0,
        explanation: "Using v = u + at: 20 = 0 + a(5), so a = 20/5 = 4 m/s². The car accelerates at 4 meters per second squared."
    },
    {
        question: "A body starting from rest accelerates at 2 m/s² for 4 seconds. The distance covered is:",
        options: ["8 m", "12 m", "16 m", "32 m"],
        correct: 2,
        explanation: "Using s = ut + ½at²: s = 0(4) + ½(2)(4)² = 0 + ½(2)(16) = 16 m. The body covers 16 meters in 4 seconds."
    },
    {
        question: "A ball is thrown vertically upward with initial velocity 30 m/s. How high will it go? (g = 10 m/s²)",
        options: ["30 m", "45 m", "60 m", "90 m"],
        correct: 1,
        explanation: "At maximum height, v = 0. Using v² = u² + 2as: 0 = 30² + 2(-10)(s), so 0 = 900 - 20s, giving s = 900/20 = 45 m."
    },
    {
        question: "A body decelerates uniformly from 25 m/s to rest in 5 seconds. The deceleration is:",
        options: ["5 m/s²", "25 m/s²", "125 m/s²", "-5 m/s²"],
        correct: 0,
        explanation: "Using v = u + at: 0 = 25 + a(5), so a = -25/5 = -5 m/s². The magnitude of deceleration is 5 m/s² (the negative sign indicates deceleration)."
    }
]);

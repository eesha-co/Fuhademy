/**
 * Quiz: Linear Motion
 * Subject: Physics
 */

registerTopicQuiz('physics', 'linear-motion', [
    {
        question: "A car accelerates from rest at 2 m/s² for 10 seconds. What is its final velocity?",
        options: ["5 m/s", "10 m/s", "20 m/s", "200 m/s"],
        correct: 2,
        explanation: "Using v = u + at, where u = 0 (starts from rest), a = 2 m/s², t = 10 s. Therefore, v = 0 + 2 × 10 = 20 m/s."
    },
    {
        question: "The distance traveled by a body moving with uniform acceleration can be calculated using:",
        options: ["s = v × t", "s = ut + ½at²", "s = v/t", "s = a × t"],
        correct: 1,
        explanation: "For uniformly accelerated motion, distance is given by s = ut + ½at², where u is initial velocity, a is acceleration, and t is time."
    },
    {
        question: "A body is said to be moving with uniform velocity if its:",
        options: ["Speed changes continuously", "Direction changes but speed is constant", "Speed and direction remain constant", "Acceleration is increasing"],
        correct: 2,
        explanation: "Uniform velocity means both the speed and direction of motion remain constant. This implies zero acceleration since velocity (a vector) does not change."
    },
    {
        question: "A ball is thrown vertically upward with a velocity of 20 m/s. How long will it take to reach its maximum height? (g = 10 m/s²)",
        options: ["1 s", "2 s", "4 s", "10 s"],
        correct: 1,
        explanation: "At maximum height, final velocity v = 0. Using v = u - gt (negative g for upward motion): 0 = 20 - 10t, therefore t = 2 seconds."
    },
    {
        question: "The area under a velocity-time graph represents:",
        options: ["Acceleration", "Velocity", "Displacement", "Force"],
        correct: 2,
        explanation: "The area under a velocity-time graph represents the displacement. This is because displacement = velocity × time, which corresponds to the area under the curve."
    }
]);

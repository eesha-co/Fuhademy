/**
 * Quiz: Projectile Motion
 * Subject: Physics
 */

registerTopicQuiz('physics', 'projectile-motion', [
    {
        question: "In projectile motion, the horizontal and vertical components of motion are:",
        options: ["Dependent on each other", "Independent of each other", "Always equal", "Both affected by gravity"],
        correct: 1,
        explanation: "In projectile motion, horizontal and vertical motions are independent. Gravity affects only the vertical component, while horizontal velocity remains constant (neglecting air resistance)."
    },
    {
        question: "A ball is thrown horizontally from a cliff with velocity 20 m/s. After 2 seconds, the horizontal distance covered is: (neglect air resistance)",
        options: ["10 m", "20 m", "40 m", "80 m"],
        correct: 2,
        explanation: "Horizontal distance = horizontal velocity × time = 20 × 2 = 40 m. The horizontal velocity remains constant at 20 m/s throughout the motion."
    },
    {
        question: "The trajectory of a projectile is:",
        options: ["A straight line", "A circle", "A parabola", "An ellipse"],
        correct: 2,
        explanation: "The trajectory of a projectile is a parabola. This is because the horizontal motion is uniform while the vertical motion is uniformly accelerated due to gravity."
    },
    {
        question: "At the highest point of a projectile's trajectory:",
        options: ["The velocity is zero", "The velocity is horizontal", "The acceleration is zero", "The velocity is vertical"],
        correct: 1,
        explanation: "At the highest point, the vertical component of velocity is zero, but the horizontal component remains. Therefore, the velocity is purely horizontal at this point."
    },
    {
        question: "A ball is projected at 45° to the horizontal. For maximum range, the angle of projection should be:",
        options: ["30°", "45°", "60°", "90°"],
        correct: 1,
        explanation: "For maximum range on level ground, the optimal angle of projection is 45°. At this angle, the horizontal and vertical components of initial velocity are equal."
    }
]);

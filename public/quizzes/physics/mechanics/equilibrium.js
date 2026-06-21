/**
 * Quiz: Equilibrium
 * Subject: Physics
 */

registerTopicQuiz('physics', 'equilibrium', [
    {
        question: "A body is in equilibrium when:",
        options: ["It is moving at constant velocity", "The net force on it is zero", "It is accelerating", "Only one force acts on it"],
        correct: 1,
        explanation: "A body is in equilibrium when the net (resultant) force on it is zero. This means all forces are balanced, and the body is either at rest or moving with constant velocity."
    },
    {
        question: "For a body to be in stable equilibrium:",
        options: ["Its center of gravity must be at its highest position", "Its center of gravity must be at its lowest position", "It must not have a center of gravity", "It must be moving"],
        correct: 1,
        explanation: "In stable equilibrium, the center of gravity is at its lowest position. When slightly displaced, the body returns to its original position because its center of gravity rises and then falls back."
    },
    {
        question: "The principle of moments states that for a body in equilibrium:",
        options: ["Sum of clockwise moments equals sum of anticlockwise moments", "All moments must be clockwise", "All moments must be anticlockwise", "Moments are zero"],
        correct: 0,
        explanation: "The principle of moments states that for a body in rotational equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about the same point."
    },
    {
        question: "A uniform rod of length 2 m is balanced at its center. A 10 N weight is placed 0.4 m from the pivot. What weight must be placed 0.5 m on the other side?",
        options: ["8 N", "10 N", "12.5 N", "20 N"],
        correct: 0,
        explanation: "Using the principle of moments: Clockwise moment = Anticlockwise moment. 10 × 0.4 = W × 0.5, so W = 40/0.5 = 8 N."
    },
    {
        question: "A body in neutral equilibrium:",
        options: ["Returns to its original position when displaced", "Does not return to its original position after displacement", "Has its center of gravity at the same height after displacement", "Always falls over"],
        correct: 2,
        explanation: "In neutral equilibrium, the center of gravity remains at the same height after a small displacement. A ball on a flat surface is an example - it stays wherever it is placed."
    }
]);

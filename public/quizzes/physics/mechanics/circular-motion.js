/**
 * Quiz: Circular Motion
 * Subject: Physics
 */

registerTopicQuiz('physics', 'circular-motion', [
    {
        question: "An object moving in a circle at constant speed has:",
        options: ["No acceleration", "Acceleration directed away from the center", "Acceleration directed toward the center", "Acceleration in the direction of motion"],
        correct: 2,
        explanation: "An object in circular motion has centripetal acceleration directed toward the center of the circle. This acceleration is necessary to continuously change the direction of velocity."
    },
    {
        question: "The centripetal force required to keep an object moving in a circle is provided by:",
        options: ["The object's inertia", "An external force acting toward the center", "A force acting away from the center", "The object's weight alone"],
        correct: 1,
        explanation: "Centripetal force is an external force directed toward the center of the circular path. It could be tension, gravity, friction, or normal reaction depending on the situation."
    },
    {
        question: "The centripetal acceleration of an object moving in a circle of radius r with speed v is:",
        options: ["v/r", "v²/r", "r/v²", "r/v"],
        correct: 1,
        explanation: "Centripetal acceleration a = v²/r, where v is the linear speed and r is the radius of the circular path. It is always directed toward the center of the circle."
    },
    {
        question: "A car of mass 1000 kg moves around a curve of radius 50 m at 10 m/s. The centripetal force required is:",
        options: ["200 N", "2000 N", "5000 N", "10000 N"],
        correct: 1,
        explanation: "Centripetal force F = mv²/r = 1000 × (10)²/50 = 1000 × 100/50 = 2000 N. This force is provided by friction between the tires and the road."
    },
    {
        question: "The period of a satellite orbiting Earth depends on:",
        options: ["Its mass only", "Its speed only", "The radius of its orbit only", "Both its speed and orbital radius"],
        correct: 3,
        explanation: "The period T of a satellite depends on both its orbital speed v and radius r: T = 2πr/v. For gravitational orbits, T also depends on the central body's mass."
    }
]);

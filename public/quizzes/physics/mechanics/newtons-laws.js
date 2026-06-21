/**
 * Quiz: Newton's Laws
 * Subject: Physics
 */

registerTopicQuiz('physics', 'newtons-laws', [
    {
        question: "Newton's first law of motion is also known as the law of:",
        options: ["Acceleration", "Inertia", "Action and reaction", "Momentum"],
        correct: 1,
        explanation: "Newton's first law states that an object at rest stays at rest, and an object in motion continues in motion with constant velocity, unless acted upon by an external force. This property is called inertia."
    },
    {
        question: "According to Newton's second law, the acceleration of a body is:",
        options: ["Inversely proportional to the force applied", "Directly proportional to its mass", "Directly proportional to the force and inversely proportional to its mass", "Inversely proportional to both force and mass"],
        correct: 2,
        explanation: "Newton's second law states that F = ma, meaning acceleration is directly proportional to the net force (a ∝ F) and inversely proportional to the mass (a ∝ 1/m)."
    },
    {
        question: "A force of 20 N acts on a body of mass 5 kg. The acceleration produced is:",
        options: ["2 m/s²", "4 m/s²", "25 m/s²", "100 m/s²"],
        correct: 1,
        explanation: "Using F = ma, we have a = F/m = 20/5 = 4 m/s². The acceleration produced is 4 meters per second squared."
    },
    {
        question: "Newton's third law states that action and reaction forces:",
        options: ["Act on the same body", "Are equal in magnitude and opposite in direction", "Are always equal in magnitude", "Cancel each other out"],
        correct: 1,
        explanation: "Newton's third law states that for every action, there is an equal and opposite reaction. The action and reaction forces are equal in magnitude, opposite in direction, and act on different bodies."
    },
    {
        question: "A person standing on a bus that suddenly starts moving will tend to fall:",
        options: ["Forward", "Backward", "Sideways", "Downward"],
        correct: 1,
        explanation: "Due to inertia (Newton's first law), the person's body tends to remain at rest while the bus moves forward. This causes the person to fall backward relative to the moving bus."
    }
]);

/**
 * Quiz: Momentum
 * Subject: Physics
 */

registerTopicQuiz('physics', 'momentum', [
    {
        question: "The momentum of a body is defined as:",
        options: ["Mass × velocity", "Mass × acceleration", "Force × time", "Mass × speed"],
        correct: 0,
        explanation: "Momentum is defined as the product of mass and velocity: p = mv. It is a vector quantity with the SI unit of kg·m/s."
    },
    {
        question: "A body of mass 5 kg moving with velocity 4 m/s has a momentum of:",
        options: ["1.25 kg·m/s", "9 kg·m/s", "20 kg·m/s", "40 kg·m/s"],
        correct: 2,
        explanation: "Momentum = mass × velocity = 5 kg × 4 m/s = 20 kg·m/s."
    },
    {
        question: "The principle of conservation of momentum states that:",
        options: ["Momentum can be created", "Total momentum of a system remains constant if no external force acts", "Momentum always increases", "Momentum is always zero"],
        correct: 1,
        explanation: "The principle states that in the absence of external forces, the total momentum of a closed system remains constant. This is derived from Newton's third law."
    },
    {
        question: "A 2 kg ball moving at 6 m/s collides with a stationary 4 kg ball. If they move together after collision, their common velocity is:",
        options: ["1 m/s", "2 m/s", "3 m/s", "4 m/s"],
        correct: 1,
        explanation: "Using conservation of momentum: m₁u₁ + m₂u₂ = (m₁ + m₂)v. So 2×6 + 4×0 = (2+4)v, giving 12 = 6v, therefore v = 2 m/s."
    },
    {
        question: "Impulse is equal to:",
        options: ["Force × distance", "Force × time", "Mass × acceleration", "Momentum × velocity"],
        correct: 1,
        explanation: "Impulse = Force × time = change in momentum. It is measured in Newton-seconds (N·s) or kg·m/s. Impulse causes a change in momentum."
    }
]);

/**
 * Quiz: Work, Energy and Power
 * Subject: Physics
 */

registerTopicQuiz('physics', 'work-energy-power', [
    {
        question: "Work is done when:",
        options: ["A force is applied", "An object moves", "A force moves an object in its direction", "An object is at rest"],
        correct: 2,
        explanation: "Work is done only when a force causes displacement in the direction of the force. W = F × d × cos θ. If there's no displacement or force is perpendicular to displacement, no work is done."
    },
    {
        question: "A force of 50 N moves an object through a distance of 4 m in the direction of the force. The work done is:",
        options: ["12.5 J", "54 J", "200 J", "200 W"],
        correct: 2,
        explanation: "Work = Force × distance = 50 N × 4 m = 200 Joules. Work is measured in Joules (J), not Watts (W), which is the unit of power."
    },
    {
        question: "The kinetic energy of a body of mass 2 kg moving with velocity 5 m/s is:",
        options: ["5 J", "10 J", "25 J", "50 J"],
        correct: 2,
        explanation: "Kinetic energy = ½mv² = ½ × 2 × 5² = ½ × 2 × 25 = 25 Joules."
    },
    {
        question: "A machine lifts a load of 500 N through a height of 2 m in 10 seconds. The power developed is:",
        options: ["25 W", "100 W", "250 W", "1000 W"],
        correct: 1,
        explanation: "Work done = Force × distance = 500 × 2 = 1000 J. Power = Work/Time = 1000/10 = 100 Watts."
    },
    {
        question: "According to the principle of conservation of energy:",
        options: ["Energy can be created but not destroyed", "Energy can be destroyed but not created", "Energy can neither be created nor destroyed", "Energy can be created and destroyed"],
        correct: 2,
        explanation: "The law of conservation of energy states that energy can neither be created nor destroyed; it can only be transformed from one form to another. The total energy in a closed system remains constant."
    }
]);

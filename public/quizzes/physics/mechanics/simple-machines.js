/**
 * Quiz: Simple Machines
 * Subject: Physics
 */

registerTopicQuiz('physics', 'simple-machines', [
    {
        question: "Which of the following is NOT a simple machine?",
        options: ["Lever", "Pulley", "Electric motor", "Inclined plane"],
        correct: 2,
        explanation: "An electric motor is not a simple machine; it's a complex device that converts electrical energy to mechanical energy. Levers, pulleys, and inclined planes are all simple machines."
    },
    {
        question: "The mechanical advantage of a machine is defined as:",
        options: ["Load × distance", "Load ÷ effort", "Effort ÷ load", "Distance moved by effort ÷ distance moved by load"],
        correct: 1,
        explanation: "Mechanical Advantage (MA) = Load/Effort. It tells us how many times the machine multiplies the effort force."
    },
    {
        question: "A lever with the fulcrum between the load and effort is called:",
        options: ["First class lever", "Second class lever", "Third class lever", "Fourth class lever"],
        correct: 0,
        explanation: "A first class lever has the fulcrum positioned between the load and the effort. Examples include scissors, seesaw, and crowbar."
    },
    {
        question: "The velocity ratio of a machine depends on:",
        options: ["The load lifted", "The effort applied", "The design of the machine", "The friction in the machine"],
        correct: 2,
        explanation: "Velocity ratio is determined by the geometry and design of the machine. It is the ratio of distance moved by effort to distance moved by load, and is independent of friction."
    },
    {
        question: "Efficiency of a machine is given by:",
        options: ["(MA/VR) × 100%", "(VR/MA) × 100%", "(MA × VR) × 100%", "(MA + VR) × 100%"],
        correct: 0,
        explanation: "Efficiency = (Mechanical Advantage/Velocity Ratio) × 100%. It can also be expressed as (Work output/Work input) × 100%. No machine can have 100% efficiency due to friction."
    }
]);

/**
 * Quiz: Vibration and Simple Harmonic Motion
 * Subject: Physics
 */

registerTopicQuiz('physics', 'vibration-shm', [
    {
        question: "Simple harmonic motion is characterized by:",
        options: ["Constant acceleration", "Acceleration proportional to displacement and directed toward equilibrium", "Acceleration away from equilibrium", "Zero acceleration"],
        correct: 1,
        explanation: "In SHM, the acceleration is directly proportional to the displacement from the equilibrium position and is always directed toward that position: a = -ω²x."
    },
    {
        question: "The period of a simple pendulum depends on:",
        options: ["Its mass only", "Its length and acceleration due to gravity", "Its amplitude only", "Its length only"],
        correct: 1,
        explanation: "The period T = 2π√(L/g), where L is the length and g is the acceleration due to gravity. The period is independent of mass and amplitude (for small oscillations)."
    },
    {
        question: "In SHM, the velocity is maximum at:",
        options: ["The extreme positions", "The equilibrium position", "Halfway between extreme and equilibrium", "At the highest point"],
        correct: 1,
        explanation: "In SHM, velocity is maximum at the equilibrium position where displacement is zero. At the extreme positions, velocity is momentarily zero."
    },
    {
        question: "A simple pendulum of length 1 m has a period of approximately: (g = 10 m/s²)",
        options: ["1 s", "2 s", "3 s", "0.5 s"],
        correct: 1,
        explanation: "T = 2π√(L/g) = 2π√(1/10) = 2π√(0.1) ≈ 2 × 3.14 × 0.316 ≈ 2 s. This is a useful approximation for a 1 m pendulum."
    },
    {
        question: "The total energy in SHM is:",
        options: ["Constant", "Varies with time", "Maximum at extreme positions", "Zero at equilibrium"],
        correct: 0,
        explanation: "In SHM, the total energy (kinetic + potential) remains constant. Energy continuously transforms between kinetic and potential, but the sum stays the same."
    }
]);

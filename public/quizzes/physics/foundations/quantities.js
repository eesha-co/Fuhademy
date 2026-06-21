/**
 * Quiz: Quantities
 * Subject: Physics
 */

registerTopicQuiz('physics', 'quantities', [
    {
        question: "Which of the following is a scalar quantity?",
        options: ["Displacement", "Force", "Speed", "Acceleration"],
        correct: 2,
        explanation: "Speed is a scalar quantity because it has only magnitude. Displacement, force, and acceleration are all vector quantities having both magnitude and direction."
    },
    {
        question: "Which of the following is a fundamental quantity?",
        options: ["Velocity", "Force", "Mass", "Energy"],
        correct: 2,
        explanation: "Mass is a fundamental (base) quantity in the SI system. Velocity, force, and energy are derived quantities because they are expressed in terms of fundamental quantities."
    },
    {
        question: "The dimension of force is:",
        options: ["[MLT⁻¹]", "[MLT⁻²]", "[ML²T⁻²]", "[ML⁻¹T⁻²]"],
        correct: 1,
        explanation: "Force = mass × acceleration = m × a = [M] × [LT⁻²] = [MLT⁻²]. This is the dimensional formula for force."
    },
    {
        question: "Which quantity has the dimensional formula [ML²T⁻³]?",
        options: ["Energy", "Power", "Momentum", "Work"],
        correct: 1,
        explanation: "Power = Work/Time = Energy/Time. Work = Force × distance = [MLT⁻²] × [L] = [ML²T⁻²]. Power = [ML²T⁻²]/[T] = [ML²T⁻³]."
    },
    {
        question: "Area is an example of:",
        options: ["Fundamental quantity", "Derived quantity", "Dimensionless quantity", "Vector quantity"],
        correct: 1,
        explanation: "Area is a derived quantity because it is obtained from multiplying two lengths. Area = length × width = [L] × [L] = [L²]. It is also a scalar quantity."
    }
]);

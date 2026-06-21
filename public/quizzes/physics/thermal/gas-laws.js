/**
 * Quiz: Gas Laws
 * Subject: Physics
 */

registerTopicQuiz('physics', 'gas-laws', [
    {
        question: "Boyle's law states that at constant temperature, the volume of a gas is:",
        options: ["Directly proportional to its pressure", "Inversely proportional to its pressure", "Directly proportional to the square of pressure", "Independent of pressure"],
        correct: 1,
        explanation: "Boyle's law: P₁V₁ = P₂V₂ (at constant temperature). The volume of a fixed mass of gas is inversely proportional to its pressure. As pressure increases, volume decreases."
    },
    {
        question: "Charles's law relates the volume and temperature of a gas at constant:",
        options: ["Pressure", "Volume", "Moles", "Density"],
        correct: 0,
        explanation: "Charles's law states that at constant pressure, the volume of a gas is directly proportional to its absolute temperature: V₁/T₁ = V₂/T₂. Temperature must be in Kelvin."
    },
    {
        question: "According to the pressure law, at constant volume, the pressure of a gas is:",
        options: ["Inversely proportional to temperature", "Directly proportional to temperature", "Independent of temperature", "Inversely proportional to the square of temperature"],
        correct: 1,
        explanation: "The pressure law (Gay-Lussac's law) states that at constant volume, pressure is directly proportional to absolute temperature: P₁/T₁ = P₂/T₂."
    },
    {
        question: "The absolute zero temperature corresponds to:",
        options: ["0°C", "0°F", "0 K", "273 K"],
        correct: 2,
        explanation: "Absolute zero is 0 Kelvin (K), which equals -273.15°C. At this temperature, the kinetic energy of molecules is minimum and all molecular motion theoretically stops."
    },
    {
        question: "A gas occupies 4 L at 300 K. What volume will it occupy at 600 K if pressure is constant?",
        options: ["2 L", "4 L", "6 L", "8 L"],
        correct: 3,
        explanation: "Using Charles's law: V₁/T₁ = V₂/T₂. Therefore, V₂ = V₁ × T₂/T₁ = 4 × 600/300 = 8 L. When temperature doubles (at constant pressure), volume also doubles."
    }
]);

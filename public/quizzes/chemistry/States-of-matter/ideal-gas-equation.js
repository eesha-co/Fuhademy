/**
 * Quiz: Ideal Gas Equation
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'ideal-gas-equation', [
    {
        question: "The ideal gas equation is expressed as:",
        options: ["PV = nRT", "PV = RT", "PT = nRV", "P/V = nRT"],
        correct: 0,
        explanation: "The ideal gas equation is PV = nRT, where P is pressure, V is volume, n is number of moles, R is the gas constant, and T is temperature."
    },
    {
        question: "What is the value of the gas constant R in dm³·atm·K⁻¹·mol⁻¹?",
        options: ["0.0821 dm³·atm·K⁻¹·mol⁻¹", "8.314 dm³·atm·K⁻¹·mol⁻¹", "0.821 dm³·atm·K⁻¹·mol⁻¹", "62.4 dm³·atm·K⁻¹·mol⁻¹"],
        correct: 0,
        explanation: "R = 0.0821 dm³·atm·K⁻¹·mol⁻¹ when pressure is in atm and volume in dm³. In SI units, R = 8.314 J·K⁻¹·mol⁻¹."
    },
    {
        question: "At STP, what volume does one mole of an ideal gas occupy?",
        options: ["22.4 dm³", "24.0 dm³", "20.0 dm³", "25.4 dm³"],
        correct: 0,
        explanation: "At STP (0°C and 1 atm), one mole of an ideal gas occupies 22.4 dm³ (or 22.4 L)."
    },
    {
        question: "Which of the following is NOT an assumption of the kinetic theory for an ideal gas?",
        options: ["Gas molecules have significant volume", "Gas molecules move randomly", "Collisions are perfectly elastic", "There are no intermolecular forces"],
        correct: 0,
        explanation: "An ideal gas assumes molecules have negligible volume compared to the container volume. Real gases deviate from ideal behavior because molecules do have volume."
    },
    {
        question: "If the temperature of a gas is doubled while keeping pressure constant, what happens to its volume?",
        options: ["Volume is halved", "Volume doubles", "Volume remains the same", "Volume quadruples"],
        correct: 1,
        explanation: "According to Charles's Law (V/T = constant), if temperature doubles at constant pressure, volume also doubles."
    }
]);

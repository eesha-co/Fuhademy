/**
 * Quiz: Gas Laws (Boyle's and Charles' Laws)
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'gas-laws-boyle-charles', [
    {
        question: "Boyle's Law states that at constant temperature:",
        options: [
            "P ∝ V",
            "P ∝ 1/V",
            "V ∝ T",
            "P ∝ T"
        ],
        correct: 1,
        explanation: "Boyle's Law states that pressure is inversely proportional to volume at constant temperature. P₁V₁ = P₂V₂."
    },
    {
        question: "Charles' Law states that at constant pressure:",
        options: [
            "V ∝ 1/T",
            "P ∝ T",
            "V ∝ T",
            "V ∝ P"
        ],
        correct: 2,
        explanation: "Charles' Law states that volume is directly proportional to absolute temperature (Kelvin) at constant pressure. V₁/T₁ = V₂/T₂."
    },
    {
        question: "A gas occupies 2.0 dm³ at 300 K. What volume will it occupy at 600 K at constant pressure?",
        options: ["1.0 dm³", "2.0 dm³", "4.0 dm³", "6.0 dm³"],
        correct: 2,
        explanation: "Using Charles' Law: V₁/T₁ = V₂/T₂ → 2.0/300 = V₂/600 → V₂ = 4.0 dm³. The volume doubles when temperature doubles."
    },
    {
        question: "If the pressure on a gas is doubled at constant temperature, the volume:",
        options: ["Doubles", "Halves", "Remains the same", "Triples"],
        correct: 1,
        explanation: "According to Boyle's Law (PV = constant), if pressure doubles, volume must halve to maintain the same product."
    },
    {
        question: "What temperature is absolute zero on the Celsius scale?",
        options: ["0°C", "-100°C", "-273°C", "-373°C"],
        correct: 2,
        explanation: "Absolute zero is 0 Kelvin, which equals -273°C. At this temperature, particles have minimum kinetic energy and molecular motion stops."
    }
]);

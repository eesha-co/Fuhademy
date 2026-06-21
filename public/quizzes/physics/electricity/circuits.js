/**
 * Quiz: Circuits
 * Subject: Physics
 */

registerTopicQuiz('physics', 'circuits', [
    {
        question: "In a series circuit, the total resistance is:",
        options: ["Less than the smallest resistance", "Equal to the sum of individual resistances", "The product of all resistances", "The reciprocal sum of resistances"],
        correct: 1,
        explanation: "In a series circuit, total resistance R = R₁ + R₂ + R₃ + ... The total resistance is the sum of all individual resistances and is greater than any single resistance."
    },
    {
        question: "In a parallel circuit, the total resistance is:",
        options: ["Greater than the largest resistance", "Equal to the sum of individual resistances", "Less than the smallest resistance", "The product of all resistances"],
        correct: 2,
        explanation: "In a parallel circuit, 1/R = 1/R₁ + 1/R₂ + ... The total resistance is always less than the smallest individual resistance because current has multiple paths."
    },
    {
        question: "Ohm's law states that:",
        options: ["V = I/R", "V = IR", "V = I²R", "V = R/I"],
        correct: 1,
        explanation: "Ohm's law states that the potential difference (V) across a conductor is directly proportional to the current (I) through it, provided temperature and other conditions remain constant: V = IR."
    },
    {
        question: "Three resistors of 2Ω, 4Ω, and 6Ω are connected in series. The total resistance is:",
        options: ["0.92 Ω", "4 Ω", "12 Ω", "48 Ω"],
        correct: 2,
        explanation: "For series connection: R = R₁ + R₂ + R₃ = 2 + 4 + 6 = 12 Ω."
    },
    {
        question: "A current of 2 A flows through a 5 Ω resistor. The potential difference across it is:",
        options: ["0.4 V", "2.5 V", "7 V", "10 V"],
        correct: 3,
        explanation: "Using Ohm's law: V = IR = 2 × 5 = 10 V. The potential difference across the resistor is 10 volts."
    }
]);

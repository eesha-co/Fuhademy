/**
 * Quiz: Power and Energy in Circuits
 * Subject: Physics
 */

registerTopicQuiz('physics', 'power-energy', [
    {
        question: "The power dissipated in a resistor is given by:",
        options: ["P = IR", "P = V/I", "P = I²R", "P = R/I"],
        correct: 2,
        explanation: "Power can be calculated using P = I²R, where I is current and R is resistance. Other equivalent formulas are P = VI and P = V²/R."
    },
    {
        question: "The unit of electrical energy is:",
        options: ["Watt", "Joule", "Volt", "Ampere"],
        correct: 1,
        explanation: "Electrical energy is measured in Joules (J). In practical terms, the kilowatt-hour (kWh) is commonly used for billing purposes: 1 kWh = 3.6 × 10⁶ J."
    },
    {
        question: "A 60 W bulb operates for 5 hours. The energy consumed is:",
        options: ["12 J", "300 J", "0.3 kWh", "300 kWh"],
        correct: 2,
        explanation: "Energy = Power × Time = 60 W × 5 h = 300 Wh = 0.3 kWh. In joules, this would be 0.3 × 3.6 × 10⁶ = 1.08 × 10⁶ J."
    },
    {
        question: "The commercial unit of electrical energy is:",
        options: ["Joule", "Watt", "Kilowatt-hour", "Volt-second"],
        correct: 2,
        explanation: "The kilowatt-hour (kWh) is the commercial unit of electrical energy used by power companies for billing. One kWh equals 3.6 megajoules (3.6 × 10⁶ J)."
    },
    {
        question: "When resistors are connected in series, the total power dissipated:",
        options: ["Is the same in each resistor", "Is shared by each resistor", "Is the sum of power in each resistor", "Is zero"],
        correct: 2,
        explanation: "In a series circuit, the total power dissipated equals the sum of power dissipated in each resistor: P_total = P₁ + P₂ + P₃ + ... The same current flows through all resistors."
    }
]);

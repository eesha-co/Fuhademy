/**
 * Quiz: Electrolysis Calculations
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'electrolysis-calculations', [
    {
        question: "A current of 2 A is passed through CuSO₄ solution for 30 minutes. What mass of copper is deposited? (Cu = 64 g/mol, F = 96500 C/mol)",
        options: ["0.59 g", "1.19 g", "2.38 g", "0.30 g"],
        correct: 1,
        explanation: "Q = It = 2 × 30 × 60 = 3600 C. Moles of electrons = 3600/96500 = 0.0373 mol. Mass of Cu = 0.0373 × 64/2 = 1.19 g."
    },
    {
        question: "How long will it take to deposit 10.8 g of silver from AgNO₃ solution using a current of 5 A? (Ag = 108 g/mol, F = 96500 C/mol)",
        options: ["965 seconds", "1930 seconds", "3860 seconds", "4825 seconds"],
        correct: 1,
        explanation: "Moles of Ag = 10.8/108 = 0.1 mol. Charge needed = 0.1 × 96500 = 9650 C (Ag⁺ + e⁻ → Ag). Time = Q/I = 9650/5 = 1930 seconds."
    },
    {
        question: "What volume of oxygen gas at STP is produced at the anode when 96500 coulombs are passed through acidified water?",
        options: ["22.4 dm³", "11.2 dm³", "5.6 dm³", "44.8 dm³"],
        correct: 2,
        explanation: "1 Faraday deposits 1 equivalent. 4OH⁻ → 2H₂O + O₂ + 4e⁻. So 4F produces 1 mol O₂. 1F produces 0.25 mol = 5.6 dm³ at STP."
    },
    {
        question: "During electrolysis, 0.5 g of metal M is deposited by 1528 C. If the atomic mass of M is 64, what is the charge on the metal ion?",
        options: ["+1", "+2", "+3", "+4"],
        correct: 1,
        explanation: "Moles of M = 0.5/64 = 0.00781 mol. Moles of electrons = 1528/96500 = 0.0158 mol. Ratio e⁻/M = 0.0158/0.00781 ≈ 2, so charge is +2."
    },
    {
        question: "A current of 0.5 A flows for 1 hour through molten lead(II) bromide. What mass of lead is deposited? (Pb = 207 g/mol, F = 96500 C/mol)",
        options: ["1.93 g", "3.86 g", "0.97 g", "0.48 g"],
        correct: 0,
        explanation: "Q = It = 0.5 × 3600 = 1800 C. Moles of electrons = 1800/96500 = 0.0187 mol. Pb²⁺ + 2e⁻ → Pb, so mass = 0.0187 × 207/2 = 1.93 g."
    }
]);

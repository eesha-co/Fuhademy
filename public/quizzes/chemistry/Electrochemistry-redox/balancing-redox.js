/**
 * Quiz: Balancing Redox Equations
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'balancing-redox', [
    {
        question: "The oxidation number of manganese in KMnO₄ is:",
        options: ["+4", "+5", "+6", "+7"],
        correct: 3,
        explanation: "In KMnO₄: K = +1, O = -2 each. Let Mn = x. Then +1 + x + 4(-2) = 0, so x = +7."
    },
    {
        question: "In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species is reduced?",
        options: ["Zn", "Cu²⁺", "Zn²⁺", "Cu"],
        correct: 1,
        explanation: "Cu²⁺ gains electrons (Cu²⁺ + 2e⁻ → Cu), so it is reduced. Reduction is the gain of electrons, and Cu²⁺ is the oxidizing agent."
    },
    {
        question: "When balancing redox equations in acidic medium, which species are added to balance oxygen atoms?",
        options: ["H⁺ ions", "H₂O molecules", "OH⁻ ions", "O₂ molecules"],
        correct: 1,
        explanation: "In acidic medium, H₂O molecules are added to balance oxygen atoms, and H⁺ ions are added to balance hydrogen atoms."
    },
    {
        question: "When balancing redox equations in alkaline medium, which species are added to balance hydrogen atoms?",
        options: ["H₂O only", "H⁺ ions only", "H₂O and OH⁻ ions", "H₂ gas"],
        correct: 2,
        explanation: "In alkaline medium, H₂O is added to balance oxygen, and both H₂O and OH⁻ are used to balance hydrogen atoms (adding H₂O to one side and OH⁻ to the other)."
    },
    {
        question: "In the half-reaction: Cr₂O₇²⁻ + 14H⁺ + ne⁻ → 2Cr³⁺ + 7H₂O, what is the value of n?",
        options: ["3", "4", "5", "6"],
        correct: 3,
        explanation: "Cr₂O₇²⁻ has 2 Cr atoms each at +6 = +12 total. 2Cr³⁺ has total +6. Change = 12 - 6 = 6 electrons gained. n = 6."
    }
]);

/**
 * Quiz: Calculating Equilibrium Constants
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'calculating-k', [
    {
        question: "For the reaction H₂ + I₂ ⇌ 2HI at equilibrium, if [H₂] = 0.1 M, [I₂] = 0.1 M, and [HI] = 0.8 M, what is Kc?",
        options: ["8", "64", "0.8", "0.064"],
        correct: 1,
        explanation: "Kc = [HI]²/[H₂][I₂] = (0.8)²/(0.1)(0.1) = 0.64/0.01 = 64."
    },
    {
        question: "If the initial concentration of a reactant is 1.0 M and at equilibrium 0.6 M remains, the amount reacted is:",
        options: ["0.6 M", "0.4 M", "1.0 M", "0.0 M"],
        correct: 1,
        explanation: "Amount reacted = Initial - Equilibrium = 1.0 - 0.6 = 0.4 M."
    },
    {
        question: "For the reaction PCl₅ ⇌ PCl₃ + Cl₂, if Kc = 0.04 and initial [PCl₅] = 1.0 M, what can be determined?",
        options: ["Products are favored", "Reactant is favored", "Equal amounts at equilibrium", "No reaction occurs"],
        correct: 1,
        explanation: "Kc = 0.04 < 1 indicates reactant is favored. At equilibrium, there will be more PCl₅ than PCl₃ and Cl₂."
    },
    {
        question: "In calculating Kc, solids and liquids are:",
        options: ["Included with concentration 1", "Excluded from the expression", "Included with their actual concentrations", "Treated the same as gases"],
        correct: 1,
        explanation: "Pure solids and liquids have constant concentrations and are excluded from the Kc expression. Only aqueous and gaseous species are included."
    },
    {
        question: "At a certain temperature, Kc for 2NO₂ ⇌ N₂O₄ is 1.15. If equilibrium [NO₂] = 0.5 M, find [N₂O₄].",
        options: ["0.29 M", "0.58 M", "1.15 M", "0.14 M"],
        correct: 0,
        explanation: "Kc = [N₂O₄]/[NO₂]² = 1.15. So [N₂O₄] = Kc × [NO₂]² = 1.15 × (0.5)² = 1.15 × 0.25 = 0.2875 ≈ 0.29 M."
    }
]);

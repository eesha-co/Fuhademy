/**
 * Quiz: Rate Laws
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'rate-laws', [
    {
        question: "The rate of a chemical reaction is expressed as:",
        options: ["Change in concentration per unit time", "Change in volume per unit time", "Change in temperature per unit time", "Total mass of products"],
        correct: 0,
        explanation: "Reaction rate is the change in concentration of a reactant or product per unit time, usually measured in mol dm⁻³ s⁻¹."
    },
    {
        question: "For a reaction A + B → products, if rate = k[A][B], the reaction is:",
        options: ["Zero order overall", "First order overall", "Second order overall", "Third order overall"],
        correct: 2,
        explanation: "The overall order is the sum of powers of concentration terms in the rate equation: 1 + 1 = 2, so it's second order overall."
    },
    {
        question: "In a first-order reaction, the half-life:",
        options: ["Depends on initial concentration", "Is constant and independent of concentration", "Increases with time", "Is twice the rate constant"],
        correct: 1,
        explanation: "For first-order reactions, half-life t½ = ln2/k = 0.693/k, which is constant and does not depend on initial concentration."
    },
    {
        question: "The rate constant k for a reaction:",
        options: ["Depends on concentration", "Depends on temperature", "Is always the same value", "Depends on volume"],
        correct: 1,
        explanation: "The rate constant k depends on temperature (Arrhenius equation: k = Ae^(-Ea/RT)) but is independent of concentration."
    },
    {
        question: "If doubling [A] doubles the rate while [B] is constant, and doubling [B] has no effect on rate, the rate equation is:",
        options: ["Rate = k[A][B]", "Rate = k[A]²[B]", "Rate = k[A]", "Rate = k[B]"],
        correct: 2,
        explanation: "Rate is proportional to [A]¹ (doubling [A] doubles rate) and [B]⁰ (changing [B] has no effect), so rate = k[A]."
    }
]);

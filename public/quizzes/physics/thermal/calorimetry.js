/**
 * Quiz: Calorimetry
 * Subject: Physics
 */

registerTopicQuiz('physics', 'calorimetry', [
    {
        question: "The specific heat capacity of a substance is defined as:",
        options: ["The heat required to raise its temperature by 1°C", "The heat required to raise 1 kg of the substance by 1°C", "The total heat content of the substance", "The temperature at which it melts"],
        correct: 1,
        explanation: "Specific heat capacity is the amount of heat required to raise the temperature of 1 kg of a substance by 1°C (or 1 K). Its unit is J/kg·K."
    },
    {
        question: "The heat required to raise 2 kg of water from 20°C to 50°C is: (specific heat capacity of water = 4200 J/kg·K)",
        options: ["84,000 J", "252,000 J", "420,000 J", "840,000 J"],
        correct: 1,
        explanation: "Heat Q = mcΔT = 2 × 4200 × (50 - 20) = 2 × 4200 × 30 = 252,000 J or 252 kJ."
    },
    {
        question: "The principle of calorimetry states that when a hot body is mixed with a cold body:",
        options: ["Heat flows from cold to hot", "Heat lost by the hot body equals heat gained by the cold body", "Total temperature remains constant", "Heat is destroyed"],
        correct: 1,
        explanation: "The principle of calorimetry states that in an isolated system, heat lost by the hot body equals heat gained by the cold body: m₁c₁(T₁ - T) = m₂c₂(T - T₂)."
    },
    {
        question: "The latent heat of fusion is the heat required to:",
        options: ["Raise the temperature of a solid by 1°C", "Change a solid to liquid at its melting point", "Change a liquid to gas", "Boil a liquid"],
        correct: 1,
        explanation: "Latent heat of fusion is the heat required to change 1 kg of a solid to liquid at its melting point, without any change in temperature."
    },
    {
        question: "During the melting of ice:",
        options: ["Temperature increases", "Temperature decreases", "Temperature remains constant", "Heat is not absorbed"],
        correct: 2,
        explanation: "During melting, the temperature remains constant at 0°C. All the absorbed heat (latent heat) is used to break the bonds between ice molecules, not to increase temperature."
    }
]);

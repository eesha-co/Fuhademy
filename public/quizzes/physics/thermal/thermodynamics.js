/**
 * Quiz: Thermodynamics
 * Subject: Physics
 */

registerTopicQuiz('physics', 'thermodynamics', [
    {
        question: "The first law of thermodynamics is based on the principle of conservation of:",
        options: ["Momentum", "Mass", "Energy", "Temperature"],
        correct: 2,
        explanation: "The first law of thermodynamics states that energy cannot be created or destroyed, only converted from one form to another. It is essentially the law of conservation of energy applied to thermal systems."
    },
    {
        question: "The specific heat capacity of a substance is defined as:",
        options: ["The heat required to raise the temperature by 1°C", "The heat required to raise the temperature of 1 kg by 1°C", "The heat required to melt the substance", "The heat required to vaporize the substance"],
        correct: 1,
        explanation: "Specific heat capacity (c) is the amount of heat required to raise the temperature of 1 kg of a substance by 1°C (or 1 K). The SI unit is J/(kg·K) or J/(kg·°C)."
    },
    {
        question: "The amount of heat required to change 2 kg of water from 20°C to 60°C is: (specific heat capacity of water = 4200 J/kg·K)",
        options: ["84,000 J", "168,000 J", "336,000 J", "504,000 J"],
        correct: 2,
        explanation: "Using Q = mcΔθ = 2 × 4200 × (60 - 20) = 2 × 4200 × 40 = 336,000 J."
    },
    {
        question: "During the melting of ice at 0°C:",
        options: ["Temperature increases", "Temperature decreases", "Temperature remains constant", "Heat is not absorbed"],
        correct: 2,
        explanation: "During melting (phase change), temperature remains constant at 0°C. The absorbed heat (latent heat) is used to break the bonds between molecules, changing the state from solid to liquid."
    },
    {
        question: "A heat engine converts:",
        options: ["Heat into work completely", "Work into heat", "Part of heat into work", "Electrical energy into heat"],
        correct: 2,
        explanation: "A heat engine converts part of the absorbed heat into mechanical work. According to the second law of thermodynamics, it is impossible to convert all heat into work; some heat must be rejected."
    }
]);

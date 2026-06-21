/**
 * Quiz: Standard Electrode Potentials
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'standard-potentials', [
    {
        question: "Standard electrode potential (E°) is measured under standard conditions of:",
        options: ["25°C, 1 M concentration, 1 atm pressure", "0°C, 1 M concentration, 1 atm pressure", "25°C, 0.1 M concentration, 1 atm pressure", "100°C, 1 M concentration, 1 atm pressure"],
        correct: 0,
        explanation: "Standard electrode potential is measured at 25°C (298 K), 1 M concentration for solutions, and 1 atm pressure for gases."
    },
    {
        question: "The standard hydrogen electrode (SHE) has an assigned E° value of:",
        options: ["+1.00 V", "0.00 V", "-1.00 V", "+0.34 V"],
        correct: 1,
        explanation: "The standard hydrogen electrode is assigned a potential of 0.00 V by convention and is used as the reference for all other electrode potentials."
    },
    {
        question: "A positive E° value indicates that the half-cell:",
        options: ["Is more easily oxidized than hydrogen", "Is more easily reduced than hydrogen", "Cannot react", "Is unstable"],
        correct: 1,
        explanation: "A positive E° means the species has a greater tendency to be reduced than H⁺ ions, making it a better oxidizing agent."
    },
    {
        question: "Which of the following has the strongest oxidizing ability?",
        options: ["Cu²⁺ (E° = +0.34 V)", "Zn²⁺ (E° = -0.76 V)", "F₂ (E° = +2.87 V)", "Fe²⁺ (E° = -0.44 V)"],
        correct: 2,
        explanation: "F₂ has the highest positive E° value (+2.87 V), making it the strongest oxidizing agent. It readily accepts electrons."
    },
    {
        question: "The EMF of a cell is calculated using:",
        options: ["E°cell = E°cathode - E°anode", "E°cell = E°anode - E°cathode", "E°cell = E°cathode + E°anode", "E°cell = E°anode × E°cathode"],
        correct: 0,
        explanation: "The cell EMF is calculated as E°cell = E°cathode - E°anode (reduction potential of cathode minus reduction potential of anode)."
    }
]);

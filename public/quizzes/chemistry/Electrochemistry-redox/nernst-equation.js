/**
 * Quiz: Nernst Equation
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'nernst-equation', [
    {
        question: "The Nernst equation relates electrode potential to:",
        options: ["Temperature only", "Concentration of ions", "Both temperature and concentration", "Pressure only"],
        correct: 2,
        explanation: "The Nernst equation E = E° - (RT/nF)lnQ relates electrode potential to both temperature and concentration of ions in solution."
    },
    {
        question: "In the Nernst equation at 25°C, the term RT/F equals approximately:",
        options: ["0.0257 V", "0.0591 V", "8.314 V", "96485 V"],
        correct: 0,
        explanation: "At 25°C, RT/F ≈ 0.0257 V. The equation is often written as E = E° - (0.0591/n)logQ where 0.0591 = 2.303 × RT/F."
    },
    {
        question: "What does 'n' represent in the Nernst equation?",
        options: ["Number of moles of solution", "Number of electrons transferred", "Number of ions", "Number of atoms"],
        correct: 1,
        explanation: "In the Nernst equation, 'n' represents the number of electrons transferred in the redox reaction."
    },
    {
        question: "According to the Nernst equation, increasing the concentration of products will:",
        options: ["Increase the electrode potential", "Decrease the electrode potential", "Not affect the electrode potential", "Make the potential zero"],
        correct: 1,
        explanation: "Increasing products increases Q (reaction quotient), and since E = E° - (RT/nF)lnQ, a larger Q leads to a lower electrode potential."
    },
    {
        question: "The Nernst equation can be used to calculate:",
        options: ["Only standard potentials", "Cell potentials under non-standard conditions", "Only temperature effects", "Only concentration of reactants"],
        correct: 1,
        explanation: "The Nernst equation is used to calculate cell potentials under non-standard conditions, when concentrations and temperatures differ from standard values."
    }
]);

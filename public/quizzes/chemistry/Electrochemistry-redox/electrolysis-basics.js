/**
 * Quiz: Electrolysis Basics
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'electrolysis-basics', [
    {
        question: "Electrolysis is the process of:",
        options: [
            "Generating electricity from chemical reactions",
            "Decomposing compounds using electricity",
            "Storing electrical energy",
            "Converting heat to electricity"
        ],
        correct: 1,
        explanation: "Electrolysis uses electrical energy to decompose ionic compounds into their elements. The compound must be molten or in aqueous solution."
    },
    {
        question: "During electrolysis, reduction occurs at the:",
        options: ["Anode", "Cathode", "Electrolyte", "Battery"],
        correct: 1,
        explanation: "Reduction (gain of electrons) occurs at the cathode (negative electrode). Remember: 'CatRed' - Cathode is where Reduction occurs."
    },
    {
        question: "In the electrolysis of molten sodium chloride, what forms at the cathode?",
        options: ["Sodium metal", "Chlorine gas", "Sodium chloride", "Hydrogen gas"],
        correct: 0,
        explanation: "At the cathode: Na⁺ + e⁻ → Na. Sodium ions gain electrons and form sodium metal. At the anode, chlorine gas is produced."
    },
    {
        question: "Which ions are discharged at the anode during electrolysis of dilute sodium chloride solution?",
        options: ["Na⁺ ions", "Cl⁻ ions", "OH⁻ ions", "H⁺ ions"],
        correct: 2,
        explanation: "In dilute NaCl solution, OH⁻ ions are discharged at the anode (4OH⁻ → 2H₂O + O₂ + 4e⁻) because they are easier to discharge than Cl⁻ in dilute solutions."
    },
    {
        question: "Electroplating is an application of electrolysis used to:",
        options: [
            "Purify metals",
            "Coat one metal with another",
            "Generate hydrogen",
            "Produce chlorine"
        ],
        correct: 1,
        explanation: "Electroplating uses electrolysis to deposit a thin layer of one metal onto another object for decoration, protection, or to improve properties."
    }
]);

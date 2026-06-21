/**
 * Quiz: Electronics
 * Subject: Physics
 */

registerTopicQuiz('physics', 'electronics', [
    {
        question: "A semiconductor that is doped with a pentavalent impurity becomes:",
        options: ["A p-type semiconductor", "An n-type semiconductor", "An intrinsic semiconductor", "An insulator"],
        correct: 1,
        explanation: "When a semiconductor like silicon is doped with a pentavalent impurity (e.g., phosphorus), it becomes n-type because the impurity donates extra electrons, providing negative charge carriers."
    },
    {
        question: "A diode allows current to flow:",
        options: ["In both directions equally", "Only in one direction (forward bias)", "Only in reverse bias", "When the voltage is zero"],
        correct: 1,
        explanation: "A diode is a semiconductor device that allows current to flow primarily in one direction (forward bias) and blocks current in the opposite direction (reverse bias)."
    },
    {
        question: "In a p-n junction diode, forward bias means:",
        options: ["Positive terminal connected to n-side", "Positive terminal connected to p-side", "Both terminals connected to the same side", "No voltage is applied"],
        correct: 1,
        explanation: "Forward bias occurs when the positive terminal of the battery is connected to the p-side and the negative terminal to the n-side. This reduces the depletion layer and allows current to flow."
    },
    {
        question: "A transistor has:",
        options: ["Two terminals", "Three terminals", "Four terminals", "Five terminals"],
        correct: 1,
        explanation: "A transistor has three terminals: emitter, base, and collector. It can be used as an amplifier or a switch in electronic circuits."
    },
    {
        question: "The primary function of a rectifier is to:",
        options: ["Amplify signals", "Convert AC to DC", "Convert DC to AC", "Store charge"],
        correct: 1,
        explanation: "A rectifier converts alternating current (AC) to direct current (DC). Diodes are commonly used in rectifier circuits to allow current flow in only one direction."
    }
]);

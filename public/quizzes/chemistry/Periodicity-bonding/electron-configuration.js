/**
 * Quiz: Electron Configuration
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'electron-configuration', [
    {
        question: "What is the electron configuration of sodium (atomic number 11)?",
        options: ["1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁵ 3s²", "1s² 2s² 2p⁶ 3s²", "1s² 2s² 2p⁷"],
        correct: 0,
        explanation: "Sodium has 11 electrons. Its electron configuration is 1s² 2s² 2p⁶ 3s¹, with one electron in the outermost 3s orbital."
    },
    {
        question: "Which principle states that electrons occupy the lowest energy orbitals first?",
        options: ["Hund's Rule", "Pauli Exclusion Principle", "Aufbau Principle", "Heisenberg Uncertainty Principle"],
        correct: 2,
        explanation: "The Aufbau Principle states that electrons fill orbitals starting from the lowest energy level to higher energy levels."
    },
    {
        question: "What is the maximum number of electrons that can occupy the 3rd energy level (n=3)?",
        options: ["8 electrons", "18 electrons", "32 electrons", "2 electrons"],
        correct: 1,
        explanation: "The maximum number of electrons in a shell is 2n². For n=3, this is 2(3)² = 18 electrons (3s² 3p⁶ 3d¹⁰)."
    },
    {
        question: "According to Hund's Rule, how are electrons arranged in degenerate orbitals?",
        options: ["They pair up in one orbital first", "They occupy orbitals singly with parallel spins before pairing", "They randomly distribute", "They fill higher energy orbitals first"],
        correct: 1,
        explanation: "Hund's Rule states that electrons occupy degenerate orbitals singly with parallel spins before pairing up, minimizing electron-electron repulsion."
    },
    {
        question: "The electron configuration of chloride ion (Cl⁻) is:",
        options: ["1s² 2s² 2p⁶ 3s² 3p⁴", "1s² 2s² 2p⁶ 3s² 3p⁵", "1s² 2s² 2p⁶ 3s² 3p⁶", "1s² 2s² 2p⁶ 3s² 3p³"],
        correct: 2,
        explanation: "Cl⁻ has 18 electrons (17 from Cl + 1 extra). Its configuration is 1s² 2s² 2p⁶ 3s² 3p⁶, giving it the same electron configuration as Argon."
    }
]);

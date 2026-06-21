/**
 * Quiz: Electromagnetic Induction
 * Subject: Physics
 */

registerTopicQuiz('physics', 'induction', [
    {
        question: "Electromagnetic induction was discovered by:",
        options: ["Newton", "Faraday", "Ohm", "Bohr"],
        correct: 1,
        explanation: "Michael Faraday discovered electromagnetic induction in 1831. He found that a changing magnetic field can induce an electric current in a conductor."
    },
    {
        question: "Faraday's law of electromagnetic induction states that the induced EMF is proportional to:",
        options: ["The magnetic field strength", "The rate of change of magnetic flux", "The resistance of the coil", "The length of the wire"],
        correct: 1,
        explanation: "Faraday's law: EMF = -N(dΦ/dt). The induced EMF is proportional to the rate of change of magnetic flux linkage through the coil."
    },
    {
        question: "Lenz's law states that the induced current:",
        options: ["Flows in the direction of the change", "Opposes the change causing it", "Has no relation to the change", "Flows clockwise always"],
        correct: 1,
        explanation: "Lenz's law states that the induced current flows in a direction such that its magnetic field opposes the change in magnetic flux that caused it. This is a consequence of energy conservation."
    },
    {
        question: "A transformer works on the principle of:",
        options: ["Self-induction", "Mutual induction", "Electrostatic induction", "Magnetic attraction"],
        correct: 1,
        explanation: "Transformers work on mutual induction - a changing current in the primary coil induces an EMF in the secondary coil through their shared magnetic field."
    },
    {
        question: "In a generator, mechanical energy is converted to:",
        options: ["Heat energy", "Chemical energy", "Electrical energy", "Nuclear energy"],
        correct: 2,
        explanation: "A generator converts mechanical energy (rotation) to electrical energy through electromagnetic induction. A coil rotates in a magnetic field, inducing an alternating current."
    }
]);

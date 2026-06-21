/**
 * Quiz: AC Basics
 * Subject: Physics
 */

registerTopicQuiz('physics', 'ac-basics', [
    {
        question: "Alternating current is different from direct current because:",
        options: ["AC has constant direction", "AC periodically reverses direction", "AC cannot be transmitted", "AC has higher voltage"],
        correct: 1,
        explanation: "Alternating current (AC) periodically reverses its direction of flow, unlike direct current (DC) which flows in one direction only. AC is the form of electricity supplied to homes."
    },
    {
        question: "The frequency of AC in most African countries is:",
        options: ["25 Hz", "50 Hz", "60 Hz", "100 Hz"],
        correct: 1,
        explanation: "Most African countries use 50 Hz as the standard frequency for AC power supply. This means the current changes direction 50 times per second."
    },
    {
        question: "The root mean square (RMS) value of an AC voltage is:",
        options: ["The peak value", "The effective value that produces the same heating effect as DC", "Half the peak value", "The average value"],
        correct: 1,
        explanation: "The RMS value of AC is the equivalent DC value that would produce the same heating effect in a resistor. For sinusoidal AC, V_rms = V_peak/√2 ≈ 0.707 × V_peak."
    },
    {
        question: "A transformer works on the principle of:",
        options: ["Self-induction", "Mutual induction", "Electrostatic induction", "Magnetic attraction"],
        correct: 1,
        explanation: "Transformers work on the principle of mutual induction. A changing current in the primary coil induces a voltage in the secondary coil through the magnetic flux linkage."
    },
    {
        question: "In a step-up transformer:",
        options: ["Voltage decreases, current increases", "Voltage increases, current decreases", "Both voltage and current increase", "Both voltage and current decrease"],
        correct: 1,
        explanation: "A step-up transformer increases voltage while decreasing current. Power remains approximately constant (ignoring losses): P = VI. If V increases, I must decrease proportionally."
    }
]);

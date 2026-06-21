/**
 * Quiz: Elastic Properties
 * Subject: Physics
 */

registerTopicQuiz('physics', 'elastic-properties', [
    {
        question: "Hooke's law states that the extension of a spring is:",
        options: ["Inversely proportional to the applied force", "Directly proportional to the applied force", "Independent of the applied force", "Proportional to the square of the force"],
        correct: 1,
        explanation: "Hooke's law states that within the elastic limit, the extension (or compression) of an elastic material is directly proportional to the applied force: F = kx."
    },
    {
        question: "The spring constant is measured in:",
        options: ["Newtons (N)", "Newtons per meter (N/m)", "Meters (m)", "Joules (J)"],
        correct: 1,
        explanation: "The spring constant k has units of N/m. It represents the force required to produce unit extension in the spring."
    },
    {
        question: "The elastic limit of a material is the point beyond which:",
        options: ["The material returns to its original shape", "Permanent deformation occurs", "No extension occurs", "The material breaks"],
        correct: 1,
        explanation: "The elastic limit is the maximum stress a material can withstand and still return to its original shape when the force is removed. Beyond this point, permanent deformation occurs."
    },
    {
        question: "Young's modulus is defined as:",
        options: ["Stress/strain", "Strain/stress", "Force × extension", "Force/extension"],
        correct: 0,
        explanation: "Young's modulus E = stress/strain = (F/A)/(ΔL/L). It measures the stiffness of a solid material and has units of pascals (Pa) or N/m²."
    },
    {
        question: "A wire of length 2 m extends by 1 mm under a load. The strain is:",
        options: ["0.5", "0.0005", "0.001", "0.002"],
        correct: 1,
        explanation: "Strain = extension/original length = 1 mm/2 m = 0.001 m/2 m = 0.0005. Strain is a dimensionless quantity."
    }
]);

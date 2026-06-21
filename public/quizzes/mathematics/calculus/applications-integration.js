/**
 * Quiz: Applications of Integration
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'applications-integration', [
    {
        question: "The area under a curve y = f(x) from x = a to x = b is given by:",
        options: ["f(b) - f(a)", "∫[a to b] f(x) dx", "f(b) + f(a)", "[f(x)]ᵇₐ"],
        correct: 1,
        explanation: "The definite integral ∫[a to b] f(x) dx gives the area under the curve from a to b."
    },
    {
        question: "The area bounded by y = x², x = 0, x = 2, and the x-axis is:",
        options: ["4", "8/3", "2", "4/3"],
        correct: 1,
        explanation: "Area = ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3 square units."
    },
    {
        question: "Integration is the reverse of:",
        options: ["Multiplication", "Differentiation", "Division", "Subtraction"],
        correct: 1,
        explanation: "Integration is the inverse operation of differentiation."
    },
    {
        question: "The volume of a solid of revolution is found using:",
        options: ["Differentiation", "Partial fractions", "Integration", "Limits"],
        correct: 2,
        explanation: "Volume = π∫y² dx for rotation about the x-axis uses integration."
    },
    {
        question: "If velocity v = 3t², the distance traveled from t = 0 to t = 2 is:",
        options: ["6 units", "8 units", "12 units", "24 units"],
        correct: 1,
        explanation: "Distance = ∫₀² 3t² dt = [t³]₀² = 8 - 0 = 8 units."
    }
]);

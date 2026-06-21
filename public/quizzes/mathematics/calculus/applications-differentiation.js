/**
 * Quiz: Applications of Differentiation
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'applications-differentiation', [
    {
        question: "At a maximum point, the gradient is:",
        options: ["Positive", "Negative", "Zero", "Undefined"],
        correct: 2,
        explanation: "At both maximum and minimum points, the derivative (gradient) equals zero."
    },
    {
        question: "If f'(x) changes from positive to negative at a point, that point is a:",
        options: ["Maximum", "Minimum", "Point of inflection", "Discontinuity"],
        correct: 0,
        explanation: "When the derivative changes from positive to negative, the function has a maximum."
    },
    {
        question: "The rate of change of volume of a sphere with respect to radius is:",
        options: ["4πr²", "4/3πr³", "2πr", "πr²"],
        correct: 0,
        explanation: "V = 4/3πr³, so dV/dr = 4πr² (surface area of the sphere)."
    },
    {
        question: "What does the second derivative tell us about a stationary point?",
        options: ["The value of the function", "Whether it's a maximum or minimum", "The gradient", "The domain"],
        correct: 1,
        explanation: "If f''(x) < 0, it's a maximum; if f''(x) > 0, it's a minimum."
    },
    {
        question: "The velocity of a particle is the derivative of:",
        options: ["Acceleration", "Displacement", "Force", "Momentum"],
        correct: 1,
        explanation: "Velocity = dx/dt, the rate of change of displacement with respect to time."
    }
]);

/**
 * Quiz: Gravitation
 * Subject: Physics
 */

registerTopicQuiz('physics', 'gravitation', [
    {
        question: "Newton's law of universal gravitation states that the force between two bodies is:",
        options: ["Directly proportional to the square of the distance between them", "Inversely proportional to the distance between them", "Inversely proportional to the square of the distance between them", "Independent of distance"],
        correct: 2,
        explanation: "Newton's law of gravitation: F = Gm₁m₂/r². The gravitational force is inversely proportional to the square of the distance between the centers of the two bodies."
    },
    {
        question: "The gravitational constant G has the value:",
        options: ["6.67 × 10⁻¹¹ N·m²/kg²", "9.8 N/kg", "6.67 × 10¹¹ N·m²/kg²", "9.8 m/s²"],
        correct: 0,
        explanation: "The universal gravitational constant G = 6.67 × 10⁻¹¹ N·m²/kg². This is a very small number, explaining why gravitational forces are weak between ordinary objects."
    },
    {
        question: "The acceleration due to gravity on Earth's surface is approximately:",
        options: ["6.67 m/s²", "9.8 m/s²", "10.8 m/s²", "3.14 m/s²"],
        correct: 1,
        explanation: "The acceleration due to gravity on Earth's surface is approximately 9.8 m/s² (often rounded to 10 m/s² for calculations). This value decreases with altitude."
    },
    {
        question: "The weight of an object on the Moon compared to its weight on Earth is:",
        options: ["The same", "About 1/6", "About 6 times", "Zero"],
        correct: 1,
        explanation: "The Moon's gravity is about 1/6 of Earth's gravity. An object that weighs 60 N on Earth would weigh about 10 N on the Moon."
    },
    {
        question: "The escape velocity from Earth is the minimum velocity needed to:",
        options: ["Orbit the Earth", "Escape Earth's gravitational field", "Reach the Moon", "Leave the atmosphere"],
        correct: 1,
        explanation: "Escape velocity is the minimum velocity needed for an object to escape the gravitational field of a planet without further propulsion. For Earth, it's approximately 11.2 km/s."
    }
]);

/**
 * Quiz: Vectors
 * Subject: Physics
 */

registerTopicQuiz('physics', 'vectors', [
    {
        question: "Which of the following is a vector quantity?",
        options: ["Mass", "Temperature", "Velocity", "Time"],
        correct: 2,
        explanation: "Velocity is a vector quantity because it has both magnitude (speed) and direction. Mass, temperature, and time are scalar quantities that have only magnitude."
    },
    {
        question: "Two forces of 3 N and 4 N act at right angles to each other. The resultant force is:",
        options: ["1 N", "5 N", "7 N", "12 N"],
        correct: 1,
        explanation: "Using Pythagoras theorem: Resultant = √(3² + 4²) = √(9 + 16) = √25 = 5 N. When vectors are at right angles, we use the Pythagorean theorem to find the resultant."
    },
    {
        question: "The process of splitting a vector into its components is called:",
        options: ["Vector addition", "Resolution of vectors", "Vector subtraction", "Vector multiplication"],
        correct: 1,
        explanation: "Resolution of vectors is the process of splitting a vector into its component vectors, usually horizontal and vertical components, which are perpendicular to each other."
    },
    {
        question: "If a vector of magnitude 10 N makes an angle of 30° with the horizontal, its horizontal component is:",
        options: ["5 N", "8.66 N", "10 N", "15 N"],
        correct: 1,
        explanation: "Horizontal component = 10 × cos 30° = 10 × 0.866 = 8.66 N. The horizontal component of a vector is given by V×cos θ, where θ is the angle with the horizontal."
    },
    {
        question: "The resultant of two vectors is maximum when they act:",
        options: ["In opposite directions", "At right angles", "In the same direction", "At 45° to each other"],
        correct: 2,
        explanation: "The resultant is maximum when vectors act in the same direction. In this case, the resultant equals the sum of the two magnitudes. When acting in opposite directions, the resultant is minimum."
    }
]);

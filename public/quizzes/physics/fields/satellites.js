/**
 * Quiz: Satellites
 * Subject: Physics
 */

registerTopicQuiz('physics', 'satellites', [
    {
        question: "A geostationary satellite orbits the Earth:",
        options: ["At any altitude", "With a period of 24 hours", "With a period of 12 hours", "In a polar orbit"],
        correct: 1,
        explanation: "A geostationary satellite has an orbital period of 24 hours, matching Earth's rotation. It appears stationary relative to a point on Earth's surface."
    },
    {
        question: "The minimum velocity required for a satellite to orbit the Earth is called:",
        options: ["Escape velocity", "Orbital velocity", "Terminal velocity", "Critical velocity"],
        correct: 1,
        explanation: "Orbital velocity is the minimum velocity needed for a satellite to maintain a stable orbit. For a low Earth orbit, it's about 7.8 km/s."
    },
    {
        question: "Communication satellites are placed in geostationary orbit because:",
        options: ["They are closer to Earth", "They remain above the same point on Earth", "They move faster", "They are cheaper to launch"],
        correct: 1,
        explanation: "Geostationary satellites remain above the same point on Earth's equator, making them ideal for communications as ground-based antennas don't need to track them."
    },
    {
        question: "The orbital velocity of a satellite depends on:",
        options: ["Its mass only", "The mass of the central body and orbital radius", "Its size", "Its shape"],
        correct: 1,
        explanation: "Orbital velocity v = √(GM/r), where M is the mass of the central body and r is the orbital radius. The satellite's mass does not affect its orbital velocity."
    },
    {
        question: "A satellite in a lower orbit has:",
        options: ["Lower velocity and longer period", "Higher velocity and shorter period", "Lower velocity and shorter period", "Higher velocity and longer period"],
        correct: 1,
        explanation: "Satellites in lower orbits have higher velocities and shorter periods. As altitude increases, orbital velocity decreases and the orbital period increases."
    }
]);

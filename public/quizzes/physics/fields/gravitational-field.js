/**
 * Quiz: Gravitational Field
 * Subject: Physics
 */

registerTopicQuiz('physics', 'gravitational-field', [
    {
        question: "The gravitational field strength on the surface of a planet depends on:",
        options: ["The planet's mass only", "The planet's radius only", "Both mass and radius of the planet", "The planet's temperature"],
        correct: 2,
        explanation: "Gravitational field strength g = GM/r², where M is the planet's mass and r is its radius. Both mass and radius determine the surface gravity."
    },
    {
        question: "As altitude increases, the gravitational field strength:",
        options: ["Increases", "Decreases", "Remains constant", "Becomes zero immediately"],
        correct: 1,
        explanation: "As altitude increases (distance from Earth's center increases), gravitational field strength decreases according to g = GM/r². The field becomes weaker but never zero."
    },
    {
        question: "The gravitational potential at a point is:",
        options: ["The force per unit mass", "The work done per unit mass to bring a mass from infinity to that point", "The acceleration due to gravity", "The speed of a satellite"],
        correct: 1,
        explanation: "Gravitational potential V = -GM/r is the work done per unit mass to bring a small mass from infinity to that point. It is always negative for gravitational fields."
    },
    {
        question: "Gravitational potential energy of a satellite in orbit is:",
        options: ["Positive", "Negative", "Zero", "Infinite"],
        correct: 1,
        explanation: "Gravitational potential energy U = -GMm/r is negative because work must be done against gravity to move the satellite to infinity. The negative sign indicates a bound system."
    },
    {
        question: "Equipotential surfaces are:",
        options: ["Surfaces where the field is zero", "Surfaces where the potential is constant", "Surfaces where the mass is constant", "The same as field lines"],
        correct: 1,
        explanation: "Equipotential surfaces are surfaces where the gravitational potential is constant. No work is done moving along an equipotential surface. They are perpendicular to field lines."
    }
]);

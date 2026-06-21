/**
 * Quiz: Viscosity
 * Subject: Physics
 */

registerTopicQuiz('physics', 'viscosity', [
    {
        question: "Viscosity is a measure of:",
        options: ["The density of a fluid", "A fluid's resistance to flow", "The temperature of a fluid", "The pressure of a fluid"],
        correct: 1,
        explanation: "Viscosity is a measure of a fluid's resistance to flow. High viscosity fluids (like honey) flow slowly, while low viscosity fluids (like water) flow easily."
    },
    {
        question: "The SI unit of dynamic viscosity is:",
        options: ["Pa·s (pascal-second)", "N/m", "kg/m³", "m/s²"],
        correct: 0,
        explanation: "The SI unit of dynamic viscosity is the pascal-second (Pa·s) or kg/(m·s). Another common unit is the poise (P), where 1 Pa·s = 10 P."
    },
    {
        question: "When temperature increases, the viscosity of a liquid:",
        options: ["Increases", "Decreases", "Remains the same", "Becomes zero"],
        correct: 1,
        explanation: "The viscosity of liquids decreases with increasing temperature. Higher temperatures give molecules more kinetic energy, reducing intermolecular forces and allowing easier flow."
    },
    {
        question: "Terminal velocity occurs when:",
        options: ["The object stops moving", "Weight equals the viscous drag force", "Velocity is zero", "Acceleration is maximum"],
        correct: 1,
        explanation: "Terminal velocity is reached when the weight of a falling object equals the upward viscous drag force. The object then falls at constant velocity with zero acceleration."
    },
    {
        question: "Stokes' law relates the viscous drag force on a sphere to:",
        options: ["Its mass only", "Its radius and velocity", "Its temperature", "Its volume only"],
        correct: 1,
        explanation: "Stokes' law: F = 6πηrv, where η is viscosity, r is radius, and v is velocity. The drag force is proportional to both the radius and velocity of the sphere."
    }
]);

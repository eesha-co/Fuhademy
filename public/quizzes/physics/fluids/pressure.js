/**
 * Quiz: Pressure in Fluids
 * Subject: Physics
 */

registerTopicQuiz('physics', 'pressure', [
    {
        question: "Pressure is defined as:",
        options: ["Force times area", "Force per unit area", "Area per unit force", "Mass per unit area"],
        correct: 1,
        explanation: "Pressure = Force/Area. The SI unit is the pascal (Pa), which equals 1 newton per square meter (N/m²)."
    },
    {
        question: "The pressure at a point in a liquid depends on:",
        options: ["The shape of the container", "The depth below the surface", "The volume of liquid", "The temperature"],
        correct: 1,
        explanation: "Pressure in a liquid depends on depth (h), density (ρ), and gravity (g): P = ρgh. The pressure is the same at all points at the same depth, regardless of the container shape."
    },
    {
        question: "The pressure at the bottom of a lake 10 m deep is: (density of water = 1000 kg/m³, g = 10 m/s²)",
        options: ["10,000 Pa", "100,000 Pa", "1,000,000 Pa", "10 Pa"],
        correct: 1,
        explanation: "P = ρgh = 1000 × 10 × 10 = 100,000 Pa = 100 kPa. This is in addition to atmospheric pressure at the surface."
    },
    {
        question: "Pascal's principle states that pressure applied to an enclosed fluid is:",
        options: ["Transmitted only downward", "Transmitted equally in all directions", "Not transmitted", "Decreased with distance"],
        correct: 1,
        explanation: "Pascal's principle states that pressure applied to an enclosed fluid is transmitted equally in all directions throughout the fluid. This is the basis of hydraulic systems."
    },
    {
        question: "Atmospheric pressure at sea level is approximately:",
        options: ["1 Pa", "100 Pa", "101,325 Pa", "1,000,000 Pa"],
        correct: 2,
        explanation: "Atmospheric pressure at sea level is about 101,325 Pa (1 atm), equivalent to 760 mm of mercury (mmHg) or 1.013 bar."
    }
]);

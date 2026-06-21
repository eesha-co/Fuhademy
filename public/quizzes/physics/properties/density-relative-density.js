/**
 * Quiz: Density and Relative Density
 * Subject: Physics
 */

registerTopicQuiz('physics', 'density-relative-density', [
    {
        question: "Density is defined as:",
        options: ["Mass per unit volume", "Volume per unit mass", "Weight per unit area", "Force per unit volume"],
        correct: 0,
        explanation: "Density (ρ) = mass/volume. The SI unit is kg/m³. It measures how much mass is contained in a given volume."
    },
    {
        question: "The density of water is 1000 kg/m³. A block of volume 0.5 m³ and mass 400 kg will:",
        options: ["Float in water", "Sink in water", "Stay suspended in water", "Cannot be determined"],
        correct: 0,
        explanation: "Density of block = 400/0.5 = 800 kg/m³. Since 800 < 1000 (density of water), the block is less dense than water and will float."
    },
    {
        question: "Relative density is the ratio of:",
        options: ["Density of water to density of substance", "Density of substance to density of water", "Mass of substance to its volume", "Weight to mass"],
        correct: 1,
        explanation: "Relative density (specific gravity) = density of substance/density of water. It is a dimensionless quantity that compares the density of a substance to that of water."
    },
    {
        question: "A relative density bottle is used to:",
        options: ["Measure volume only", "Measure mass only", "Determine relative density of liquids", "Measure temperature"],
        correct: 2,
        explanation: "A relative density bottle (specific gravity bottle) holds a fixed volume of liquid. By weighing the bottle empty, with water, and with the liquid, relative density can be calculated."
    },
    {
        question: "The density of a substance with relative density 2.5 is:",
        options: ["250 kg/m³", "1000 kg/m³", "2500 kg/m³", "25000 kg/m³"],
        correct: 2,
        explanation: "Relative density = density of substance/density of water. Therefore, density = relative density × density of water = 2.5 × 1000 = 2500 kg/m³."
    }
]);

/**
 * Quiz: Buoyancy
 * Subject: Physics
 */

registerTopicQuiz('physics', 'buoyancy', [
    {
        question: "Archimedes' principle states that the upthrust on a body immersed in a fluid equals:",
        options: ["The weight of the body", "The weight of the fluid displaced", "The volume of the body", "The density of the body"],
        correct: 1,
        explanation: "Archimedes' principle: The upthrust (buoyant force) on a body immersed in a fluid equals the weight of the fluid displaced by the body."
    },
    {
        question: "An object will float if:",
        options: ["Its density is greater than the fluid density", "Its density is less than the fluid density", "Its weight is greater than the upthrust", "It has no weight"],
        correct: 1,
        explanation: "An object floats if its average density is less than the fluid density. The weight of fluid displaced equals the object's weight at equilibrium."
    },
    {
        question: "A block of wood of volume 0.02 m³ floats in water. If the density of wood is 600 kg/m³, the volume submerged is:",
        options: ["0.008 m³", "0.012 m³", "0.02 m³", "0.033 m³"],
        correct: 1,
        explanation: "For a floating body, weight = upthrust. ρ_wood × V × g = ρ_water × V_submerged × g. V_submerged = (600/1000) × 0.02 = 0.012 m³."
    },
    {
        question: "A hydrometer is used to measure:",
        options: ["Temperature", "Pressure", "Relative density of liquids", "Viscosity"],
        correct: 2,
        explanation: "A hydrometer measures the relative density (specific gravity) of liquids. It floats at different levels depending on the density of the liquid."
    },
    {
        question: "When an object is fully submerged, the upthrust depends on:",
        options: ["The mass of the object", "The depth of submersion", "The volume of the object and fluid density", "The shape of the object"],
        correct: 2,
        explanation: "For a fully submerged object, upthrust = ρ_fluid × V_object × g. The upthrust depends on the volume of the object and the density of the fluid, not on depth or mass."
    }
]);

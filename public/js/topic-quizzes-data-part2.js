/**
 * ============================================
 * JUANOVA CORTEX - TOPIC QUIZZES DATA PART 2
 * Chemistry, Physics, and Biology
 * ============================================
 */

// Continue from Part 1 - Add to TopicQuizzesData object

// ==========================================
// CHEMISTRY
// ==========================================
TopicQuizzesData.chemistry = {
    
    // FOUNDATIONS
    'definition-classification': {
        title: 'Definition & Classification',
        questions: [
            {
                question: "Chemistry is the study of:",
                options: ["Living organisms only", "Matter and its changes", "Only physical objects", "Mathematical formulas"],
                correct: 1,
                explanation: "Chemistry is the scientific study of matter, its properties, and changes."
            },
            {
                question: "Which is a branch of chemistry?",
                options: ["Botany", "Organic chemistry", "Zoology", "Astronomy"],
                correct: 1,
                explanation: "Organic chemistry is the study of carbon-containing compounds."
            },
            {
                question: "Matter is defined as:",
                options: ["Only solids", "Anything that has mass and occupies space", "Only gases", "Only visible objects"],
                correct: 1,
                explanation: "Matter is anything with mass that takes up space."
            },
            {
                question: "Which is NOT a physical change?",
                options: ["Melting ice", "Tearing paper", "Burning wood", "Dissolving sugar"],
                correct: 2,
                explanation: "Burning wood is a chemical change (combustion)."
            },
            {
                question: "An example of a chemical change is:",
                options: ["Boiling water", "Rusting iron", "Melting butter", "Crushing a can"],
                correct: 1,
                explanation: "Rusting is oxidation - a chemical change."
            }
        ]
    },
    
    'particulate-nature': {
        title: 'Particulate Nature of Matter',
        questions: [
            {
                question: "The particle theory states that matter consists of:",
                options: ["Continuous substance", "Tiny particles in motion", "Only atoms", "Fixed particles"],
                correct: 1,
                explanation: "Particle theory: matter is made of tiny, constantly moving particles."
            },
            {
                question: "In solids, particles are:",
                options: ["Far apart and moving freely", "Close together and vibrating", "Moving very fast", "Not moving at all"],
                correct: 1,
                explanation: "Solid particles are closely packed and vibrate in fixed positions."
            },
            {
                question: "Diffusion occurs because:",
                options: ["Particles are stationary", "Particles move randomly", "Particles are attracted", "Matter is continuous"],
                correct: 1,
                explanation: "Diffusion results from random particle motion."
            },
            {
                question: "Which state of matter has particles farthest apart?",
                options: ["Solid", "Liquid", "Gas", "Plasma"],
                correct: 2,
                explanation: "Gas particles are farthest apart with most space between them."
            },
            {
                question: "Brownian motion demonstrates:",
                options: ["Particles don't move", "Particles are in constant random motion", "Particles are visible", "Matter is continuous"],
                correct: 1,
                explanation: "Brownian motion shows random particle movement."
            }
        ]
    },
    
    'atomic-structure': {
        title: 'Atomic Structure',
        questions: [
            {
                question: "The nucleus of an atom contains:",
                options: ["Electrons only", "Protons and electrons", "Protons and neutrons", "Neutrons only"],
                correct: 2,
                explanation: "The nucleus contains protons (positive) and neutrons (neutral)."
            },
            {
                question: "What is the mass number of an atom with 6 protons and 8 neutrons?",
                options: ["6", "8", "14", "2"],
                correct: 2,
                explanation: "Mass number = protons + neutrons = 6 + 8 = 14."
            },
            {
                question: "Which subatomic particle has a negative charge?",
                options: ["Proton", "Neutron", "Electron", "Nucleus"],
                correct: 2,
                explanation: "Electrons have a negative charge and orbit the nucleus."
            },
            {
                question: "Isotopes differ in their number of:",
                options: ["Protons", "Electrons", "Neutrons", "Energy levels"],
                correct: 2,
                explanation: "Isotopes have the same protons but different neutrons."
            },
            {
                question: "The atomic number equals the number of:",
                options: ["Neutrons", "Protons", "Electrons in outer shell", "Mass number"],
                correct: 1,
                explanation: "Atomic number = number of protons in the nucleus."
            }
        ]
    },
    
    'symbols-formulas': {
        title: 'Symbols & Formulas',
        questions: [
            {
                question: "The chemical symbol for sodium is:",
                options: ["So", "Sd", "Na", "Sn"],
                correct: 2,
                explanation: "Na comes from Latin 'natrium'."
            },
            {
                question: "The formula H₂O indicates:",
                options: ["1 hydrogen, 1 oxygen", "2 hydrogen, 1 oxygen", "1 hydrogen, 2 oxygen", "2 hydrogen, 2 oxygen"],
                correct: 1,
                explanation: "H₂O = 2 hydrogen atoms + 1 oxygen atom."
            },
            {
                question: "What is the symbol for iron?",
                options: ["Ir", "Fe", "I", "In"],
                correct: 1,
                explanation: "Fe comes from Latin 'ferrum'."
            },
            {
                question: "The formula for carbon dioxide is:",
                options: ["CO", "CO₂", "C₂O", "C₂O₂"],
                correct: 1,
                explanation: "Carbon dioxide = 1 carbon + 2 oxygen atoms."
            },
            {
                question: "NaCl is the formula for:",
                options: ["Sodium chloride", "Sodium chlorate", "Sodium carbonate", "Nitrogen chloride"],
                correct: 0,
                explanation: "NaCl is common table salt (sodium chloride)."
            }
        ]
    },
    
    'mole-concept': {
        title: 'Mole Concept',
        questions: [
            {
                question: "One mole contains how many particles?",
                options: ["6.02 × 10²³", "6.02 × 10²²", "6.02 × 10²⁴", "3.01 × 10²³"],
                correct: 0,
                explanation: "Avogadro's number = 6.02 × 10²³ particles per mole."
            },
            {
                question: "What is the molar mass of CO₂? (C=12, O=16)",
                options: ["28 g/mol", "44 g/mol", "32 g/mol", "48 g/mol"],
                correct: 1,
                explanation: "Molar mass = 12 + (16×2) = 44 g/mol."
            },
            {
                question: "How many moles in 36g of water? (H=1, O=16)",
                options: ["1 mole", "2 moles", "3 moles", "4 moles"],
                correct: 1,
                explanation: "Molar mass H₂O = 18 g/mol. 36÷18 = 2 moles."
            },
            {
                question: "The volume of 1 mole of gas at STP is:",
                options: ["11.2 L", "22.4 L", "44.8 L", "2.24 L"],
                correct: 1,
                explanation: "At STP, 1 mole of any gas occupies 22.4 L."
            },
            {
                question: "How many atoms are in 2 moles of carbon?",
                options: ["6.02 × 10²³", "1.20 × 10²⁴", "3.01 × 10²³", "12.04 × 10²⁴"],
                correct: 1,
                explanation: "2 moles × 6.02 × 10²³ = 1.20 × 10²⁴ atoms."
            }
        ]
    },
    
    'physical-chemical-changes': {
        title: 'Physical & Chemical Changes',
        questions: [
            {
                question: "Which is a physical change?",
                options: ["Rusting", "Burning", "Melting", "Cooking"],
                correct: 2,
                explanation: "Melting is a physical change - only state changes."
            },
            {
                question: "A chemical change produces:",
                options: ["Same substances", "New substances", "Only gases", "Only heat"],
                correct: 1,
                explanation: "Chemical changes form new substances with different properties."
            },
            {
                question: "Evidence of chemical change includes:",
                options: ["Change in shape", "Color change and gas production", "Change in size", "Change in state only"],
                correct: 1,
                explanation: "Color change, gas, precipitate, and heat indicate chemical change."
            },
            {
                question: "Dissolving salt in water is:",
                options: ["Chemical change", "Physical change", "Nuclear change", "No change"],
                correct: 1,
                explanation: "Dissolving is physical - salt can be recovered by evaporation."
            },
            {
                question: "Which is reversible?",
                options: ["Burning paper", "Rusting", "Melting ice", "Baking a cake"],
                correct: 2,
                explanation: "Physical changes like melting are usually reversible."
            }
        ]
    },
    
    // PERIODICITY & BONDING
    'periodic-table-overview': {
        title: 'Periodic Table Overview',
        questions: [
            {
                question: "Elements in the periodic table are arranged by:",
                options: ["Alphabetical order", "Atomic mass", "Atomic number", "Discovery date"],
                correct: 2,
                explanation: "Modern periodic table is arranged by atomic number."
            },
            {
                question: "Vertical columns in the periodic table are called:",
                options: ["Periods", "Groups", "Rows", "Blocks"],
                correct: 1,
                explanation: "Groups (families) are vertical columns with similar properties."
            },
            {
                question: "Elements in the same group have the same:",
                options: ["Atomic mass", "Number of shells", "Number of valence electrons", "Atomic radius"],
                correct: 2,
                explanation: "Group elements have the same number of valence electrons."
            },
            {
                question: "The horizontal rows are called:",
                options: ["Groups", "Periods", "Families", "Series"],
                correct: 1,
                explanation: "Periods are horizontal rows numbered 1-7."
            },
            {
                question: "Group 1 elements are called:",
                options: ["Halogens", "Alkali metals", "Noble gases", "Transition metals"],
                correct: 1,
                explanation: "Group 1 = Alkali metals (Li, Na, K, etc.)."
            }
        ]
    },
    
    'periodic-trends': {
        title: 'Periodic Trends',
        questions: [
            {
                question: "Atomic radius ___ across a period.",
                options: ["Increases", "Decreases", "Stays the same", "Varies randomly"],
                correct: 1,
                explanation: "Atomic radius decreases across a period (increased nuclear charge)."
            },
            {
                question: "Electronegativity ___ down a group.",
                options: ["Increases", "Decreases", "Stays constant", "Doubles"],
                correct: 1,
                explanation: "Electronegativity decreases down a group (farther from nucleus)."
            },
            {
                question: "The most reactive metal is in:",
                options: ["Group 1, Period 1", "Group 1, Period 7", "Group 17, Period 1", "Group 18"],
                correct: 1,
                explanation: "Francium (Group 1, Period 7) is the most reactive metal."
            },
            {
                question: "Ionization energy ___ across a period.",
                options: ["Decreases", "Increases", "Remains constant", "Varies"],
                correct: 1,
                explanation: "Ionization energy increases across a period."
            },
            {
                question: "Which element has the highest electronegativity?",
                options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"],
                correct: 2,
                explanation: "Fluorine has the highest electronegativity (4.0)."
            }
        ]
    },
    
    'ionic-bonding': {
        title: 'Ionic Bonding',
        questions: [
            {
                question: "Ionic bonds form between:",
                options: ["Two non-metals", "Metal and non-metal", "Two metals", "Noble gases"],
                correct: 1,
                explanation: "Ionic bonds form when metals transfer electrons to non-metals."
            },
            {
                question: "In ionic bonding, metals ___ electrons.",
                options: ["Gain", "Lose", "Share", "Keep"],
                correct: 1,
                explanation: "Metals lose electrons to form positive ions (cations)."
            },
            {
                question: "The formula for sodium oxide is:",
                options: ["NaO", "Na₂O", "NaO₂", "Na₂O₂"],
                correct: 1,
                explanation: "Na⁺ needs two for O²⁻, so Na₂O."
            },
            {
                question: "Ionic compounds have:",
                options: ["Low melting points", "High melting points", "Cannot melt", "Variable melting points"],
                correct: 1,
                explanation: "Strong ionic bonds give high melting points."
            },
            {
                question: "Ionic compounds conduct electricity when:",
                options: ["Solid", "Liquid or aqueous", "Never", "Always"],
                correct: 1,
                explanation: "Ionic compounds conduct when melted or dissolved (ions free to move)."
            }
        ]
    },
    
    'covalent-bonding': {
        title: 'Covalent Bonding',
        questions: [
            {
                question: "Covalent bonds involve:",
                options: ["Electron transfer", "Electron sharing", "Electron loss only", "No electrons"],
                correct: 1,
                explanation: "Covalent bonds form when atoms share electrons."
            },
            {
                question: "Covalent bonds typically form between:",
                options: ["Metals", "Non-metals", "Metal and non-metal", "Noble gases"],
                correct: 1,
                explanation: "Non-metals share electrons to form covalent bonds."
            },
            {
                question: "A double bond involves sharing:",
                options: ["1 pair of electrons", "2 pairs of electrons", "3 pairs of electrons", "4 pairs of electrons"],
                correct: 1,
                explanation: "Double bonds share 2 pairs (4 electrons)."
            },
            {
                question: "Which has covalent bonding?",
                options: ["NaCl", "MgO", "H₂O", "KBr"],
                correct: 2,
                explanation: "H₂O has covalent bonds (hydrogen and oxygen are non-metals)."
            },
            {
                question: "Covalent compounds generally have:",
                options: ["High melting points", "Low melting points", "Very high boiling points", "Metallic properties"],
                correct: 1,
                explanation: "Weak intermolecular forces give covalent compounds low melting points."
            }
        ]
    },
    
    // STATES OF MATTER
    'states-properties': {
        title: 'States of Matter',
        questions: [
            {
                question: "Which state has a definite shape and volume?",
                options: ["Liquid", "Gas", "Solid", "Plasma"],
                correct: 2,
                explanation: "Solids have definite shape and volume."
            },
            {
                question: "Gases have:",
                options: ["Definite shape", "Definite volume", "Neither definite shape nor volume", "Both definite shape and volume"],
                correct: 2,
                explanation: "Gases take the shape and volume of their container."
            },
            {
                question: "The change from solid to gas is called:",
                options: ["Evaporation", "Sublimation", "Condensation", "Deposition"],
                correct: 1,
                explanation: "Sublimation is solid directly to gas (e.g., dry ice)."
            },
            {
                question: "Liquids:",
                options: ["Have definite shape", "Have definite volume", "Have neither", "Are compressible"],
                correct: 1,
                explanation: "Liquids have definite volume but take container's shape."
            },
            {
                question: "Which state has particles with the most energy?",
                options: ["Solid", "Liquid", "Gas", "All have equal energy"],
                correct: 2,
                explanation: "Gas particles have the highest kinetic energy."
            }
        ]
    },
    
    'gas-laws-boyle-charles': {
        title: 'Gas Laws (Boyle & Charles)',
        questions: [
            {
                question: "Boyle's Law states that at constant temperature:",
                options: ["P ∝ V", "P ∝ 1/V", "V ∝ T", "P ∝ T"],
                correct: 1,
                explanation: "Boyle's Law: Pressure is inversely proportional to volume."
            },
            {
                question: "Charles's Law relates:",
                options: ["Pressure and volume", "Volume and temperature", "Pressure and temperature", "Moles and volume"],
                correct: 1,
                explanation: "Charles's Law: V ∝ T at constant pressure."
            },
            {
                question: "If gas volume is halved at constant temperature, pressure:",
                options: ["Halves", "Doubles", "Stays the same", "Triples"],
                correct: 1,
                explanation: "By Boyle's Law: P₁V₁ = P₂V₂, so P doubles when V halves."
            },
            {
                question: "At absolute zero (0 K):",
                options: ["Water boils", "Gas volume is zero", "Molecular motion stops", "Pressure is infinite"],
                correct: 2,
                explanation: "At 0 K (-273°C), all molecular motion stops."
            },
            {
                question: "A gas at 300 K is heated to 600 K at constant pressure. Volume:",
                options: ["Halves", "Doubles", "Triples", "Stays the same"],
                correct: 1,
                explanation: "By Charles's Law: V/T = constant, so V doubles when T doubles."
            }
        ]
    },
    
    // ACIDS & BASES
    'acids-bases-intro': {
        title: 'Acids & Bases Introduction',
        questions: [
            {
                question: "The pH of a neutral solution is:",
                options: ["0", "7", "14", "1"],
                correct: 1,
                explanation: "pH 7 is neutral (equal H⁺ and OH⁻)."
            },
            {
                question: "Which is a strong acid?",
                options: ["Acetic acid", "Hydrochloric acid", "Carbonic acid", "Citric acid"],
                correct: 1,
                explanation: "HCl completely dissociates in water - it's a strong acid."
            },
            {
                question: "Bases have pH:",
                options: ["Less than 7", "Equal to 7", "Greater than 7", "Equal to 0"],
                correct: 2,
                explanation: "Bases have pH > 7 due to high OH⁻ concentration."
            },
            {
                question: "Neutralization produces:",
                options: ["Acid only", "Salt and water", "Base only", "Gas only"],
                correct: 1,
                explanation: "Acid + Base → Salt + Water."
            },
            {
                question: "Litmus turns ___ in acid.",
                options: ["Blue", "Red", "Green", "Yellow"],
                correct: 1,
                explanation: "Acids turn blue litmus red."
            }
        ]
    },
    
    // ORGANIC CHEMISTRY
    'hydrocarbons': {
        title: 'Hydrocarbons',
        questions: [
            {
                question: "Hydrocarbons contain only:",
                options: ["Carbon and oxygen", "Carbon and hydrogen", "Carbon and nitrogen", "Hydrogen and oxygen"],
                correct: 1,
                explanation: "Hydrocarbons are compounds of carbon and hydrogen only."
            },
            {
                question: "Alkanes have the general formula:",
                options: ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"],
                correct: 1,
                explanation: "Alkanes: CₙH₂ₙ₊₂ (saturated hydrocarbons)."
            },
            {
                question: "Alkenes are characterized by:",
                options: ["Single bonds only", "At least one double bond", "Triple bonds", "Aromatic rings"],
                correct: 1,
                explanation: "Alkenes have C=C double bonds."
            },
            {
                question: "The simplest alkene is:",
                options: ["Methane", "Ethene", "Ethyne", "Propene"],
                correct: 1,
                explanation: "Ethene (C₂H₄) is the simplest alkene."
            },
            {
                question: "Which is unsaturated?",
                options: ["Methane", "Ethane", "Ethene", "Propane"],
                correct: 2,
                explanation: "Ethene has a double bond - it's unsaturated."
            }
        ]
    },
    
    'functional-groups': {
        title: 'Functional Groups',
        questions: [
            {
                question: "The -OH group is called:",
                options: ["Aldehyde", "Alcohol", "Carboxylic acid", "Ketone"],
                correct: 1,
                explanation: "The hydroxyl group (-OH) characterizes alcohols."
            },
            {
                question: "Carboxylic acids have the functional group:",
                options: ["-OH", "-CHO", "-COOH", "-CO-"],
                correct: 2,
                explanation: "Carboxylic acids have the -COOH group."
            },
            {
                question: "The functional group of aldehydes is:",
                options: ["-OH", "-CHO", "-CO-", "-COOH"],
                correct: 1,
                explanation: "Aldehydes have -CHO (carbonyl at end of chain)."
            },
            {
                question: "Esters have a ___ smell.",
                options: ["Pungent", "Sweet/fruity", "Rotten", "No smell"],
                correct: 1,
                explanation: "Esters are responsible for fruity smells."
            },
            {
                question: "Amines contain:",
                options: ["-OH group", "-NH₂ group", "-COOH group", "-CHO group"],
                correct: 1,
                explanation: "Amines have the -NH₂ functional group."
            }
        ]
    },
    
    // ELECTROCHEMISTRY
    'oxidation-reduction': {
        title: 'Oxidation & Reduction',
        questions: [
            {
                question: "Oxidation involves:",
                options: ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of neutrons"],
                correct: 1,
                explanation: "OIL RIG: Oxidation Is Loss of electrons."
            },
            {
                question: "Reduction involves:",
                options: ["Loss of electrons", "Gain of electrons", "Loss of protons", "No change"],
                correct: 1,
                explanation: "Reduction Is Gain of electrons."
            },
            {
                question: "In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, zinc is:",
                options: ["Reduced", "Oxidized", "Both oxidized and reduced", "Neither"],
                correct: 1,
                explanation: "Zn loses electrons (0 → +2), so it's oxidized."
            },
            {
                question: "The oxidizing agent:",
                options: ["Gets oxidized", "Gets reduced", "Remains unchanged", "Acts as catalyst"],
                correct: 1,
                explanation: "Oxidizing agent accepts electrons and gets reduced."
            },
            {
                question: "In the reaction Fe₂O₃ + 3CO → 2Fe + 3CO₂, CO is:",
                options: ["Oxidized", "Reduced", "Catalyst", "Product"],
                correct: 0,
                explanation: "CO (C = +2) → CO₂ (C = +4), carbon is oxidized."
            }
        ]
    },
    
    'electrolysis-basics': {
        title: 'Electrolysis Basics',
        questions: [
            {
                question: "Electrolysis requires:",
                options: ["Heat only", "Electric current", "Light", "Pressure"],
                correct: 1,
                explanation: "Electrolysis uses electricity to decompose compounds."
            },
            {
                question: "The cathode is:",
                options: ["Positive electrode", "Negative electrode", "Neutral electrode", "Non-reactive electrode"],
                correct: 1,
                explanation: "Cathode is negative (attracts cations)."
            },
            {
                question: "During electrolysis, reduction occurs at the:",
                options: ["Anode", "Cathode", "Electrolyte", "Battery"],
                correct: 1,
                explanation: "Reduction (gain of electrons) occurs at the cathode."
            },
            {
                question: "In electrolysis of water, the cathode produces:",
                options: ["Oxygen", "Hydrogen", "Both gases", "No gas"],
                correct: 1,
                explanation: "Hydrogen forms at cathode: 2H⁺ + 2e⁻ → H₂"
            },
            {
                question: "Electrolytes are substances that:",
                options: ["Conduct electricity when solid", "Conduct electricity when molten or dissolved", "Never conduct electricity", "Are always acids"],
                correct: 1,
                explanation: "Electrolytes conduct when ions are free to move."
            }
        ]
    },
    
    // EQUILIBRIUM
    'dynamic-equilibrium': {
        title: 'Dynamic Equilibrium',
        questions: [
            {
                question: "Dynamic equilibrium occurs when:",
                options: ["Reaction stops", "Forward and reverse rates are equal", "Reactants are used up", "Products are removed"],
                correct: 1,
                explanation: "At equilibrium, forward and reverse reaction rates are equal."
            },
            {
                question: "At equilibrium, concentrations:",
                options: ["Keep changing", "Remain constant", "Become zero", "Double"],
                correct: 1,
                explanation: "Equilibrium concentrations stay constant (but reactions continue)."
            },
            {
                question: "Le Chatelier's Principle states that a system at equilibrium will:",
                options: ["Stay unchanged", "Shift to oppose any change", "Stop reacting", "Reverse completely"],
                correct: 1,
                explanation: "Systems at equilibrium shift to counteract disturbances."
            },
            {
                question: "Increasing pressure favors the side with:",
                options: ["More moles of gas", "Fewer moles of gas", "Same moles of gas", "No gases"],
                correct: 1,
                explanation: "Higher pressure shifts equilibrium toward fewer gas molecules."
            },
            {
                question: "Adding a catalyst at equilibrium:",
                options: ["Shifts equilibrium right", "Shifts equilibrium left", "Reaches equilibrium faster", "No effect on equilibrium"],
                correct: 2,
                explanation: "Catalysts speed up reaching equilibrium but don't change position."
            }
        ]
    }
};

// ==========================================
// PHYSICS
// ==========================================
TopicQuizzesData.physics = {
    
    // FOUNDATIONS
    'measurement': {
        title: 'Measurement',
        questions: [
            {
                question: "The SI unit of length is:",
                options: ["Centimeter", "Meter", "Kilometer", "Millimeter"],
                correct: 1,
                explanation: "The meter (m) is the SI unit of length."
            },
            {
                question: "Which instrument measures small lengths precisely?",
                options: ["Meter rule", "Vernier caliper", "Tape measure", "Ruler"],
                correct: 1,
                explanation: "Vernier calipers measure to 0.01 cm precision."
            },
            {
                question: "The SI unit of mass is:",
                options: ["Gram", "Kilogram", "Pound", "Newton"],
                correct: 1,
                explanation: "The kilogram (kg) is the SI unit of mass."
            },
            {
                question: "Time is measured in SI units of:",
                options: ["Minutes", "Hours", "Seconds", "Days"],
                correct: 2,
                explanation: "The second (s) is the SI unit of time."
            },
            {
                question: "Which is a derived unit?",
                options: ["Meter", "Kilogram", "Newton", "Second"],
                correct: 2,
                explanation: "Newton (kg·m/s²) is derived from base units."
            }
        ]
    },
    
    'vectors': {
        title: 'Vectors',
        questions: [
            {
                question: "Which is a vector quantity?",
                options: ["Mass", "Temperature", "Velocity", "Time"],
                correct: 2,
                explanation: "Velocity has both magnitude and direction (vector)."
            },
            {
                question: "Scalar quantities have:",
                options: ["Magnitude only", "Direction only", "Both magnitude and direction", "Neither"],
                correct: 0,
                explanation: "Scalars have magnitude only (no direction)."
            },
            {
                question: "The resultant of two vectors is found by:",
                options: ["Subtracting magnitudes", "Adding them head-to-tail", "Dividing them", "Multiplying them"],
                correct: 1,
                explanation: "Vectors are added using the head-to-tail method."
            },
            {
                question: "Two forces of 3N and 4N act at right angles. The resultant is:",
                options: ["5N", "7N", "1N", "12N"],
                correct: 0,
                explanation: "Using Pythagoras: √(3² + 4²) = √25 = 5N"
            },
            {
                question: "A vector can be resolved into:",
                options: ["Only one component", "Two perpendicular components", "Only horizontal component", "Only vertical component"],
                correct: 1,
                explanation: "Vectors can be resolved into perpendicular components."
            }
        ]
    },
    
    // MECHANICS
    'linear-motion': {
        title: 'Linear Motion',
        questions: [
            {
                question: "Speed is:",
                options: ["A vector quantity", "A scalar quantity", "Always constant", "Measured in Newtons"],
                correct: 1,
                explanation: "Speed is scalar (magnitude only, no direction)."
            },
            {
                question: "Velocity differs from speed because it includes:",
                options: ["Time", "Direction", "Distance", "Acceleration"],
                correct: 1,
                explanation: "Velocity is speed with direction (vector)."
            },
            {
                question: "Acceleration is defined as:",
                options: ["Change in distance", "Rate of change of velocity", "Total distance traveled", "Final velocity"],
                correct: 1,
                explanation: "Acceleration = change in velocity / time."
            },
            {
                question: "If a car slows down, its acceleration is:",
                options: ["Positive", "Negative", "Zero", "Infinite"],
                correct: 1,
                explanation: "Deceleration is negative acceleration."
            },
            {
                question: "A body moving at constant velocity has:",
                options: ["Changing speed", "Zero acceleration", "Positive acceleration", "Negative acceleration"],
                correct: 1,
                explanation: "Constant velocity means no change, so acceleration = 0."
            }
        ]
    },
    
    'equations-of-motion': {
        title: 'Equations of Motion',
        questions: [
            {
                question: "The equation v = u + at relates:",
                options: ["Distance and time", "Velocity, acceleration, and time", "Force and mass", "Energy and work"],
                correct: 1,
                explanation: "v = u + at connects final velocity, initial velocity, acceleration, and time."
            },
            {
                question: "Using s = ut + ½at², find distance for u=0, a=2m/s², t=3s:",
                options: ["6m", "9m", "3m", "18m"],
                correct: 1,
                explanation: "s = 0 + ½(2)(9) = 9m"
            },
            {
                question: "If a body starts from rest and accelerates at 4m/s² for 5s, its final velocity is:",
                options: ["20 m/s", "10 m/s", "1.25 m/s", "40 m/s"],
                correct: 0,
                explanation: "v = u + at = 0 + 4(5) = 20 m/s"
            },
            {
                question: "The equation v² = u² + 2as is used when:",
                options: ["Time is known", "Time is not given", "Distance is not given", "Velocity is constant"],
                correct: 1,
                explanation: "v² = u² + 2as doesn't require time."
            },
            {
                question: "An object falls from rest. After 2s, its velocity is (g = 10 m/s²):",
                options: ["5 m/s", "10 m/s", "20 m/s", "40 m/s"],
                correct: 2,
                explanation: "v = gt = 10 × 2 = 20 m/s"
            }
        ]
    },
    
    'newtons-laws': {
        title: "Newton's Laws",
        questions: [
            {
                question: "Newton's First Law describes:",
                options: ["F = ma", "Action-reaction", "Inertia", "Gravity"],
                correct: 2,
                explanation: "Newton's First Law is the law of inertia."
            },
            {
                question: "According to F = ma, if force doubles and mass stays constant:",
                options: ["Acceleration halves", "Acceleration doubles", "Acceleration stays same", "No change"],
                correct: 1,
                explanation: "a = F/m, so doubling F doubles a."
            },
            {
                question: "Newton's Third Law states:",
                options: ["F = ma", "Every action has an equal and opposite reaction", "Inertia", "Gravity acts on all masses"],
                correct: 1,
                explanation: "Action-reaction pairs are equal and opposite."
            },
            {
                question: "A 5kg mass accelerates at 2m/s². The force is:",
                options: ["2.5 N", "10 N", "7 N", "3 N"],
                correct: 1,
                explanation: "F = ma = 5 × 2 = 10 N"
            },
            {
                question: "The unit of force is:",
                options: ["Kilogram", "Joule", "Newton", "Watt"],
                correct: 2,
                explanation: "Force is measured in Newtons (N)."
            }
        ]
    },
    
    'work-energy-power': {
        title: 'Work, Energy & Power',
        questions: [
            {
                question: "Work is done when:",
                options: ["Force is applied", "Object moves in direction of force", "Object is stationary", "Force is perpendicular to motion"],
                correct: 1,
                explanation: "Work = Force × Distance in direction of force."
            },
            {
                question: "The unit of work is:",
                options: ["Newton", "Watt", "Joule", "Kilogram"],
                correct: 2,
                explanation: "Work is measured in Joules (J)."
            },
            {
                question: "Kinetic energy depends on:",
                options: ["Height only", "Mass and velocity", "Position only", "Time"],
                correct: 1,
                explanation: "KE = ½mv² (mass and velocity)."
            },
            {
                question: "Potential energy is due to:",
                options: ["Motion", "Position or height", "Speed", "Temperature"],
                correct: 1,
                explanation: "PE = mgh (position/height)."
            },
            {
                question: "Power is defined as:",
                options: ["Force × distance", "Rate of doing work", "Energy stored", "Work done"],
                correct: 1,
                explanation: "Power = Work/Time (rate of doing work)."
            }
        ]
    },
    
    'momentum': {
        title: 'Momentum',
        questions: [
            {
                question: "Momentum is calculated as:",
                options: ["mass × velocity", "mass × acceleration", "force × time", "weight × height"],
                correct: 0,
                explanation: "Momentum (p) = mass × velocity."
            },
            {
                question: "The unit of momentum is:",
                options: ["N·s", "kg·m/s", "Both N·s and kg·m/s", "Joule"],
                correct: 2,
                explanation: "Momentum has units of kg·m/s or N·s."
            },
            {
                question: "Conservation of momentum applies when:",
                options: ["External forces act", "No external forces act", "Velocity is zero", "Mass changes"],
                correct: 1,
                explanation: "Momentum is conserved in isolated systems (no external forces)."
            },
            {
                question: "A 2kg object moving at 3m/s has momentum of:",
                options: ["5 kg·m/s", "6 kg·m/s", "1.5 kg·m/s", "9 kg·m/s"],
                correct: 1,
                explanation: "p = mv = 2 × 3 = 6 kg·m/s"
            },
            {
                question: "Impulse equals:",
                options: ["Force × distance", "Change in momentum", "Mass × acceleration", "Work done"],
                correct: 1,
                explanation: "Impulse = Force × time = change in momentum."
            }
        ]
    },
    
    // WAVES
    'wave-concepts': {
        title: 'Wave Concepts',
        questions: [
            {
                question: "Waves transfer:",
                options: ["Matter", "Energy", "Both matter and energy", "Neither"],
                correct: 1,
                explanation: "Waves transfer energy without transferring matter."
            },
            {
                question: "In transverse waves, particles vibrate:",
                options: ["Parallel to wave direction", "Perpendicular to wave direction", "In circles", "Not at all"],
                correct: 1,
                explanation: "Transverse waves have perpendicular vibration to wave direction."
            },
            {
                question: "Sound is a:",
                options: ["Transverse wave", "Longitudinal wave", "Electromagnetic wave", "None of the above"],
                correct: 1,
                explanation: "Sound is a longitudinal wave (parallel vibrations)."
            },
            {
                question: "Wave speed equals:",
                options: ["wavelength + frequency", "wavelength × frequency", "wavelength / frequency", "frequency / wavelength"],
                correct: 1,
                explanation: "v = fλ (speed = frequency × wavelength)."
            },
            {
                question: "Light is an example of:",
                options: ["Mechanical wave", "Electromagnetic wave", "Sound wave", "Water wave"],
                correct: 1,
                explanation: "Light is an electromagnetic wave."
            }
        ]
    },
    
    'sound': {
        title: 'Sound',
        questions: [
            {
                question: "Sound requires a:",
                options: ["Vacuum", "Medium", "Light source", "Magnetic field"],
                correct: 1,
                explanation: "Sound needs a medium (solid, liquid, or gas) to travel."
            },
            {
                question: "Sound cannot travel in:",
                options: ["Water", "Air", "Vacuum", "Steel"],
                correct: 2,
                explanation: "Sound cannot travel in a vacuum (no medium)."
            },
            {
                question: "The speed of sound in air at room temperature is approximately:",
                options: ["340 m/s", "3 × 10⁸ m/s", "1500 m/s", "5000 m/s"],
                correct: 0,
                explanation: "Sound travels about 340 m/s in air at 20°C."
            },
            {
                question: "Echo is caused by:",
                options: ["Refraction", "Reflection of sound", "Diffraction", "Interference"],
                correct: 1,
                explanation: "Echo is reflected sound."
            },
            {
                question: "Pitch depends on:",
                options: ["Amplitude", "Frequency", "Wavelength only", "Speed"],
                correct: 1,
                explanation: "Higher frequency = higher pitch."
            }
        ]
    },
    
    // ELECTRICITY
    'intro-to-electricity': {
        title: 'Introduction to Electricity',
        questions: [
            {
                question: "Electric current is measured in:",
                options: ["Volts", "Amperes", "Ohms", "Watts"],
                correct: 1,
                explanation: "Current is measured in Amperes (A)."
            },
            {
                question: "Potential difference is measured in:",
                options: ["Amperes", "Ohms", "Volts", "Watts"],
                correct: 2,
                explanation: "Voltage (potential difference) is measured in Volts (V)."
            },
            {
                question: "Resistance is measured in:",
                options: ["Volts", "Amperes", "Ohms", "Joules"],
                correct: 2,
                explanation: "Resistance is measured in Ohms (Ω)."
            },
            {
                question: "Ohm's Law states:",
                options: ["V = I/R", "V = IR", "V = I²R", "V = R/I"],
                correct: 1,
                explanation: "Ohm's Law: V = IR (Voltage = Current × Resistance)."
            },
            {
                question: "In a series circuit, current is:",
                options: ["Same everywhere", "Different at each point", "Zero", "Infinite"],
                correct: 0,
                explanation: "In series, current is the same through all components."
            }
        ]
    },
    
    'circuits': {
        title: 'Circuits',
        questions: [
            {
                question: "In parallel circuits, voltage across each branch is:",
                options: ["Different", "The same", "Zero", "Doubled"],
                correct: 1,
                explanation: "Parallel branches have equal voltage."
            },
            {
                question: "Total resistance in series:",
                options: ["Decreases", "Increases", "Stays the same", "Becomes zero"],
                correct: 1,
                explanation: "Series resistances add: R_total = R₁ + R₂ + ..."
            },
            {
                question: "Two resistors of 4Ω and 6Ω in series have total resistance:",
                options: ["2.4Ω", "10Ω", "24Ω", "1.5Ω"],
                correct: 1,
                explanation: "R = 4 + 6 = 10Ω in series."
            },
            {
                question: "In parallel, total resistance is:",
                options: ["Greater than individual resistances", "Less than individual resistances", "Equal to largest resistance", "Zero"],
                correct: 1,
                explanation: "Parallel resistance is always less than the smallest branch."
            },
            {
                question: "Ammeters are connected in:",
                options: ["Parallel", "Series", "Either way", "Not connected"],
                correct: 1,
                explanation: "Ammeters measure current and must be in series."
            }
        ]
    },
    
    // THERMAL PHYSICS
    'heat-temperature': {
        title: 'Heat & Temperature',
        questions: [
            {
                question: "Temperature is measured in:",
                options: ["Joules", "Kelvin or Celsius", "Watts", "Newtons"],
                correct: 1,
                explanation: "Temperature uses Kelvin (SI) or Celsius scales."
            },
            {
                question: "Heat is a form of:",
                options: ["Force", "Energy", "Power", "Temperature"],
                correct: 1,
                explanation: "Heat is energy transfer due to temperature difference."
            },
            {
                question: "0°C equals how many Kelvin?",
                options: ["0 K", "273 K", "-273 K", "100 K"],
                correct: 1,
                explanation: "K = °C + 273, so 0°C = 273 K."
            },
            {
                question: "Heat flows from:",
                options: ["Cold to hot", "Hot to cold", "Both directions equally", "Doesn't flow"],
                correct: 1,
                explanation: "Heat naturally flows from higher to lower temperature."
            },
            {
                question: "The SI unit of heat is:",
                options: ["Watt", "Joule", "Kelvin", "Celsius"],
                correct: 1,
                explanation: "Heat energy is measured in Joules (J)."
            }
        ]
    },
    
    'heat-transfer': {
        title: 'Heat Transfer',
        questions: [
            {
                question: "Which is NOT a method of heat transfer?",
                options: ["Conduction", "Convection", "Radiation", "Evaporation"],
                correct: 3,
                explanation: "The three methods are conduction, convection, and radiation."
            },
            {
                question: "Conduction occurs mainly in:",
                options: ["Solids", "Liquids", "Gases", "Vacuum"],
                correct: 0,
                explanation: "Conduction works best in solids (particles close together)."
            },
            {
                question: "Convection occurs in:",
                options: ["Solids only", "Fluids (liquids and gases)", "Vacuum", "Metals only"],
                correct: 1,
                explanation: "Convection requires fluid movement."
            },
            {
                question: "Radiation can travel through:",
                options: ["Solids only", "Vacuum", "Liquids only", "Nothing"],
                correct: 1,
                explanation: "Radiation (electromagnetic waves) needs no medium."
            },
            {
                question: "A black surface is a:",
                options: ["Good reflector", "Good absorber of heat", "Poor absorber", "Transparent"],
                correct: 1,
                explanation: "Black surfaces absorb and emit heat well."
            }
        ]
    },
    
    // OPTICS
    'reflection': {
        title: 'Reflection',
        questions: [
            {
                question: "The law of reflection states:",
                options: ["Angle of incidence > angle of reflection", "Angle of incidence = angle of reflection", "Angle of incidence < angle of reflection", "No relationship"],
                correct: 1,
                explanation: "Angle of incidence equals angle of reflection."
            },
            {
                question: "A plane mirror forms:",
                options: ["Real image", "Virtual image", "No image", "Inverted image"],
                correct: 1,
                explanation: "Plane mirrors form virtual, upright, same-size images."
            },
            {
                question: "The image in a plane mirror is:",
                options: ["Larger than object", "Smaller than object", "Same size as object", "Distorted"],
                correct: 2,
                explanation: "Plane mirror images are the same size as the object."
            },
            {
                question: "Light reflects off a mirror at 30° to the normal. The angle of reflection is:",
                options: ["15°", "30°", "60°", "90°"],
                correct: 1,
                explanation: "Angle of reflection = angle of incidence = 30°."
            },
            {
                question: "In a plane mirror, the image appears:",
                options: ["Behind the mirror", "In front of the mirror", "On the mirror surface", "Nowhere"],
                correct: 0,
                explanation: "Virtual images appear behind the mirror."
            }
        ]
    },
    
    'refraction': {
        title: 'Refraction',
        questions: [
            {
                question: "Refraction occurs when light:",
                options: ["Bounces off a surface", "Passes from one medium to another", "Stops moving", "Is absorbed"],
                correct: 1,
                explanation: "Refraction is bending of light at media boundaries."
            },
            {
                question: "When light enters a denser medium, it bends:",
                options: ["Away from the normal", "Toward the normal", "Doesn't bend", "Reflects back"],
                correct: 1,
                explanation: "Light slows down in denser media and bends toward normal."
            },
            {
                question: "The refractive index is calculated as:",
                options: ["speed in vacuum / speed in medium", "speed in medium / speed in vacuum", "wavelength × frequency", "angle of incidence / angle of refraction"],
                correct: 0,
                explanation: "n = c/v (speed of light in vacuum / speed in medium)."
            },
            {
                question: "Total internal reflection requires:",
                options: ["Light going to denser medium", "Light going to less dense medium at angle > critical angle", "Any angle of incidence", "Light in vacuum"],
                correct: 1,
                explanation: "TIR occurs when light in denser medium hits boundary at angle exceeding critical angle."
            },
            {
                question: "A swimming pool appears shallower because of:",
                options: ["Reflection", "Refraction", "Diffraction", "Absorption"],
                correct: 1,
                explanation: "Refraction bends light, making objects appear closer to surface."
            }
        ]
    },
    
    // MODERN PHYSICS
    'atomic-models': {
        title: 'Atomic Models',
        questions: [
            {
                question: "J.J. Thomson discovered:",
                options: ["Proton", "Neutron", "Electron", "Nucleus"],
                correct: 2,
                explanation: "Thomson discovered the electron (cathode ray experiments)."
            },
            {
                question: "Rutherford's experiment showed that atoms have:",
                options: ["Uniform positive charge", "A dense nucleus", "No empty space", "Only electrons"],
                correct: 1,
                explanation: "Rutherford's gold foil experiment revealed the nuclear atom."
            },
            {
                question: "Bohr's model proposed that electrons:",
                options: ["Move randomly", "Exist in fixed energy levels", "Are in the nucleus", "Don't move"],
                correct: 1,
                explanation: "Bohr proposed electrons orbit in discrete energy levels."
            },
            {
                question: "The nucleus contains:",
                options: ["Electrons only", "Protons and electrons", "Protons and neutrons", "Neutrons only"],
                correct: 2,
                explanation: "The nucleus contains protons and neutrons."
            },
            {
                question: "Most of an atom's mass is in:",
                options: ["Electrons", "Nucleus", "Empty space", "Orbits"],
                correct: 1,
                explanation: "The nucleus contains almost all atomic mass."
            }
        ]
    },
    
    'nuclear': {
        title: 'Nuclear Physics',
        questions: [
            {
                question: "Alpha particles are:",
                options: ["Electrons", "Helium nuclei", "Protons", "Neutrons"],
                correct: 1,
                explanation: "Alpha particles = 2 protons + 2 neutrons (helium nuclei)."
            },
            {
                question: "Beta particles are:",
                options: ["Helium nuclei", "Electrons", "Protons", "Photons"],
                correct: 1,
                explanation: "Beta particles are high-energy electrons."
            },
            {
                question: "Gamma rays are:",
                options: ["Particles", "Electromagnetic radiation", "Atoms", "Molecules"],
                correct: 1,
                explanation: "Gamma rays are high-energy electromagnetic waves."
            },
            {
                question: "Half-life is:",
                options: ["Time for all atoms to decay", "Time for half the atoms to decay", "Twice the decay time", "Unrelated to decay"],
                correct: 1,
                explanation: "Half-life = time for half of radioactive atoms to decay."
            },
            {
                question: "Nuclear fusion occurs in:",
                options: ["Nuclear power plants", "The Sun", "Atomic bombs", "Smoke detectors"],
                correct: 1,
                explanation: "The Sun's energy comes from nuclear fusion."
            }
        ]
    }
};

// ==========================================
// BIOLOGY
// ==========================================
TopicQuizzesData.biology = {
    
    // FOUNDATIONS
    'classification': {
        title: 'Classification',
        questions: [
            {
                question: "The scientific name of humans is:",
                options: ["Homo erectus", "Homo sapiens", "Pan troglodytes", "Human being"],
                correct: 1,
                explanation: "Homo sapiens is the binomial name for humans."
            },
            {
                question: "Binomial nomenclature uses:",
                options: ["Three names", "Genus and species", "Family and order", "Common names"],
                correct: 1,
                explanation: "Binomial = genus (capitalized) + species (lowercase)."
            },
            {
                question: "The correct hierarchy of classification is:",
                options: ["Kingdom, Phylum, Class, Order, Family, Genus, Species", "Species, Genus, Family, Order, Class, Phylum, Kingdom", "Kingdom, Class, Phylum, Order, Family, Genus, Species", "Phylum, Kingdom, Class, Order, Family, Genus, Species"],
                correct: 0,
                explanation: "King Philip Came Over For Good Soup = correct order."
            },
            {
                question: "Organisms in the same species can:",
                options: ["Live in different places only", "Interbreed and produce fertile offspring", "Never reproduce", "Only look similar"],
                correct: 1,
                explanation: "Species members can interbreed and produce fertile offspring."
            },
            {
                question: "Which kingdom contains bacteria?",
                options: ["Animalia", "Plantae", "Monera", "Fungi"],
                correct: 2,
                explanation: "Monera (or Prokaryotae) contains prokaryotes like bacteria."
            }
        ]
    },
    
    'cell-structure': {
        title: 'Cell Structure',
        questions: [
            {
                question: "Which organelle is the 'powerhouse' of the cell?",
                options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
                correct: 1,
                explanation: "Mitochondria produce ATP through cellular respiration."
            },
            {
                question: "The cell membrane is mainly composed of:",
                options: ["Proteins only", "Phospholipid bilayer", "Cellulose", "DNA"],
                correct: 1,
                explanation: "The cell membrane is a phospholipid bilayer with proteins."
            },
            {
                question: "Plant cells have which structure that animal cells lack?",
                options: ["Nucleus", "Cell wall", "Mitochondria", "Ribosome"],
                correct: 1,
                explanation: "Plant cells have a cellulose cell wall."
            },
            {
                question: "Chloroplasts are responsible for:",
                options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
                correct: 1,
                explanation: "Chloroplasts contain chlorophyll for photosynthesis."
            },
            {
                question: "The nucleus contains:",
                options: ["RNA only", "DNA and nucleolus", "Proteins only", "Water only"],
                correct: 1,
                explanation: "The nucleus contains genetic material (DNA) and nucleolus."
            }
        ]
    },
    
    'cell-properties': {
        title: 'Cell Properties',
        questions: [
            {
                question: "Osmosis is the movement of:",
                options: ["Water through a semipermeable membrane", "Sugar through membrane", "Any molecule through membrane", "Ions through channels"],
                correct: 0,
                explanation: "Osmosis is water movement from low to high solute concentration."
            },
            {
                question: "Diffusion occurs from:",
                options: ["Low to high concentration", "High to low concentration", "Any direction", "No movement"],
                correct: 1,
                explanation: "Diffusion moves particles from high to low concentration."
            },
            {
                question: "Active transport requires:",
                options: ["No energy", "ATP energy", "Only diffusion", "No membrane"],
                correct: 1,
                explanation: "Active transport uses ATP to move substances against gradient."
            },
            {
                question: "A cell in hypertonic solution will:",
                options: ["Swell", "Shrink", "Stay the same", "Burst"],
                correct: 1,
                explanation: "Water leaves the cell in hypertonic solution, causing shrinkage."
            },
            {
                question: "Plasmolysis occurs in:",
                options: ["Animal cells in hypotonic solution", "Plant cells in hypertonic solution", "Both cell types always", "Never occurs"],
                correct: 1,
                explanation: "Plasmolysis is when plant cell membrane pulls away from cell wall."
            }
        ]
    },
    
    // NUTRITION
    'food-substances': {
        title: 'Food Substances',
        questions: [
            {
                question: "Which is NOT a macronutrient?",
                options: ["Carbohydrates", "Proteins", "Vitamins", "Lipids"],
                correct: 2,
                explanation: "Vitamins are micronutrients needed in small amounts."
            },
            {
                question: "Carbohydrates are mainly used for:",
                options: ["Building muscles", "Providing energy", "Making enzymes", "Insulation"],
                correct: 1,
                explanation: "Carbohydrates are the primary energy source."
            },
            {
                question: "Proteins are made of:",
                options: ["Fatty acids", "Amino acids", "Glucose units", "Nucleotides"],
                correct: 1,
                explanation: "Proteins are polymers of amino acids."
            },
            {
                question: "Which vitamin deficiency causes scurvy?",
                options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
                correct: 2,
                explanation: "Vitamin C deficiency causes scurvy (bleeding gums)."
            },
            {
                question: "Calcium is important for:",
                options: ["Blood clotting", "Strong bones and teeth", "Oxygen transport", "Digestion"],
                correct: 1,
                explanation: "Calcium is essential for bones, teeth, and muscle function."
            }
        ]
    },
    
    'digestive-system': {
        title: 'Digestive System',
        questions: [
            {
                question: "Digestion begins in the:",
                options: ["Stomach", "Mouth", "Small intestine", "Liver"],
                correct: 1,
                explanation: "Digestion starts in the mouth with salivary amylase."
            },
            {
                question: "The stomach produces:",
                options: ["Bile", "Hydrochloric acid", "Insulin", "Amylase"],
                correct: 1,
                explanation: "The stomach secretes HCl to kill bacteria and activate pepsin."
            },
            {
                question: "Most absorption occurs in the:",
                options: ["Stomach", "Small intestine", "Large intestine", "Esophagus"],
                correct: 1,
                explanation: "The small intestine has villi for maximum absorption."
            },
            {
                question: "The liver produces:",
                options: ["Pepsin", "Bile", "Lipase", "Amylase"],
                correct: 1,
                explanation: "The liver produces bile for fat emulsification."
            },
            {
                question: "Villi increase:",
                options: ["Digestion rate", "Surface area for absorption", "Enzyme production", "Stomach capacity"],
                correct: 1,
                explanation: "Villi greatly increase absorption surface area."
            }
        ]
    },
    
    'photosynthesis': {
        title: 'Photosynthesis',
        questions: [
            {
                question: "The equation for photosynthesis is:",
                options: ["6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", "6O₂ + 6H₂O → C₆H₁₂O₆ + 6CO₂", "6CO₂ + 6O₂ → C₆H₁₂O₆ + 6H₂O"],
                correct: 0,
                explanation: "Photosynthesis: CO₂ + H₂O + light → glucose + oxygen."
            },
            {
                question: "Photosynthesis occurs in:",
                options: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosomes"],
                correct: 1,
                explanation: "Chloroplasts contain chlorophyll for photosynthesis."
            },
            {
                question: "Chlorophyll absorbs mainly:",
                options: ["Green light", "Red and blue light", "All light equally", "No light"],
                correct: 1,
                explanation: "Chlorophyll absorbs red and blue, reflecting green."
            },
            {
                question: "Light energy is converted to:",
                options: ["Sound energy", "Chemical energy", "Nuclear energy", "Mechanical energy"],
                correct: 1,
                explanation: "Light energy is stored as chemical energy in glucose."
            },
            {
                question: "Oxygen in photosynthesis comes from:",
                options: ["Carbon dioxide", "Water", "Glucose", "Air"],
                correct: 1,
                explanation: "The oxygen released comes from water (photolysis)."
            }
        ]
    },
    
    // TRANSPORT
    'transport-mechanisms': {
        title: 'Transport Mechanisms',
        questions: [
            {
                question: "In humans, blood is pumped by:",
                options: ["Lungs", "Heart", "Kidneys", "Liver"],
                correct: 1,
                explanation: "The heart pumps blood throughout the body."
            },
            {
                question: "Arteries carry blood:",
                options: ["Away from the heart", "Toward the heart", "In both directions", "Only to lungs"],
                correct: 0,
                explanation: "Arteries carry blood away from the heart."
            },
            {
                question: "Red blood cells contain:",
                options: ["White blood cells", "Hemoglobin", "Platelets", "Plasma"],
                correct: 1,
                explanation: "Hemoglobin in RBCs carries oxygen."
            },
            {
                question: "White blood cells function in:",
                options: ["Oxygen transport", "Immunity and defense", "Blood clotting", "Nutrient transport"],
                correct: 1,
                explanation: "White blood cells fight infection and provide immunity."
            },
            {
                question: "Platelets are involved in:",
                options: ["Oxygen transport", "Immunity", "Blood clotting", "Food transport"],
                correct: 2,
                explanation: "Platelets help form blood clots to stop bleeding."
            }
        ]
    },
    
    'gaseous-exchange': {
        title: 'Gaseous Exchange',
        questions: [
            {
                question: "In humans, gas exchange occurs in:",
                options: ["Bronchi", "Bronchioles", "Alveoli", "Trachea"],
                correct: 2,
                explanation: "Alveoli are the gas exchange surfaces in lungs."
            },
            {
                question: "The diaphragm:",
                options: ["Pumps blood", "Helps in breathing", "Produces enzymes", "Filters air"],
                correct: 1,
                explanation: "The diaphragm contracts for inhalation and relaxes for exhalation."
            },
            {
                question: "During inhalation, the diaphragm:",
                options: ["Relaxes and rises", "Contracts and flattens", "Stays the same", "Rotates"],
                correct: 1,
                explanation: "Contraction flattens the diaphragm, increasing chest volume."
            },
            {
                question: "Hemoglobin has high affinity for:",
                options: ["Carbon dioxide", "Oxygen", "Nitrogen", "All gases equally"],
                correct: 1,
                explanation: "Hemoglobin binds oxygen in lungs and releases it in tissues."
            },
            {
                question: "Alveoli have thin walls to:",
                options: ["Hold more air", "Allow rapid gas diffusion", "Prevent gas exchange", "Store oxygen"],
                correct: 1,
                explanation: "Thin walls minimize diffusion distance for gases."
            }
        ]
    },
    
    // REPRODUCTION
    'reproduction-types': {
        title: 'Reproduction Types',
        questions: [
            {
                question: "Asexual reproduction involves:",
                options: ["Two parents", "One parent only", "Gametes", "Fertilization"],
                correct: 1,
                explanation: "Asexual reproduction needs only one parent."
            },
            {
                question: "Sexual reproduction produces offspring that are:",
                options: ["Identical to parents", "Genetically different from parents", "Clones", "Smaller than parents"],
                correct: 1,
                explanation: "Sexual reproduction creates genetic variation."
            },
            {
                question: "Binary fission occurs in:",
                options: ["Humans", "Bacteria", "Flowering plants", "Fish"],
                correct: 1,
                explanation: "Binary fission is asexual reproduction in bacteria."
            },
            {
                question: "Pollination is part of reproduction in:",
                options: ["Animals", "Flowering plants", "Bacteria", "Fish"],
                correct: 1,
                explanation: "Pollination transfers pollen for plant reproduction."
            },
            {
                question: "Which is a method of asexual reproduction?",
                options: ["Fertilization", "Budding", "Meiosis", "Pollination"],
                correct: 1,
                explanation: "Budding is asexual reproduction (e.g., yeast, hydra)."
            }
        ]
    },
    
    'cell-division': {
        title: 'Cell Division',
        questions: [
            {
                question: "Mitosis produces:",
                options: ["Gametes", "Two identical daughter cells", "Four different cells", "No new cells"],
                correct: 1,
                explanation: "Mitosis produces two genetically identical daughter cells."
            },
            {
                question: "Meiosis produces:",
                options: ["Body cells", "Gametes with half chromosome number", "Identical cells", "Two daughter cells"],
                correct: 1,
                explanation: "Meiosis produces four gametes with haploid chromosome number."
            },
            {
                question: "Human body cells have how many chromosomes?",
                options: ["23", "46", "92", "12"],
                correct: 1,
                explanation: "Human somatic cells have 46 chromosomes (23 pairs)."
            },
            {
                question: "DNA replication occurs in:",
                options: ["Prophase", "Interphase", "Anaphase", "Telophase"],
                correct: 1,
                explanation: "DNA replicates during interphase (S phase)."
            },
            {
                question: "Crossing over occurs during:",
                options: ["Mitosis", "Meiosis", "Binary fission", "Interphase"],
                correct: 1,
                explanation: "Crossing over in meiosis creates genetic variation."
            }
        ]
    },
    
    // GENETICS
    'mendelian-inheritance': {
        title: 'Mendelian Inheritance',
        questions: [
            {
                question: "An allele is:",
                options: ["A type of chromosome", "A variant form of a gene", "A protein", "A trait"],
                correct: 1,
                explanation: "Alleles are different forms of the same gene."
            },
            {
                question: "A genotype represents:",
                options: ["Physical appearance", "Genetic makeup", "Behavior", "Environment"],
                correct: 1,
                explanation: "Genotype is the genetic constitution (e.g., Bb)."
            },
            {
                question: "A dominant allele is expressed when:",
                options: ["Only two copies present", "At least one copy present", "No copies present", "Always recessive"],
                correct: 1,
                explanation: "Dominant alleles are expressed even with one copy."
            },
            {
                question: "If B is dominant and b is recessive, Bb is:",
                options: ["Homozygous dominant", "Homozygous recessive", "Heterozygous", "Co-dominant"],
                correct: 2,
                explanation: "Heterozygous = one dominant and one recessive allele."
            },
            {
                question: "A cross between Bb × Bb would produce bb offspring:",
                options: ["0%", "25%", "50%", "75%"],
                correct: 1,
                explanation: "Bb × Bb gives 25% BB, 50% Bb, 25% bb."
            }
        ]
    },
    
    // ECOLOGY
    'ecological-concepts': {
        title: 'Ecological Concepts',
        questions: [
            {
                question: "A habitat is:",
                options: ["A group of organisms", "Where an organism lives", "What an organism eats", "A type of ecosystem"],
                correct: 1,
                explanation: "Habitat is the natural home of an organism."
            },
            {
                question: "An ecosystem includes:",
                options: ["Only living things", "Only non-living things", "Both living and non-living components", "Only plants"],
                correct: 2,
                explanation: "Ecosystem = biotic + abiotic factors."
            },
            {
                question: "Producers in a food chain are:",
                options: ["Herbivores", "Carnivores", "Plants that photosynthesize", "Decomposers"],
                correct: 2,
                explanation: "Producers make their own food through photosynthesis."
            },
            {
                question: "Primary consumers are:",
                options: ["Plants", "Herbivores", "Carnivores", "Decomposers"],
                correct: 1,
                explanation: "Primary consumers eat producers (plants)."
            },
            {
                question: "Energy flows through an ecosystem:",
                options: ["In cycles", "In one direction only", "Back and forth", "Doesn't flow"],
                correct: 1,
                explanation: "Energy flows one way: producers → consumers → decomposers."
            }
        ]
    },
    
    'population-ecology': {
        title: 'Population Ecology',
        questions: [
            {
                question: "Population density refers to:",
                options: ["Total number of organisms", "Number per unit area", "Birth rate only", "Death rate only"],
                correct: 1,
                explanation: "Population density = number per unit area/volume."
            },
            {
                question: "Factors affecting population growth include:",
                options: ["Only birth rate", "Birth rate, death rate, immigration, emigration", "Only death rate", "Only immigration"],
                correct: 1,
                explanation: "Population change = (births + immigration) - (deaths + emigration)."
            },
            {
                question: "Carrying capacity is:",
                options: ["Maximum birth rate", "Maximum population an environment can support", "Minimum population", "Growth rate"],
                correct: 1,
                explanation: "Carrying capacity is the maximum sustainable population."
            },
            {
                question: "A population pyramid shows:",
                options: ["Food chains", "Age and sex distribution", "Climate", "Evolution"],
                correct: 1,
                explanation: "Population pyramids display age structure and gender."
            },
            {
                question: "Exponential growth occurs when:",
                options: ["Resources are limited", "Resources are abundant", "Population is declining", "Death rate is high"],
                correct: 1,
                explanation: "Exponential growth happens with unlimited resources."
            }
        ]
    },
    
    // REGULATION
    'homeostasis': {
        title: 'Homeostasis',
        questions: [
            {
                question: "Homeostasis is the maintenance of:",
                options: ["External environment", "Internal environment within narrow limits", "Body temperature only", "Blood glucose only"],
                correct: 1,
                explanation: "Homeostasis maintains stable internal conditions."
            },
            {
                question: "Blood glucose is regulated by:",
                options: ["Thyroid gland", "Pancreas (insulin and glucagon)", "Pituitary gland", "Adrenal gland"],
                correct: 1,
                explanation: "Pancreas secretes insulin (lowers) and glucagon (raises) blood glucose."
            },
            {
                question: "Body temperature is regulated by the:",
                options: ["Pancreas", "Hypothalamus", "Liver", "Kidneys"],
                correct: 1,
                explanation: "The hypothalamus is the body's thermostat."
            },
            {
                question: "When body temperature rises, blood vessels in the skin:",
                options: ["Constrict", "Dilate", "Disappear", "Do nothing"],
                correct: 1,
                explanation: "Vasodilation increases heat loss through skin."
            },
            {
                question: "Negative feedback means:",
                options: ["Amplifying a change", "Reversing a change to maintain balance", "Stopping all responses", "No response"],
                correct: 1,
                explanation: "Negative feedback reverses changes to restore equilibrium."
            }
        ]
    },
    
    'nervous-coordination': {
        title: 'Nervous Coordination',
        questions: [
            {
                question: "The central nervous system consists of:",
                options: ["Brain and spinal cord", "Nerves only", "Muscles", "Glands"],
                correct: 0,
                explanation: "CNS = brain + spinal cord."
            },
            {
                question: "Neurons transmit impulses:",
                options: ["Electrically and chemically", "Only electrically", "Only chemically", "Mechanically"],
                correct: 0,
                explanation: "Impulses travel electrically in neurons, chemically at synapses."
            },
            {
                question: "A synapse is:",
                options: ["A type of neuron", "A gap between neurons", "Part of the brain", "A muscle"],
                correct: 1,
                explanation: "Synapses are junctions between neurons."
            },
            {
                question: "Reflex actions are:",
                options: ["Learned responses", "Automatic, rapid responses", "Slow responses", "Voluntary actions"],
                correct: 1,
                explanation: "Reflexes are automatic and don't involve conscious thought."
            },
            {
                question: "The myelin sheath:",
                options: ["Slows impulse transmission", "Insulates and speeds up transmission", "Has no function", "Destroys neurons"],
                correct: 1,
                explanation: "Myelin insulates axons and speeds impulse transmission."
            }
        ]
    },
    
    'hormonal-coordination': {
        title: 'Hormonal Coordination',
        questions: [
            {
                question: "Hormones are:",
                options: ["Electrical signals", "Chemical messengers", "Nerve impulses", "Enzymes"],
                correct: 1,
                explanation: "Hormones are chemical messengers transported by blood."
            },
            {
                question: "The pituitary gland is called the 'master gland' because it:",
                options: ["Is the largest gland", "Controls other endocrine glands", "Produces all hormones", "Is in the brain"],
                correct: 1,
                explanation: "Pituitary secretes hormones that regulate other glands."
            },
            {
                question: "Adrenaline is produced by:",
                options: ["Thyroid gland", "Adrenal gland", "Pituitary gland", "Pancreas"],
                correct: 1,
                explanation: "Adrenal glands produce adrenaline for 'fight or flight'."
            },
            {
                question: "Insulin deficiency causes:",
                options: ["Hypoglycemia", "Diabetes mellitus", "Goiter", "Dwarfism"],
                correct: 1,
                explanation: "Insulin deficiency leads to diabetes mellitus."
            },
            {
                question: "Compared to nervous responses, hormonal responses are:",
                options: ["Faster and short-lasting", "Slower but longer-lasting", "Same speed", "Never occur"],
                correct: 1,
                explanation: "Hormonal effects are slower but last longer than nerve impulses."
            }
        ]
    }
};

// Export for use
console.log('✅ Topic Quizzes Data Part 2 loaded');

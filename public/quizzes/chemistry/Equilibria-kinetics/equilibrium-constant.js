/**
 * Quiz: Equilibrium Constant
 * Subject: Chemistry
 */

registerTopicQuiz('chemistry', 'equilibrium-constant', [
    {
        question: "For the reaction aA + bB ⇌ cC + dD, the equilibrium constant Kc is expressed as:",
        options: ["[C]^c[D]^d/[A]^a[B]^b", "[A]^a[B]^b/[C]^c[D]^d", "[A][B]/[C][D]", "[C][D]/[A][B]"],
        correct: 0,
        explanation: "Kc = [products]^(coefficients)/[reactants]^(coefficients) = [C]^c[D]^d/[A]^a[B]^b, where concentrations are at equilibrium."
    },
    {
        question: "If Kc is much greater than 1, it indicates that:",
        options: ["Reactants are favored at equilibrium", "Products are favored at equilibrium", "Equal amounts of reactants and products", "No reaction occurs"],
        correct: 1,
        explanation: "A large Kc means the numerator ([products]) is larger than the denominator, indicating products are favored at equilibrium."
    },
    {
        question: "For the reaction 2SO₂ + O₂ ⇌ 2SO₃, the equilibrium constant expression is:",
        options: ["[SO₃]²/[SO₂]²[O₂]", "[SO₂]²[O₂]/[SO₃]²", "[SO₃]/[SO₂][O₂]", "[SO₂][O₂]/[SO₃]"],
        correct: 0,
        explanation: "Kc = [SO₃]²/([SO₂]²[O₂]). The coefficients in the balanced equation become powers in the equilibrium expression."
    },
    {
        question: "The equilibrium constant Kp is used for:",
        options: ["Concentrations in mol/dm³", "Partial pressures of gases", "Liquid phase reactions only", "Solid phase reactions"],
        correct: 1,
        explanation: "Kp uses partial pressures of gases instead of concentrations. For gas-phase reactions, Kp = (P_C)^c(P_D)^d/(P_A)^a(P_B)^b."
    },
    {
        question: "Adding a catalyst to a reaction at equilibrium:",
        options: ["Increases Kc", "Decreases Kc", "Has no effect on Kc", "Changes the products formed"],
        correct: 2,
        explanation: "A catalyst speeds up both forward and backward reactions equally, helping equilibrium be reached faster, but does not affect Kc or the position of equilibrium."
    }
]);

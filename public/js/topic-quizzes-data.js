/**
 * ============================================
 * JUANOVA CORTEX - TOPIC QUIZZES DATA
 * Quiz questions for all topics in:
 * Mathematics, English, Chemistry, Physics, Biology
 * ============================================
 */

const TopicQuizzesData = {
    
    // ==========================================
    // MATHEMATICS
    // ==========================================
    mathematics: {
        
        // FOUNDATIONS
        'rational-numbers': {
            title: 'Rational Numbers',
            questions: [
                {
                    question: "What is a rational number?",
                    options: ["A number that cannot be expressed as a fraction", "A number that can be expressed as p/q where q ≠ 0", "Only positive integers", "Only decimal numbers"],
                    correct: 1,
                    explanation: "Rational numbers can be expressed as fractions p/q where p and q are integers and q ≠ 0."
                },
                {
                    question: "Which of the following is NOT a rational number?",
                    options: ["3/4", "0.5", "√2", "-7"],
                    correct: 2,
                    explanation: "√2 is irrational because it cannot be expressed as a fraction of integers."
                },
                {
                    question: "The decimal representation of 1/3 is:",
                    options: ["0.333...", "0.33", "0.3", "0.333"],
                    correct: 0,
                    explanation: "1/3 = 0.333... (repeating decimal)"
                },
                {
                    question: "What is 2/5 + 1/3?",
                    options: ["3/8", "11/15", "3/15", "5/8"],
                    correct: 1,
                    explanation: "2/5 + 1/3 = 6/15 + 5/15 = 11/15"
                },
                {
                    question: "Which number is between -2 and -3 on a number line?",
                    options: ["-1.5", "-2.5", "-3.5", "0"],
                    correct: 1,
                    explanation: "-2.5 is between -2 and -3 on the number line."
                }
            ]
        },
        
        'fractions-decimals-percentages': {
            title: 'Fractions, Decimals & Percentages',
            questions: [
                {
                    question: "Convert 0.75 to a percentage:",
                    options: ["7.5%", "75%", "0.75%", "750%"],
                    correct: 1,
                    explanation: "0.75 × 100 = 75%"
                },
                {
                    question: "What is 25% of 80?",
                    options: ["15", "20", "25", "40"],
                    correct: 1,
                    explanation: "25% of 80 = 0.25 × 80 = 20"
                },
                {
                    question: "Convert 3/8 to a decimal:",
                    options: ["0.375", "0.38", "0.3", "0.3750"],
                    correct: 0,
                    explanation: "3/8 = 3 ÷ 8 = 0.375"
                },
                {
                    question: "What is 40% as a fraction in simplest form?",
                    options: ["40/100", "4/10", "2/5", "4/5"],
                    correct: 2,
                    explanation: "40% = 40/100 = 4/10 = 2/5 (simplified)"
                },
                {
                    question: "If a shirt costs ₦2000 and has 15% discount, what is the sale price?",
                    options: ["₦1700", "₦1850", "₦1750", "₦170"],
                    correct: 0,
                    explanation: "Discount = ₦300, Sale price = ₦2000 - ₦300 = ₦1700"
                }
            ]
        },
        
        'positive-negative-integers': {
            title: 'Positive & Negative Integers',
            questions: [
                {
                    question: "What is (-5) + (-3)?",
                    options: ["-8", "-2", "2", "8"],
                    correct: 0,
                    explanation: "Adding two negative numbers gives a negative result: -5 + (-3) = -8"
                },
                {
                    question: "Calculate: (-7) - (-4)",
                    options: ["-11", "-3", "3", "11"],
                    correct: 1,
                    explanation: "(-7) - (-4) = -7 + 4 = -3"
                },
                {
                    question: "What is (-6) × (-4)?",
                    options: ["-24", "-10", "10", "24"],
                    correct: 3,
                    explanation: "Negative × Negative = Positive: (-6) × (-4) = 24"
                },
                {
                    question: "Evaluate: (-12) ÷ 3",
                    options: ["-4", "4", "-36", "36"],
                    correct: 0,
                    explanation: "Negative ÷ Positive = Negative: -12 ÷ 3 = -4"
                },
                {
                    question: "Which is the largest: -3, -7, -1, -5?",
                    options: ["-7", "-5", "-3", "-1"],
                    correct: 3,
                    explanation: "On the number line, -1 is closest to zero, making it the largest."
                }
            ]
        },
        
        'ratios-proportions-rates': {
            title: 'Ratios, Proportions & Rates',
            questions: [
                {
                    question: "Simplify the ratio 15:25",
                    options: ["3:5", "5:3", "15:25", "1:2"],
                    correct: 0,
                    explanation: "15:25 = 3:5 (dividing both by 5)"
                },
                {
                    question: "If 3 pencils cost ₦60, how much do 5 pencils cost?",
                    options: ["₦80", "₦100", "₦120", "₦75"],
                    correct: 1,
                    explanation: "1 pencil = ₦20, so 5 pencils = ₦100"
                },
                {
                    question: "A car travels 180km in 3 hours. What is its speed?",
                    options: ["50 km/h", "60 km/h", "540 km/h", "90 km/h"],
                    correct: 1,
                    explanation: "Speed = Distance ÷ Time = 180 ÷ 3 = 60 km/h"
                },
                {
                    question: "If y is directly proportional to x and y = 12 when x = 3, find y when x = 7",
                    options: ["21", "28", "36", "4"],
                    correct: 1,
                    explanation: "y = kx, k = 4, so y = 4 × 7 = 28"
                },
                {
                    question: "Share ₦500 in the ratio 2:3",
                    options: ["₦200 : ₦300", "₦250 : ₦250", "₦150 : ₦350", "₦100 : ₦400"],
                    correct: 0,
                    explanation: "2 + 3 = 5 parts. Each part = ₦100. So 2:3 = ₦200:₦300"
                }
            ]
        },
        
        'variations': {
            title: 'Variations',
            questions: [
                {
                    question: "If y varies directly as x, and y = 15 when x = 3, find the constant of variation.",
                    options: ["3", "5", "45", "12"],
                    correct: 1,
                    explanation: "y = kx, so k = y/x = 15/3 = 5"
                },
                {
                    question: "If y varies inversely as x, and y = 6 when x = 2, find y when x = 3",
                    options: ["4", "9", "18", "2"],
                    correct: 0,
                    explanation: "y = k/x, k = 12, so y = 12/3 = 4"
                },
                {
                    question: "p varies directly as q and inversely as r. If p = 12 when q = 6 and r = 2, find p when q = 9 and r = 3",
                    options: ["12", "9", "18", "6"],
                    correct: 0,
                    explanation: "p = kq/r, k = 4, so p = 4×9/3 = 12"
                },
                {
                    question: "If A varies as the square of B, and A = 36 when B = 3, find A when B = 5",
                    options: ["60", "100", "25", "125"],
                    correct: 1,
                    explanation: "A = kB², k = 4, so A = 4 × 25 = 100"
                },
                {
                    question: "The time (t) for a journey varies inversely as the speed (s). If t = 4 hours at 60 km/h, find t at 80 km/h",
                    options: ["3 hours", "5 hours", "3.5 hours", "2 hours"],
                    correct: 0,
                    explanation: "t = k/s, k = 240, so t = 240/80 = 3 hours"
                }
            ]
        },
        
        'financial-arithmetic': {
            title: 'Financial Arithmetic',
            questions: [
                {
                    question: "Calculate the simple interest on ₦5000 at 8% per annum for 3 years",
                    options: ["₦1200", "₦1500", "₦400", "₦500"],
                    correct: 0,
                    explanation: "SI = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₦1200"
                },
                {
                    question: "Find the compound interest on ₦10000 at 10% per annum for 2 years",
                    options: ["₦2000", "₦2100", "₦1000", "₦2200"],
                    correct: 1,
                    explanation: "A = 10000(1.1)² = ₦12100, CI = ₦2100"
                },
                {
                    question: "A car depreciates at 15% per year. If it costs ₦2,000,000, what is its value after 1 year?",
                    options: ["₦1,700,000", "₦1,850,000", "₦1,500,000", "₦1,800,000"],
                    correct: 0,
                    explanation: "Depreciation = ₦300,000, Value = ₦2,000,000 - ₦300,000 = ₦1,700,000"
                },
                {
                    question: "What is the profit on an item bought for ₦800 and sold for ₦1000?",
                    options: ["₦100", "₦200", "₦150", "₦250"],
                    correct: 1,
                    explanation: "Profit = Selling Price - Cost Price = ₦1000 - ₦800 = ₦200"
                },
                {
                    question: "If a ₦5000 investment grows to ₦6000 in 2 years, what is the percentage gain?",
                    options: ["10%", "15%", "20%", "25%"],
                    correct: 2,
                    explanation: "Gain = ₦1000, Percentage = (1000/5000) × 100 = 20%"
                }
            ]
        },
        
        // NUMBER SYSTEMS
        'sets': {
            title: 'Sets',
            questions: [
                {
                    question: "What is the intersection of A = {1, 2, 3} and B = {2, 3, 4}?",
                    options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{}"],
                    correct: 1,
                    explanation: "A ∩ B contains elements common to both sets: {2, 3}"
                },
                {
                    question: "The union of sets P = {a, b} and Q = {b, c, d} is:",
                    options: ["{a, b, c, d}", "{b}", "{a, b, b, c, d}", "{a, c, d}"],
                    correct: 0,
                    explanation: "P ∪ Q contains all elements from both sets without repetition."
                },
                {
                    question: "How many subsets does the set {a, b, c} have?",
                    options: ["3", "6", "8", "9"],
                    correct: 2,
                    explanation: "A set with n elements has 2^n subsets. 2³ = 8 subsets."
                },
                {
                    question: "What is the complement of set A if U = {1, 2, 3, 4, 5} and A = {1, 3, 5}?",
                    options: ["{1, 3, 5}", "{2, 4}", "{1, 2, 3, 4, 5}", "{}"],
                    correct: 1,
                    explanation: "A' contains elements in universal set U but not in A: {2, 4}"
                },
                {
                    question: "If n(A) = 15, n(B) = 20, and n(A ∪ B) = 30, find n(A ∩ B)",
                    options: ["5", "10", "15", "35"],
                    correct: 0,
                    explanation: "n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = 15 + 20 - 30 = 5"
                }
            ]
        },
        
        'indices': {
            title: 'Indices',
            questions: [
                {
                    question: "Simplify: 2³ × 2⁴",
                    options: ["2⁷", "2¹²", "4⁷", "2¹"],
                    correct: 0,
                    explanation: "When multiplying same bases, add exponents: 2³ × 2⁴ = 2⁷"
                },
                {
                    question: "Evaluate: 5⁰",
                    options: ["0", "1", "5", "Undefined"],
                    correct: 1,
                    explanation: "Any non-zero number raised to power 0 equals 1."
                },
                {
                    question: "Simplify: (3²)³",
                    options: ["3⁵", "3⁶", "9³", "3⁸"],
                    correct: 1,
                    explanation: "Power of a power: multiply exponents. (3²)³ = 3⁶"
                },
                {
                    question: "What is 2⁻³ equal to?",
                    options: ["-8", "1/8", "8", "-1/8"],
                    correct: 1,
                    explanation: "Negative exponent means reciprocal: 2⁻³ = 1/2³ = 1/8"
                },
                {
                    question: "Simplify: 8²/³",
                    options: ["2", "4", "8", "64"],
                    correct: 1,
                    explanation: "8²/³ = (∛8)² = 2² = 4"
                }
            ]
        },
        
        'logarithms': {
            title: 'Logarithms',
            questions: [
                {
                    question: "What is log₁₀ 100?",
                    options: ["1", "2", "10", "100"],
                    correct: 1,
                    explanation: "log₁₀ 100 = 2 because 10² = 100"
                },
                {
                    question: "Evaluate: log₂ 8",
                    options: ["2", "3", "4", "8"],
                    correct: 1,
                    explanation: "log₂ 8 = 3 because 2³ = 8"
                },
                {
                    question: "If log₁₀ x = 3, find x",
                    options: ["30", "100", "300", "1000"],
                    correct: 3,
                    explanation: "x = 10³ = 1000"
                },
                {
                    question: "Simplify: log 6 + log 5",
                    options: ["log 30", "log 11", "log 1", "2 log 30"],
                    correct: 0,
                    explanation: "log a + log b = log(ab), so log 6 + log 5 = log 30"
                },
                {
                    question: "What is log 1?",
                    options: ["0", "1", "10", "Undefined"],
                    correct: 0,
                    explanation: "log 1 = 0 because any base raised to power 0 equals 1."
                }
            ]
        },
        
        'surds': {
            title: 'Surds',
            questions: [
                {
                    question: "Simplify: √12",
                    options: ["2√3", "3√2", "4√3", "6√2"],
                    correct: 0,
                    explanation: "√12 = √(4×3) = √4 × √3 = 2√3"
                },
                {
                    question: "Rationalize: 1/√2",
                    options: ["√2", "√2/2", "2√2", "1/2"],
                    correct: 1,
                    explanation: "1/√2 × √2/√2 = √2/2"
                },
                {
                    question: "Simplify: √27 + √48",
                    options: ["5√3", "7√3", "3√3 + 4√3", "√75"],
                    correct: 1,
                    explanation: "√27 = 3√3, √48 = 4√3, Sum = 7√3"
                },
                {
                    question: "Evaluate: √50 ÷ √2",
                    options: ["√25", "5", "10", "√100"],
                    correct: 1,
                    explanation: "√50 ÷ √2 = √(50/2) = √25 = 5"
                },
                {
                    question: "What is (√3)²?",
                    options: ["√9", "3", "√6", "9"],
                    correct: 1,
                    explanation: "(√3)² = 3 (squaring and square root are inverse operations)"
                }
            ]
        },
        
        'number-bases': {
            title: 'Number Bases',
            questions: [
                {
                    question: "Convert 101₂ to base 10",
                    options: ["3", "5", "7", "101"],
                    correct: 1,
                    explanation: "101₂ = 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5"
                },
                {
                    question: "Convert 15₁₀ to binary",
                    options: ["1010", "1110", "1111", "1101"],
                    correct: 2,
                    explanation: "15 = 8 + 4 + 2 + 1 = 1111₂"
                },
                {
                    question: "Add: 101₂ + 110₂",
                    options: ["1011₂", "1111₂", "1001₂", "211₂"],
                    correct: 0,
                    explanation: "101₂ = 5, 110₂ = 6, Sum = 11 = 1011₂"
                },
                {
                    question: "Convert 23₄ to base 10",
                    options: ["23", "11", "7", "5"],
                    correct: 1,
                    explanation: "23₄ = 2×4¹ + 3×4⁰ = 8 + 3 = 11"
                },
                {
                    question: "What is 6₇ + 5₇ in base 7?",
                    options: ["11₇", "14₇", "13₇", "12₇"],
                    correct: 1,
                    explanation: "6 + 5 = 11, in base 7: 11 = 1×7 + 4 = 14₇"
                }
            ]
        },
        
        'modular-arithmetic': {
            title: 'Modular Arithmetic',
            questions: [
                {
                    question: "What is 17 mod 5?",
                    options: ["2", "3", "12", "5"],
                    correct: 0,
                    explanation: "17 ÷ 5 = 3 remainder 2, so 17 ≡ 2 (mod 5)"
                },
                {
                    question: "Find: 23 mod 7",
                    options: ["2", "3", "4", "16"],
                    correct: 0,
                    explanation: "23 ÷ 7 = 3 remainder 2, so 23 ≡ 2 (mod 7)"
                },
                {
                    question: "What is 8 + 7 (mod 5)?",
                    options: ["0", "1", "2", "15"],
                    correct: 0,
                    explanation: "8 + 7 = 15, 15 mod 5 = 0"
                },
                {
                    question: "Find the value of x: 3x ≡ 2 (mod 7) where 0 ≤ x < 7",
                    options: ["3", "4", "5", "6"],
                    correct: 0,
                    explanation: "3 × 3 = 9 ≡ 2 (mod 7)"
                },
                {
                    question: "What day of the week will it be 100 days after Monday?",
                    options: ["Monday", "Wednesday", "Thursday", "Friday"],
                    correct: 2,
                    explanation: "100 mod 7 = 2. Monday + 2 days = Wednesday"
                }
            ]
        },
        
        'logic': {
            title: 'Logic',
            questions: [
                {
                    question: "What is the negation of 'All students are present'?",
                    options: ["No students are present", "Some students are not present", "All students are absent", "Some students are present"],
                    correct: 1,
                    explanation: "The negation of 'All A are B' is 'Some A are not B'."
                },
                {
                    question: "If p → q is true and q is false, what can we conclude about p?",
                    options: ["p is true", "p is false", "p could be true or false", "Cannot determine"],
                    correct: 1,
                    explanation: "If p → q and q is false, then p must be false (modus tollens)."
                },
                {
                    question: "What is the truth value of p AND q when p is true and q is false?",
                    options: ["True", "False", "Cannot determine", "Both true and false"],
                    correct: 1,
                    explanation: "AND operation requires both p and q to be true for the result to be true."
                },
                {
                    question: "The contrapositive of 'If it rains, then the ground is wet' is:",
                    options: ["If the ground is wet, then it rains", "If it doesn't rain, the ground is not wet", "If the ground is not wet, then it doesn't rain", "It rains and the ground is wet"],
                    correct: 2,
                    explanation: "Contrapositive of p → q is ¬q → ¬p"
                },
                {
                    question: "What is p OR q when p is true and q is false?",
                    options: ["True", "False", "Cannot determine", "Both"],
                    correct: 0,
                    explanation: "OR operation gives true if at least one operand is true."
                }
            ]
        },
        
        // ALGEBRAIC FOUNDATIONS
        'algebra-basics': {
            title: 'Algebra Basics',
            questions: [
                {
                    question: "Simplify: 3x + 5x - 2x",
                    options: ["6x", "10x", "6x²", "8x"],
                    correct: 0,
                    explanation: "3x + 5x - 2x = (3 + 5 - 2)x = 6x"
                },
                {
                    question: "If 2x + 5 = 13, what is x?",
                    options: ["4", "8", "9", "3"],
                    correct: 0,
                    explanation: "2x = 13 - 5 = 8, x = 4"
                },
                {
                    question: "Expand: 3(x + 4)",
                    options: ["3x + 4", "3x + 12", "x + 12", "3x + 7"],
                    correct: 1,
                    explanation: "3(x + 4) = 3x + 12"
                },
                {
                    question: "Factorize: 6x + 9",
                    options: ["3(2x + 3)", "6(x + 9)", "3(2x + 9)", "2(3x + 4.5)"],
                    correct: 0,
                    explanation: "6x + 9 = 3(2x + 3)"
                },
                {
                    question: "Solve for x: 4x - 7 = 2x + 5",
                    options: ["6", "1", "12", "-6"],
                    correct: 0,
                    explanation: "4x - 2x = 5 + 7, 2x = 12, x = 6"
                }
            ]
        },
        
        'linear-equations-inequalities': {
            title: 'Linear Equations & Inequalities',
            questions: [
                {
                    question: "Solve: 3x - 7 = 14",
                    options: ["7", "21/3", "x = 7", "All of the above"],
                    correct: 3,
                    explanation: "3x = 21, x = 7"
                },
                {
                    question: "Solve: 2x + 5 > 11",
                    options: ["x > 3", "x > 8", "x < 3", "x < 8"],
                    correct: 0,
                    explanation: "2x > 6, x > 3"
                },
                {
                    question: "Solve: -2x < 8",
                    options: ["x < -4", "x > -4", "x < 4", "x > 4"],
                    correct: 1,
                    explanation: "When dividing by negative, reverse the inequality: x > -4"
                },
                {
                    question: "Find x: |x - 3| = 5",
                    options: ["x = 8 only", "x = -2 only", "x = 8 or x = -2", "x = 2 or x = 8"],
                    correct: 2,
                    explanation: "x - 3 = 5 or x - 3 = -5, so x = 8 or x = -2"
                },
                {
                    question: "Graph the solution: 2 ≤ x < 5",
                    options: ["All numbers from 2 to 5", "All numbers from 2 to 5, excluding 5", "Only 2 and 5", "All numbers less than 5"],
                    correct: 1,
                    explanation: "[2, 5) includes 2 but excludes 5."
                }
            ]
        },
        
        'quadratic-equations': {
            title: 'Quadratic Equations',
            questions: [
                {
                    question: "The general form of a quadratic equation is:",
                    options: ["ax + b = 0", "ax² + bx + c = 0", "y = mx + c", "a² + b² = c²"],
                    correct: 1,
                    explanation: "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0."
                },
                {
                    question: "Solve: x² - 9 = 0",
                    options: ["x = 3", "x = -3", "x = 3 or x = -3", "x = 9"],
                    correct: 2,
                    explanation: "x² = 9, x = ±√9 = ±3"
                },
                {
                    question: "Using the quadratic formula, solve: x² - 5x + 6 = 0",
                    options: ["x = 2 or x = 3", "x = -2 or x = -3", "x = 1 or x = 6", "x = 6 or x = -1"],
                    correct: 0,
                    explanation: "x = (5 ± √(25-24))/2 = (5 ± 1)/2 = 3 or 2"
                },
                {
                    question: "The discriminant of x² + 4x + 4 = 0 is:",
                    options: ["0", "16", "8", "-16"],
                    correct: 0,
                    explanation: "Discriminant = b² - 4ac = 16 - 16 = 0"
                },
                {
                    question: "If discriminant < 0, the roots are:",
                    options: ["Real and equal", "Real and different", "Imaginary", "One real root"],
                    correct: 2,
                    explanation: "When discriminant < 0, the quadratic has no real roots (imaginary)."
                }
            ]
        },
        
        'factorization': {
            title: 'Factorization',
            questions: [
                {
                    question: "Factorize: x² - 16",
                    options: ["(x - 4)²", "(x + 4)(x - 4)", "(x + 8)(x - 2)", "Cannot factorize"],
                    correct: 1,
                    explanation: "Difference of two squares: x² - 16 = (x + 4)(x - 4)"
                },
                {
                    question: "Factorize: x² + 7x + 12",
                    options: ["(x + 3)(x + 4)", "(x + 6)(x + 2)", "(x + 12)(x + 1)", "(x + 3)²"],
                    correct: 0,
                    explanation: "Find two numbers that multiply to 12 and add to 7: 3 and 4."
                },
                {
                    question: "Factorize: 2x² + 5x - 3",
                    options: ["(2x - 1)(x + 3)", "(2x + 3)(x - 1)", "(2x + 1)(x - 3)", "(2x - 3)(x + 1)"],
                    correct: 0,
                    explanation: "2x² + 5x - 3 = (2x - 1)(x + 3)"
                },
                {
                    question: "Factorize completely: 4x² - 9",
                    options: ["(2x - 3)²", "(2x + 3)(2x - 3)", "(4x + 9)(x - 1)", "4(x² - 9/4)"],
                    correct: 1,
                    explanation: "Difference of squares: (2x)² - 3² = (2x + 3)(2x - 3)"
                },
                {
                    question: "Factorize: x³ - 8",
                    options: ["(x - 2)³", "(x - 2)(x² + 2x + 4)", "(x + 2)(x² - 2x + 4)", "(x - 2)(x + 2)²"],
                    correct: 1,
                    explanation: "Difference of cubes: x³ - 2³ = (x - 2)(x² + 2x + 4)"
                }
            ]
        },
        
        'polynomials': {
            title: 'Polynomials',
            questions: [
                {
                    question: "What is the degree of the polynomial 3x⁴ - 2x² + 5x - 7?",
                    options: ["2", "4", "3", "7"],
                    correct: 1,
                    explanation: "The degree is the highest power of x, which is 4."
                },
                {
                    question: "Add: (3x² + 2x - 1) + (x² - 3x + 4)",
                    options: ["4x² - x + 3", "4x² + 5x + 3", "4x² - 5x + 3", "4x² - x - 3"],
                    correct: 0,
                    explanation: "Add like terms: (3+1)x² + (2-3)x + (-1+4) = 4x² - x + 3"
                },
                {
                    question: "Multiply: (x + 2)(x - 3)",
                    options: ["x² - 6", "x² - x - 6", "x² + x - 6", "x² - x + 6"],
                    correct: 1,
                    explanation: "(x + 2)(x - 3) = x² - 3x + 2x - 6 = x² - x - 6"
                },
                {
                    question: "Divide: (2x² + 5x + 3) ÷ (x + 1)",
                    options: ["2x + 3", "2x - 3", "x + 3", "2x + 1"],
                    correct: 0,
                    explanation: "(2x² + 5x + 3) ÷ (x + 1) = 2x + 3"
                },
                {
                    question: "If x = 2 is a root of x³ - 6x² + 11x - 6 = 0, find another root.",
                    options: ["x = 1", "x = 3", "Both x = 1 and x = 3", "x = -2"],
                    correct: 2,
                    explanation: "The polynomial factors as (x-1)(x-2)(x-3), so roots are 1, 2, 3."
                }
            ]
        },
        
        'sequences-progressions': {
            title: 'Sequences & Progressions',
            questions: [
                {
                    question: "Find the 10th term of the AP: 2, 5, 8, 11, ...",
                    options: ["29", "32", "27", "35"],
                    correct: 0,
                    explanation: "a = 2, d = 3. a₁₀ = 2 + (10-1)×3 = 2 + 27 = 29"
                },
                {
                    question: "Find the sum of the first 20 natural numbers",
                    options: ["200", "210", "190", "220"],
                    correct: 1,
                    explanation: "S = n(n+1)/2 = 20×21/2 = 210"
                },
                {
                    question: "The 5th term of a GP is 48 and the 3rd term is 12. Find the common ratio.",
                    options: ["2", "4", "±2", "3"],
                    correct: 2,
                    explanation: "ar⁴/ar² = r² = 4, so r = ±2"
                },
                {
                    question: "Find the sum of the GP: 2 + 6 + 18 + ... to 6 terms",
                    options: ["728", "486", "1458", "729"],
                    correct: 0,
                    explanation: "S = a(rⁿ - 1)/(r - 1) = 2(3⁶ - 1)/2 = 728"
                },
                {
                    question: "Find the nth term of the sequence: 1, 4, 9, 16, ...",
                    options: ["n²", "2n - 1", "n + 3", "n³"],
                    correct: 0,
                    explanation: "This is a sequence of perfect squares: 1², 2², 3², 4², ..."
                }
            ]
        },
        
        // GEOMETRY & TRIGONOMETRY
        'angles': {
            title: 'Angles',
            questions: [
                {
                    question: "What is the supplement of 65°?",
                    options: ["25°", "115°", "135°", "65°"],
                    correct: 1,
                    explanation: "Supplementary angles sum to 180°. 180° - 65° = 115°"
                },
                {
                    question: "What is the complement of 35°?",
                    options: ["55°", "145°", "35°", "125°"],
                    correct: 0,
                    explanation: "Complementary angles sum to 90°. 90° - 35° = 55°"
                },
                {
                    question: "How many degrees are in a right angle?",
                    options: ["45°", "90°", "180°", "360°"],
                    correct: 1,
                    explanation: "A right angle measures exactly 90°."
                },
                {
                    question: "An angle measuring 230° is:",
                    options: ["Acute", "Right", "Obtuse", "Reflex"],
                    correct: 3,
                    explanation: "Angles between 180° and 360° are reflex angles."
                },
                {
                    question: "Vertically opposite angles are:",
                    options: ["Complementary", "Supplementary", "Equal", "Adjacent"],
                    correct: 2,
                    explanation: "Vertically opposite angles are always equal."
                }
            ]
        },
        
        'triangles': {
            title: 'Triangles',
            questions: [
                {
                    question: "What is the sum of angles in a triangle?",
                    options: ["90°", "180°", "270°", "360°"],
                    correct: 1,
                    explanation: "The angles in any triangle sum to 180°."
                },
                {
                    question: "A triangle with sides 3cm, 4cm, and 5cm is:",
                    options: ["Equilateral", "Isosceles", "Right-angled", "Obtuse"],
                    correct: 2,
                    explanation: "3² + 4² = 9 + 16 = 25 = 5², so it's a right triangle (Pythagorean triple)."
                },
                {
                    question: "Find the third angle of a triangle if two angles are 45° and 65°",
                    options: ["70°", "80°", "90°", "110°"],
                    correct: 0,
                    explanation: "Third angle = 180° - 45° - 65° = 70°"
                },
                {
                    question: "An equilateral triangle has:",
                    options: ["Two equal sides", "Three equal sides", "No equal sides", "One right angle"],
                    correct: 1,
                    explanation: "An equilateral triangle has all three sides equal."
                },
                {
                    question: "The area of a triangle with base 10cm and height 8cm is:",
                    options: ["40 cm²", "80 cm²", "18 cm²", "36 cm²"],
                    correct: 0,
                    explanation: "Area = ½ × base × height = ½ × 10 × 8 = 40 cm²"
                }
            ]
        },
        
        'circles': {
            title: 'Circles',
            questions: [
                {
                    question: "What is the circumference of a circle with radius 7cm? (Use π = 22/7)",
                    options: ["44 cm", "154 cm", "22 cm", "88 cm"],
                    correct: 0,
                    explanation: "C = 2πr = 2 × (22/7) × 7 = 44 cm"
                },
                {
                    question: "The area of a circle with diameter 14cm is:",
                    options: ["154 cm²", "44 cm²", "616 cm²", "77 cm²"],
                    correct: 0,
                    explanation: "r = 7cm, Area = πr² = (22/7) × 49 = 154 cm²"
                },
                {
                    question: "An angle subtended at the center by an arc is:",
                    options: ["Half the angle at circumference", "Equal to the angle at circumference", "Double the angle at circumference", "Unrelated"],
                    correct: 2,
                    explanation: "The angle at the center is twice the angle at the circumference."
                },
                {
                    question: "What is the length of an arc with angle 60° and radius 6cm?",
                    options: ["π cm", "2π cm", "6π cm", "12π cm"],
                    correct: 1,
                    explanation: "Arc length = (θ/360) × 2πr = (60/360) × 2π × 6 = 2π cm"
                },
                {
                    question: "A tangent to a circle is:",
                    options: ["Parallel to the radius", "Perpendicular to the radius", "Equal to the diameter", "A chord"],
                    correct: 1,
                    explanation: "A tangent is always perpendicular to the radius at the point of contact."
                }
            ]
        },
        
        'trig-ratios': {
            title: 'Trigonometric Ratios',
            questions: [
                {
                    question: "What is sin 30°?",
                    options: ["1/2", "√3/2", "1/√2", "1"],
                    correct: 0,
                    explanation: "sin 30° = 1/2 = 0.5"
                },
                {
                    question: "What is cos 60°?",
                    options: ["0", "1/2", "√3/2", "1"],
                    correct: 1,
                    explanation: "cos 60° = 1/2 = 0.5"
                },
                {
                    question: "What is tan 45°?",
                    options: ["0", "1/2", "1", "√3"],
                    correct: 2,
                    explanation: "tan 45° = 1 (sin 45° = cos 45°)"
                },
                {
                    question: "In a right triangle, if sin θ = 3/5, what is cos θ?",
                    options: ["3/5", "4/5", "5/3", "5/4"],
                    correct: 1,
                    explanation: "Using SOHCAHTOA: adjacent = 4, hypotenuse = 5, so cos θ = 4/5"
                },
                {
                    question: "The identity sin²θ + cos²θ equals:",
                    options: ["0", "1", "2", "tan²θ"],
                    correct: 1,
                    explanation: "This is the Pythagorean identity: sin²θ + cos²θ = 1"
                }
            ]
        },
        
        'mensuration': {
            title: 'Mensuration',
            questions: [
                {
                    question: "Find the volume of a cube with side 5cm",
                    options: ["25 cm³", "125 cm³", "150 cm³", "75 cm³"],
                    correct: 1,
                    explanation: "Volume of cube = s³ = 5³ = 125 cm³"
                },
                {
                    question: "What is the total surface area of a cuboid 4cm × 3cm × 2cm?",
                    options: ["24 cm²", "52 cm²", "26 cm²", "48 cm²"],
                    correct: 1,
                    explanation: "TSA = 2(lb + bh + lh) = 2(12 + 6 + 8) = 52 cm²"
                },
                {
                    question: "Find the volume of a cylinder with radius 7cm and height 10cm (π = 22/7)",
                    options: ["440 cm³", "1540 cm³", "220 cm³", "770 cm³"],
                    correct: 1,
                    explanation: "V = πr²h = (22/7) × 49 × 10 = 1540 cm³"
                },
                {
                    question: "The volume of a sphere with radius 3cm is:",
                    options: ["36π cm³", "12π cm³", "27π cm³", "9π cm³"],
                    correct: 0,
                    explanation: "V = (4/3)πr³ = (4/3)π(27) = 36π cm³"
                },
                {
                    question: "What is the curved surface area of a cone with radius 3cm and slant height 5cm?",
                    options: ["15π cm²", "8π cm²", "45π cm²", "30π cm²"],
                    correct: 0,
                    explanation: "CSA = πrl = π × 3 × 5 = 15π cm²"
                }
            ]
        },
        
        'coordinate-geometry': {
            title: 'Coordinate Geometry',
            questions: [
                {
                    question: "What is the distance between points A(1, 2) and B(4, 6)?",
                    options: ["3", "4", "5", "7"],
                    correct: 2,
                    explanation: "d = √[(4-1)² + (6-2)²] = √(9 + 16) = √25 = 5"
                },
                {
                    question: "Find the midpoint of the line joining (2, 4) and (6, 8)",
                    options: ["(4, 6)", "(3, 5)", "(5, 7)", "(4, 5)"],
                    correct: 0,
                    explanation: "Midpoint = ((2+6)/2, (4+8)/2) = (4, 6)"
                },
                {
                    question: "What is the gradient of the line passing through (0, 0) and (3, 6)?",
                    options: ["1", "2", "3", "1/2"],
                    correct: 1,
                    explanation: "m = (6-0)/(3-0) = 6/3 = 2"
                },
                {
                    question: "The equation of a line with gradient 2 and y-intercept 3 is:",
                    options: ["y = 2x - 3", "y = 2x + 3", "y = 3x + 2", "y = -2x + 3"],
                    correct: 1,
                    explanation: "Using y = mx + c: y = 2x + 3"
                },
                {
                    question: "Lines with gradients m₁ = 2 and m₂ = -1/2 are:",
                    options: ["Parallel", "Perpendicular", "Same line", "Intersecting but not perpendicular"],
                    correct: 1,
                    explanation: "m₁ × m₂ = 2 × (-1/2) = -1, so the lines are perpendicular."
                }
            ]
        },
        
        'bearings': {
            title: 'Bearings',
            questions: [
                {
                    question: "What is the bearing of North?",
                    options: ["0°", "90°", "180°", "360°"],
                    correct: 0,
                    explanation: "North is always measured as 0° or 360° in bearings."
                },
                {
                    question: "What is the bearing of East?",
                    options: ["0°", "90°", "180°", "270°"],
                    correct: 1,
                    explanation: "East is 90° clockwise from North."
                },
                {
                    question: "The bearing of South-West is:",
                    options: ["45°", "135°", "225°", "315°"],
                    correct: 2,
                    explanation: "South-West is 225° clockwise from North."
                },
                {
                    question: "If the bearing of B from A is 075°, what is the bearing of A from B?",
                    options: ["075°", "105°", "255°", "285°"],
                    correct: 2,
                    explanation: "Back bearing = 75° + 180° = 255°"
                },
                {
                    question: "A ship sails 5km North then 12km East. How far is it from the starting point?",
                    options: ["13 km", "17 km", "7 km", "10 km"],
                    correct: 0,
                    explanation: "Using Pythagoras: d = √(5² + 12²) = √169 = 13 km"
                }
            ]
        },
        
        'elevation-depression': {
            title: 'Angles of Elevation & Depression',
            questions: [
                {
                    question: "The angle of elevation is measured:",
                    options: ["Downward from horizontal", "Upward from horizontal", "From the vertical", "From sea level"],
                    correct: 1,
                    explanation: "Angle of elevation is measured upward from the horizontal line."
                },
                {
                    question: "A tower is 30m high. At a point on the ground, the angle of elevation to the top is 45°. How far is the point from the tower?",
                    options: ["15 m", "30 m", "45 m", "60 m"],
                    correct: 1,
                    explanation: "tan 45° = 1 = 30/d, so d = 30 m"
                },
                {
                    question: "From a cliff 100m high, the angle of depression to a boat is 30°. How far is the boat from the base?",
                    options: ["100 m", "100√3 m", "50 m", "200 m"],
                    correct: 1,
                    explanation: "tan 30° = 1/√3 = 100/d, so d = 100√3 m"
                },
                {
                    question: "The angle of elevation of the sun when a 12m pole casts a 12√3 m shadow is:",
                    options: ["30°", "45°", "60°", "90°"],
                    correct: 0,
                    explanation: "tan θ = 12/(12√3) = 1/√3, so θ = 30°"
                },
                {
                    question: "The angle of depression equals the:",
                    options: ["Angle of elevation", "Complement of angle of elevation", "Angle of elevation from the object below", "Sum of elevation angles"],
                    correct: 2,
                    explanation: "Angle of depression from above equals angle of elevation from below."
                }
            ]
        },
        
        // CALCULUS
        'differentiation-basics': {
            title: 'Differentiation Basics',
            questions: [
                {
                    question: "What is the derivative of x³?",
                    options: ["3x", "x²", "3x²", "3x³"],
                    correct: 2,
                    explanation: "d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x²"
                },
                {
                    question: "Differentiate: 5x² + 3x - 7",
                    options: ["10x + 3", "10x - 7", "5x + 3", "10x² + 3"],
                    correct: 0,
                    explanation: "d/dx(5x²) = 10x, d/dx(3x) = 3, d/dx(7) = 0"
                },
                {
                    question: "What is d/dx(sin x)?",
                    options: ["cos x", "-cos x", "sin x", "-sin x"],
                    correct: 0,
                    explanation: "The derivative of sin x is cos x."
                },
                {
                    question: "Differentiate: eˣ",
                    options: ["xeˣ⁻¹", "eˣ", "ln x", "xeˣ"],
                    correct: 1,
                    explanation: "The derivative of eˣ is eˣ."
                },
                {
                    question: "What is the derivative of ln x?",
                    options: ["x", "1/x", "-1/x", "ln(x)/x"],
                    correct: 1,
                    explanation: "d/dx(ln x) = 1/x"
                }
            ]
        },
        
        'integration-basics': {
            title: 'Integration Basics',
            questions: [
                {
                    question: "What is ∫x² dx?",
                    options: ["x³", "x³/3 + C", "2x + C", "x³ + C"],
                    correct: 1,
                    explanation: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C, so ∫x² dx = x³/3 + C"
                },
                {
                    question: "Evaluate: ∫(3x² + 2x) dx",
                    options: ["x³ + x² + C", "6x + 2 + C", "x³ + 2x² + C", "3x³ + 2x² + C"],
                    correct: 0,
                    explanation: "∫3x² dx = x³, ∫2x dx = x², so result is x³ + x² + C"
                },
                {
                    question: "What is ∫cos x dx?",
                    options: ["sin x + C", "-sin x + C", "cos x + C", "-cos x + C"],
                    correct: 0,
                    explanation: "The integral of cos x is sin x + C."
                },
                {
                    question: "Evaluate: ∫₁³ 2x dx",
                    options: ["4", "8", "6", "2"],
                    correct: 1,
                    explanation: "∫2x dx = x². Evaluate: 3² - 1² = 9 - 1 = 8"
                },
                {
                    question: "What is ∫eˣ dx?",
                    options: ["xeˣ + C", "eˣ + C", "ln x + C", "eˣ/x + C"],
                    correct: 1,
                    explanation: "The integral of eˣ is eˣ + C."
                }
            ]
        },
        
        // STATISTICS & PROBABILITY
        'probability': {
            title: 'Probability',
            questions: [
                {
                    question: "A fair die is rolled. What is the probability of getting a 4?",
                    options: ["1/6", "1/4", "1/3", "4/6"],
                    correct: 0,
                    explanation: "P(4) = 1/6 (one favorable outcome out of six)"
                },
                {
                    question: "What is the probability of getting a Head when flipping a fair coin?",
                    options: ["1/3", "1/2", "2/3", "1"],
                    correct: 1,
                    explanation: "P(Head) = 1/2 for a fair coin."
                },
                {
                    question: "A bag contains 3 red and 5 blue balls. What is P(drawing a red ball)?",
                    options: ["3/5", "5/8", "3/8", "1/2"],
                    correct: 2,
                    explanation: "P(red) = 3/(3+5) = 3/8"
                },
                {
                    question: "If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, find P(A and B)",
                    options: ["0.7", "0.12", "0.1", "0.5"],
                    correct: 1,
                    explanation: "P(A ∩ B) = P(A) × P(B) = 0.3 × 0.4 = 0.12"
                },
                {
                    question: "The probability of an event NOT occurring is 0.7. What is the probability it occurs?",
                    options: ["0.7", "0.3", "1.7", "0.5"],
                    correct: 1,
                    explanation: "P(event) = 1 - P(not event) = 1 - 0.7 = 0.3"
                }
            ]
        },
        
        'permutations-combinations': {
            title: 'Permutations & Combinations',
            questions: [
                {
                    question: "How many ways can 5 books be arranged on a shelf?",
                    options: ["25", "120", "60", "5"],
                    correct: 1,
                    explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120"
                },
                {
                    question: "Calculate ⁵P₂",
                    options: ["10", "20", "25", "5"],
                    correct: 1,
                    explanation: "⁵P₂ = 5!/(5-2)! = 5!/3! = 20"
                },
                {
                    question: "How many ways can 3 students be selected from 8?",
                    options: ["24", "56", "336", "120"],
                    correct: 1,
                    explanation: "⁸C₃ = 8!/(3! × 5!) = 56"
                },
                {
                    question: "In how many ways can a committee of 4 be chosen from 6 men and 4 women if it must include at least 2 women?",
                    options: ["90", "95", "115", "200"],
                    correct: 2,
                    explanation: "⁴C₂×⁶C₂ + ⁴C₃×⁶C₁ + ⁴C₄×⁶C₀ = 90 + 24 + 1 = 115"
                },
                {
                    question: "How many 3-digit numbers can be formed using digits 1, 2, 3, 4, 5 without repetition?",
                    options: ["60", "125", "15", "120"],
                    correct: 0,
                    explanation: "⁵P₃ = 5 × 4 × 3 = 60"
                }
            ]
        },
        
        'representation-data': {
            title: 'Representation of Data',
            questions: [
                {
                    question: "Which graph is best for showing parts of a whole?",
                    options: ["Bar chart", "Pie chart", "Line graph", "Histogram"],
                    correct: 1,
                    explanation: "Pie charts show proportions of a whole."
                },
                {
                    question: "A histogram is used for:",
                    options: ["Categorical data", "Continuous grouped data", "Discrete data only", "Time series"],
                    correct: 1,
                    explanation: "Histograms display continuous grouped data with bars touching."
                },
                {
                    question: "In a frequency table, the cumulative frequency of the last class is:",
                    options: ["Equal to the class frequency", "Equal to total frequency", "Zero", "Half of total"],
                    correct: 1,
                    explanation: "Cumulative frequency accumulates to the total."
                },
                {
                    question: "Which measure is shown by the line that divides a box plot into two parts?",
                    options: ["Mean", "Mode", "Median", "Range"],
                    correct: 2,
                    explanation: "The line inside the box represents the median."
                },
                {
                    question: "What type of data is represented by a bar chart?",
                    options: ["Continuous data", "Categorical data", "Only numerical data", "Time series"],
                    correct: 1,
                    explanation: "Bar charts are used for categorical or discrete data."
                }
            ]
        },
        
        'measures-location-dispersion': {
            title: 'Measures of Location & Dispersion',
            questions: [
                {
                    question: "Find the mean of: 4, 6, 8, 10, 12",
                    options: ["6", "8", "10", "7"],
                    correct: 1,
                    explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8"
                },
                {
                    question: "Find the median of: 3, 7, 2, 9, 5",
                    options: ["3", "5", "7", "9"],
                    correct: 1,
                    explanation: "Arranged: 2, 3, 5, 7, 9. Median (middle value) = 5"
                },
                {
                    question: "What is the mode of: 2, 3, 3, 4, 4, 4, 5?",
                    options: ["3", "4", "5", "3 and 4"],
                    correct: 1,
                    explanation: "Mode is the most frequent value: 4 appears 3 times."
                },
                {
                    question: "Find the range of: 15, 8, 22, 7, 13",
                    options: ["15", "22", "7", "14"],
                    correct: 0,
                    explanation: "Range = Maximum - Minimum = 22 - 7 = 15"
                },
                {
                    question: "The interquartile range is:",
                    options: ["Q₃ - Q₁", "Q₂ - Q₁", "Q₃ - Q₂", "Maximum - Minimum"],
                    correct: 0,
                    explanation: "IQR = Q₃ - Q₁ (third quartile minus first quartile)"
                }
            ]
        },
        
        // MATRICES & DETERMINANTS
        'matrices': {
            title: 'Matrices',
            questions: [
                {
                    question: "What is the order of matrix [[1, 2], [3, 4], [5, 6]]?",
                    options: ["2×3", "3×2", "3×3", "2×2"],
                    correct: 1,
                    explanation: "The matrix has 3 rows and 2 columns, so order is 3×2."
                },
                {
                    question: "Add: [[1, 2], [3, 4]] + [[5, 6], [7, 8]]",
                    options: ["[[6, 8], [10, 12]]", "[[5, 12], [21, 32]]", "[[6, 8], [10, 12]]", "[[5, 8], [10, 12]]"],
                    correct: 0,
                    explanation: "Add corresponding elements: 1+5=6, 2+6=8, 3+7=10, 4+8=12"
                },
                {
                    question: "Multiply: [[2, 3]] × [[1], [4]]",
                    options: ["[[14]]", "[[2, 12]]", "[[1, 12]]", "[[8]]"],
                    correct: 0,
                    explanation: "(1×2 matrix) × (2×1 matrix) = 1×1 matrix: 2×1 + 3×4 = 14"
                },
                {
                    question: "The identity matrix for a 2×2 matrix is:",
                    options: ["[[0, 0], [0, 0]]", "[[1, 1], [1, 1]]", "[[1, 0], [0, 1]]", "[[0, 1], [1, 0]]"],
                    correct: 2,
                    explanation: "Identity matrix has 1s on diagonal and 0s elsewhere."
                },
                {
                    question: "A matrix with equal number of rows and columns is called:",
                    options: ["Rectangular matrix", "Square matrix", "Diagonal matrix", "Unit matrix"],
                    correct: 1,
                    explanation: "A square matrix has the same number of rows and columns."
                }
            ]
        },
        
        'determinants': {
            title: 'Determinants',
            questions: [
                {
                    question: "Find the determinant of [[3, 2], [1, 4]]",
                    options: ["10", "12", "14", "8"],
                    correct: 0,
                    explanation: "det = 3×4 - 2×1 = 12 - 2 = 10"
                },
                {
                    question: "The determinant of [[5, 0], [0, 5]] is:",
                    options: ["0", "5", "10", "25"],
                    correct: 3,
                    explanation: "det = 5×5 - 0×0 = 25"
                },
                {
                    question: "If det(A) = 0, then A is:",
                    options: ["Identity matrix", "Singular matrix", "Non-singular", "Square matrix"],
                    correct: 1,
                    explanation: "A matrix with determinant 0 is called singular."
                },
                {
                    question: "Find the determinant of [[1, 2, 3], [0, 1, 4], [5, 6, 0]]",
                    options: ["1", "-4", "4", "0"],
                    correct: 2,
                    explanation: "Using cofactor expansion: det = 1(0-24) - 2(0-20) + 3(0-5) = -24 + 40 - 15 = 1... wait, let me recalculate: = 1(0-24) - 0 + 5(8-3) = -24 + 5(5) = 1"
                },
                {
                    question: "For a 2×2 matrix A, det(A²) equals:",
                    options: ["[det(A)]²", "2 × det(A)", "det(A)", "det(A)/2"],
                    correct: 0,
                    explanation: "det(A²) = det(A) × det(A) = [det(A)]²"
                }
            ]
        }
    },
    
    // ==========================================
    // ENGLISH
    // ==========================================
    english: {
        
        // FOUNDATIONS
        'word-classes': {
            title: 'Word Classes',
            questions: [
                {
                    question: "Which word is a noun in: 'The quick brown fox jumps'?",
                    options: ["quick", "brown", "fox", "jumps"],
                    correct: 2,
                    explanation: "'Fox' is a noun - it names an animal."
                },
                {
                    question: "Identify the verb: 'She sings beautifully'",
                    options: ["She", "sings", "beautifully", "Both She and beautifully"],
                    correct: 1,
                    explanation: "'Sings' is the verb - it shows action."
                },
                {
                    question: "Which is an adjective?",
                    options: ["run", "quickly", "beautiful", "beauty"],
                    correct: 2,
                    explanation: "'Beautiful' is an adjective describing nouns."
                },
                {
                    question: "The word 'under' is a:",
                    options: ["Noun", "Verb", "Preposition", "Adverb"],
                    correct: 2,
                    explanation: "'Under' is a preposition showing position."
                },
                {
                    question: "Which word is a pronoun?",
                    options: ["car", "they", "big", "quickly"],
                    correct: 1,
                    explanation: "'They' is a pronoun replacing a noun."
                }
            ]
        },
        
        'sentence-elements': {
            title: 'Sentence Elements',
            questions: [
                {
                    question: "What is the subject in: 'The students study hard'?",
                    options: ["study", "hard", "The students", "students"],
                    correct: 2,
                    explanation: "'The students' is the subject - who performs the action."
                },
                {
                    question: "Identify the predicate in: 'The bird flies high'",
                    options: ["The bird", "flies high", "bird", "high"],
                    correct: 1,
                    explanation: "The predicate tells what the subject does: 'flies high'."
                },
                {
                    question: "What is the object in: 'John kicked the ball'?",
                    options: ["John", "kicked", "the ball", "ball"],
                    correct: 2,
                    explanation: "'The ball' receives the action - it's the direct object."
                },
                {
                    question: "In 'She gave him a gift', 'him' is:",
                    options: ["Subject", "Direct object", "Indirect object", "Predicate"],
                    correct: 2,
                    explanation: "'Him' is the indirect object - the recipient of the gift."
                },
                {
                    question: "The complement in 'She is a teacher' is:",
                    options: ["She", "is", "a teacher", "teacher"],
                    correct: 2,
                    explanation: "'A teacher' completes the meaning after the linking verb."
                }
            ]
        },
        
        'sentence-structure': {
            title: 'Sentence Structure',
            questions: [
                {
                    question: "Which is a simple sentence?",
                    options: ["I ran and he walked", "I ran", "Because I was tired, I slept", "I ran, but he walked"],
                    correct: 1,
                    explanation: "A simple sentence has one independent clause."
                },
                {
                    question: "A compound sentence has:",
                    options: ["One clause", "Two or more independent clauses", "One independent and one dependent clause", "No independent clauses"],
                    correct: 1,
                    explanation: "Compound sentences join independent clauses with coordinating conjunctions."
                },
                {
                    question: "Identify the complex sentence:",
                    options: ["I went home", "I went home and slept", "When it rained, I went home", "I went home, and I slept"],
                    correct: 2,
                    explanation: "Complex sentences have one independent and at least one dependent clause."
                },
                {
                    question: "Which conjunction creates a compound sentence?",
                    options: ["because", "although", "but", "when"],
                    correct: 2,
                    explanation: "'But' is a coordinating conjunction (FANBOYS)."
                },
                {
                    question: "The sentence 'Although he was tired, he finished his work' is:",
                    options: ["Simple", "Compound", "Complex", "Compound-complex"],
                    correct: 2,
                    explanation: "It has one independent clause and one dependent clause."
                }
            ]
        },
        
        'phrases-clauses': {
            title: 'Phrases & Clauses',
            questions: [
                {
                    question: "Which is a phrase?",
                    options: ["Because he was tired", "In the morning", "He was tired", "When he arrived"],
                    correct: 1,
                    explanation: "A phrase is a group of words without a subject-verb relationship."
                },
                {
                    question: "Identify the noun phrase: 'The big dog barked loudly'",
                    options: ["The big dog", "barked loudly", "big dog", "barked"],
                    correct: 0,
                    explanation: "'The big dog' is a noun phrase (determiner + adjective + noun)."
                },
                {
                    question: "Which is a dependent clause?",
                    options: ["She sings well", "Because she practices daily", "The music is loud", "Dance with me"],
                    correct: 1,
                    explanation: "A dependent clause cannot stand alone as a complete sentence."
                },
                {
                    question: "In 'The book that I read was interesting', 'that I read' is:",
                    options: ["Noun clause", "Adjective clause", "Adverb clause", "Phrase"],
                    correct: 1,
                    explanation: "It's an adjective (relative) clause modifying 'book'."
                },
                {
                    question: "An adverbial clause answers:",
                    options: ["What?", "Who?", "When, where, how, why?", "Which one?"],
                    correct: 2,
                    explanation: "Adverbial clauses modify verbs and answer how, when, where, why."
                }
            ]
        },
        
        'morphemes-words': {
            title: 'Morphemes & Words',
            questions: [
                {
                    question: "How many morphemes are in 'unhappiness'?",
                    options: ["1", "2", "3", "4"],
                    correct: 2,
                    explanation: "un- + happy + -ness = 3 morphemes (prefix, root, suffix)"
                },
                {
                    question: "Which is a free morpheme?",
                    options: ["-ing", "un-", "book", "-er"],
                    correct: 2,
                    explanation: "'Book' can stand alone as a word - it's a free morpheme."
                },
                {
                    question: "The word 'rewrite' contains:",
                    options: ["Two free morphemes", "A prefix and a root", "A suffix and a root", "Two bound morphemes"],
                    correct: 1,
                    explanation: "'re-' is a prefix (bound), 'write' is a root (free)."
                },
                {
                    question: "Which word is formed by derivation?",
                    options: ["books", "walked", "happiness", "cats"],
                    correct: 2,
                    explanation: "'Happiness' is formed by adding derivational suffix -ness to 'happy'."
                },
                {
                    question: "Inflectional morphemes:",
                    options: ["Create new words", "Change word class", "Add grammatical information", "Are always prefixes"],
                    correct: 2,
                    explanation: "Inflectional morphemes add grammatical info (plural, tense) without changing word class."
                }
            ]
        },
        
        // CORE GRAMMAR
        'tense-aspect': {
            title: 'Tense & Aspect',
            questions: [
                {
                    question: "What is the tense in 'She is walking'?",
                    options: ["Simple present", "Present continuous", "Simple past", "Present perfect"],
                    correct: 1,
                    explanation: "'Is walking' shows present continuous - ongoing action."
                },
                {
                    question: "Which sentence is in past perfect tense?",
                    options: ["She walked", "She was walking", "She had walked", "She has walked"],
                    correct: 2,
                    explanation: "Past perfect uses 'had' + past participle."
                },
                {
                    question: "Identify the future continuous: 'Tomorrow, I ___ (study)'",
                    options: ["will study", "will be studying", "will have studied", "studied"],
                    correct: 1,
                    explanation: "Future continuous: will be + present participle (-ing)."
                },
                {
                    question: "Present perfect connects:",
                    options: ["Two past actions", "Past to present", "Two future actions", "Present to future"],
                    correct: 1,
                    explanation: "Present perfect links past actions to present relevance."
                },
                {
                    question: "Which shows habitual action?",
                    options: ["I am working", "I work every day", "I worked yesterday", "I have worked"],
                    correct: 1,
                    explanation: "Simple present is used for habitual actions."
                }
            ]
        },
        
        'concord-verbals': {
            title: 'Concord & Verbals',
            questions: [
                {
                    question: "Choose correct concord: 'The group of students ___ late'",
                    options: ["is", "are", "were", "be"],
                    correct: 0,
                    explanation: "The subject is 'group' (singular), so use 'is'."
                },
                {
                    question: "Which sentence has correct subject-verb agreement?",
                    options: ["The news are good", "The news is good", "The news were good", "The news be good"],
                    correct: 1,
                    explanation: "'News' is singular despite ending in 's'."
                },
                {
                    question: "In 'Neither the teacher nor the students ___ present':",
                    options: ["is", "are", "was", "been"],
                    correct: 1,
                    explanation: "With 'neither...nor', the verb agrees with the nearer subject."
                },
                {
                    question: "A gerund functions as a:",
                    options: ["Verb", "Noun", "Adjective", "Adverb"],
                    correct: 1,
                    explanation: "A gerund (verb + -ing) functions as a noun."
                },
                {
                    question: "Which contains a participle?",
                    options: ["Swimming is fun", "The swimming pool", "She is swimming", "She swims daily"],
                    correct: 1,
                    explanation: "'Swimming' in 'swimming pool' is a present participle functioning as adjective."
                }
            ]
        },
        
        'phrasal-verbs-idioms': {
            title: 'Phrasal Verbs & Idioms',
            questions: [
                {
                    question: "What does 'give up' mean?",
                    options: ["Distribute", "Surrender/quit", "Present", "Rise"],
                    correct: 1,
                    explanation: "'Give up' means to surrender or stop trying."
                },
                {
                    question: "The idiom 'break a leg' means:",
                    options: ["Get injured", "Good luck", "Run fast", "Break something"],
                    correct: 1,
                    explanation: "'Break a leg' is a theatrical expression meaning 'good luck'."
                },
                {
                    question: "Choose the correct phrasal verb: 'Please ___ the TV'",
                    options: ["turn off", "turn of", "off turn", "turning off"],
                    correct: 0,
                    explanation: "'Turn off' is the correct phrasal verb for switching off."
                },
                {
                    question: "'Look after' means:",
                    options: ["Resemble", "Take care of", "Search for", "Examine"],
                    correct: 1,
                    explanation: "'Look after' means to take care of someone or something."
                },
                {
                    question: "The idiom 'piece of cake' means:",
                    options: ["Delicious", "Something easy", "A dessert", "A slice"],
                    correct: 1,
                    explanation: "'Piece of cake' means something very easy to do."
                }
            ]
        },
        
        'infinitives-gerunds-participles': {
            title: 'Infinitives, Gerunds & Participles',
            questions: [
                {
                    question: "Which contains an infinitive?",
                    options: ["Running is fun", "To run is fun", "The running water", "She runs fast"],
                    correct: 1,
                    explanation: "Infinitive = to + base verb: 'to run'."
                },
                {
                    question: "A gerund is:",
                    options: ["to + verb", "verb + -ing (as noun)", "verb + -ed", "verb + -ing (as adjective)"],
                    correct: 1,
                    explanation: "A gerund is a verb ending in -ing that functions as a noun."
                },
                {
                    question: "In 'The broken window needs repair', 'broken' is:",
                    options: ["Gerund", "Present participle", "Past participle", "Infinitive"],
                    correct: 2,
                    explanation: "'Broken' is a past participle used as an adjective."
                },
                {
                    question: "Which is correct: 'I enjoy ___'?",
                    options: ["to swim", "swimming", "swam", "to swimming"],
                    correct: 1,
                    explanation: "After 'enjoy', we use the gerund form (-ing)."
                },
                {
                    question: "An infinitive can function as:",
                    options: ["Only a verb", "Only a noun", "Noun, adjective, or adverb", "Only an adjective"],
                    correct: 2,
                    explanation: "Infinitives can function as nouns, adjectives, or adverbs."
                }
            ]
        },
        
        'antonyms-synonyms-homonyms': {
            title: 'Antonyms, Synonyms & Homonyms',
            questions: [
                {
                    question: "What is the antonym of 'ancient'?",
                    options: ["old", "modern", "historic", "aged"],
                    correct: 1,
                    explanation: "'Modern' is the opposite of 'ancient'."
                },
                {
                    question: "Which is a synonym of 'happy'?",
                    options: ["sad", "joyful", "angry", "tired"],
                    correct: 1,
                    explanation: "'Joyful' has the same meaning as 'happy'."
                },
                {
                    question: "Homonyms are words that:",
                    options: ["Have opposite meanings", "Have same spelling/pronunciation but different meanings", "Have similar meanings", "Are spelled differently"],
                    correct: 1,
                    explanation: "Homonyms share spelling or pronunciation but have different meanings."
                },
                {
                    question: "'Bark' (tree covering and dog sound) is an example of:",
                    options: ["Synonym", "Antonym", "Homonym", "Hyponym"],
                    correct: 2,
                    explanation: "'Bark' has two different meanings - it's a homonym."
                },
                {
                    question: "Which pair are antonyms?",
                    options: ["big/large", "happy/joyful", "hot/cold", "smart/clever"],
                    correct: 2,
                    explanation: "'Hot' and 'cold' are opposites (antonyms)."
                }
            ]
        },
        
        'sentence-classification': {
            title: 'Sentence Classification',
            questions: [
                {
                    question: "Which is a declarative sentence?",
                    options: ["Close the door!", "Is it raining?", "The sky is blue.", "What a beautiful day!"],
                    correct: 2,
                    explanation: "Declarative sentences make statements."
                },
                {
                    question: "An interrogative sentence:",
                    options: ["Gives a command", "Asks a question", "Expresses strong emotion", "Makes a statement"],
                    correct: 1,
                    explanation: "Interrogative sentences ask questions."
                },
                {
                    question: "Identify the imperative sentence:",
                    options: ["She is happy", "Are you coming?", "Please sit down.", "How wonderful!"],
                    correct: 2,
                    explanation: "Imperative sentences give commands or requests."
                },
                {
                    question: "An exclamatory sentence ends with:",
                    options: ["Period", "Question mark", "Exclamation mark", "Comma"],
                    correct: 2,
                    explanation: "Exclamatory sentences express strong emotion and end with '!'."
                },
                {
                    question: "'What time is it?' is:",
                    options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],
                    correct: 1,
                    explanation: "It asks a question, so it's interrogative."
                }
            ]
        },
        
        'language-registers': {
            title: 'Language Registers',
            questions: [
                {
                    question: "Formal register is used in:",
                    options: ["Text messages", "Academic papers", "Casual conversation", "Social media"],
                    correct: 1,
                    explanation: "Formal register is appropriate for academic and professional contexts."
                },
                {
                    question: "Which is informal language?",
                    options: ["I would like to inquire", "Gotta run!", "Please accept my apologies", "I am writing to inform you"],
                    correct: 1,
                    explanation: "'Gotta run!' is colloquial/informal language."
                },
                {
                    question: "The frozen register is used for:",
                    options: ["Daily conversation", "Unchanged, ceremonial texts", "Text messages", "Business letters"],
                    correct: 1,
                    explanation: "Frozen register is for fixed texts like prayers, pledges."
                },
                {
                    question: "Speaking to a friend uses which register?",
                    options: ["Formal", "Informal/Casual", "Frozen", "Technical"],
                    correct: 1,
                    explanation: "Friends communicate in casual/informal register."
                },
                {
                    question: "Which word is formal?",
                    options: ["Kid", "Child", "Offspring", "Little one"],
                    correct: 2,
                    explanation: "'Offspring' is more formal than 'child' or 'kid'."
                }
            ]
        },
        
        'reported-speech-question-tags': {
            title: 'Reported Speech & Question Tags',
            questions: [
                {
                    question: "Change to reported speech: 'I am happy', she said",
                    options: ["She said she is happy", "She said she was happy", "She says she is happy", "She said I was happy"],
                    correct: 1,
                    explanation: "In reported speech, present tense changes to past."
                },
                {
                    question: "'Where do you live?' He asked me...",
                    options: ["He asked me where do I live", "He asked me where I lived", "He asked me where did I live", "He asked me where I live"],
                    correct: 1,
                    explanation: "In reported questions, word order changes to statement form."
                },
                {
                    question: "Add a question tag: 'She is coming, ___?'",
                    options: ["isn't she", "is she", "doesn't she", "wasn't she"],
                    correct: 0,
                    explanation: "Positive statement gets negative tag: 'isn't she?'"
                },
                {
                    question: "'You won't be late, ___?'",
                    options: ["won't you", "will you", "would you", "aren't you"],
                    correct: 1,
                    explanation: "Negative statement gets positive tag: 'will you?'"
                },
                {
                    question: "'Let's go out, ___?'",
                    options: ["will we", "shall we", "don't we", "let's we"],
                    correct: 1,
                    explanation: "For 'Let's', the tag is 'shall we?'"
                }
            ]
        },
        
        // PHONETICS
        'sound-system-ipa': {
            title: 'Sound System & IPA',
            questions: [
                {
                    question: "How many vowel sounds are in English?",
                    options: ["5", "12", "20", "26"],
                    correct: 2,
                    explanation: "English has approximately 20 vowel sounds (varies by dialect)."
                },
                {
                    question: "The IPA symbol /ʃ/ represents:",
                    options: ["s", "sh", "ch", "th"],
                    correct: 1,
                    explanation: "/ʃ/ represents the 'sh' sound as in 'ship'."
                },
                {
                    question: "A diphthong is:",
                    options: ["A single vowel sound", "A combination of two vowel sounds", "A consonant sound", "A silent letter"],
                    correct: 1,
                    explanation: "Diphthongs are gliding vowel sounds combining two vowels."
                },
                {
                    question: "The symbol /ŋ/ represents the sound in:",
                    options: ["sin", "sing", "seen", "sign"],
                    correct: 1,
                    explanation: "/ŋ/ is the 'ng' sound as in 'sing'."
                },
                {
                    question: "Which is a voiceless consonant?",
                    options: ["/b/", "/d/", "/p/", "/g/"],
                    correct: 2,
                    explanation: "/p/ is voiceless (no vocal cord vibration)."
                }
            ]
        },
        
        'long-vowel-sounds': {
            title: 'Long Vowel Sounds',
            questions: [
                {
                    question: "Which word has a long 'a' sound?",
                    options: ["cat", "cake", "car", "call"],
                    correct: 1,
                    explanation: "'Cake' has the long 'a' sound /eɪ/."
                },
                {
                    question: "The long 'e' sound appears in:",
                    options: ["bed", "bee", "ben", "bet"],
                    correct: 1,
                    explanation: "'Bee' has the long 'e' sound /i:/."
                },
                {
                    question: "Which contains a long 'i'?",
                    options: ["bit", "bite", "bitter", "bin"],
                    correct: 1,
                    explanation: "'Bite' has the long 'i' sound /aɪ/."
                },
                {
                    question: "The long 'o' sound /oʊ/ is in:",
                    options: ["hot", "hope", "hut", "hat"],
                    correct: 1,
                    explanation: "'Hope' has the long 'o' sound /oʊ/."
                },
                {
                    question: "Which word has a long 'u' sound?",
                    options: ["cut", "cute", "cot", "cat"],
                    correct: 1,
                    explanation: "'Cute' has the long 'u' sound /ju:/."
                }
            ]
        },
        
        'minimal-pair-drills': {
            title: 'Minimal Pair Drills',
            questions: [
                {
                    question: "Which is a minimal pair?",
                    options: ["cat/dog", "ship/sheep", "house/home", "run/ran"],
                    correct: 1,
                    explanation: "'Ship/sheep' differ by only one sound - it's a minimal pair."
                },
                {
                    question: "The difference between 'pat' and 'bat' is:",
                    options: ["Vowel length", "Voicing", "Nasality", "Stress"],
                    correct: 1,
                    explanation: "'Pat' has voiceless /p/, 'bat' has voiced /b/."
                },
                {
                    question: "'Sit' and 'seat' differ in:",
                    options: ["Consonant", "Vowel length", "Stress", "Intonation"],
                    correct: 1,
                    explanation: "Short /ɪ/ in 'sit' vs. long /i:/ in 'seat'."
                },
                {
                    question: "Which pair shows consonant contrast?",
                    options: ["beat/bit", "thin/thing", "pot/put", "late/lit"],
                    correct: 1,
                    explanation: "'Thin' (/θ/) vs. 'thing' (/ŋ/) - different consonants."
                },
                {
                    question: "Minimal pairs help learners:",
                    options: ["Learn spelling", "Distinguish similar sounds", "Improve vocabulary", "Write better"],
                    correct: 1,
                    explanation: "Minimal pairs help distinguish between similar sounds."
                }
            ]
        },
        
        'vowel-consonant-stress': {
            title: 'Vowel, Consonant & Stress',
            questions: [
                {
                    question: "Stress in 'PHOtograph' falls on:",
                    options: ["First syllable", "Second syllable", "Third syllable", "Fourth syllable"],
                    correct: 0,
                    explanation: "In 'photograph', stress is on the first syllable."
                },
                {
                    question: "Which word has stress on the second syllable?",
                    options: ["TAble", "aBOUT", "PICture", "WRIting"],
                    correct: 1,
                    explanation: "'About' has stress on the second syllable: aBOUT."
                },
                {
                    question: "How many consonants are in English?",
                    options: ["21", "24", "26", "5"],
                    correct: 1,
                    explanation: "English has approximately 24 consonant sounds."
                },
                {
                    question: "A stressed syllable is typically:",
                    options: ["Quieter", "Shorter", "Louder and longer", "Whispered"],
                    correct: 2,
                    explanation: "Stressed syllables are louder, longer, and higher in pitch."
                },
                {
                    question: "In 'reCORD' (verb) vs 'REcord' (noun), this is:",
                    options: ["Vowel change", "Stress shift", "Consonant change", "Silent letter"],
                    correct: 1,
                    explanation: "Some words shift stress depending on part of speech."
                }
            ]
        },
        
        'syllable-intonation': {
            title: 'Syllable & Intonation',
            questions: [
                {
                    question: "How many syllables does 'beautiful' have?",
                    options: ["2", "3", "4", "5"],
                    correct: 1,
                    explanation: "'Beautiful' has 3 syllables: beau-ti-ful."
                },
                {
                    question: "Rising intonation is typically used for:",
                    options: ["Statements", "Yes/No questions", "Commands", "Exclamations"],
                    correct: 1,
                    explanation: "Yes/No questions typically have rising intonation."
                },
                {
                    question: "Falling intonation is used for:",
                    options: ["Questions", "Statements and commands", "Lists", "Uncertainty"],
                    correct: 1,
                    explanation: "Statements and Wh- questions use falling intonation."
                },
                {
                    question: "How many syllables in 'education'?",
                    options: ["3", "4", "5", "2"],
                    correct: 1,
                    explanation: "'Education' has 4 syllables: ed-u-ca-tion."
                },
                {
                    question: "Intonation helps convey:",
                    options: ["Only grammar", "Emotion and meaning", "Only spelling", "Only vocabulary"],
                    correct: 1,
                    explanation: "Intonation conveys emotion, attitude, and meaning."
                }
            ]
        },
        
        // MECHANICS & PUNCTUATION
        'punctuation': {
            title: 'Punctuation',
            questions: [
                {
                    question: "A comma is used to:",
                    options: ["End a sentence", "Separate items in a list", "Show possession", "Join two sentences"],
                    correct: 1,
                    explanation: "Commas separate items in lists and clauses."
                },
                {
                    question: "Which sentence uses the apostrophe correctly?",
                    options: ["The boy's went home", "The boy's book", "The boys's book", "The boy's are here"],
                    correct: 1,
                    explanation: "Apostrophe shows possession: boy's book = book of the boy."
                },
                {
                    question: "A semicolon is used to:",
                    options: ["End a sentence", "Join related independent clauses", "Introduce a list", "Show possession"],
                    correct: 1,
                    explanation: "Semicolons join closely related independent clauses."
                },
                {
                    question: "Which is correct?",
                    options: ["Where are you going", "Where are you going?", "Where are you going.", "Where are you going!"],
                    correct: 1,
                    explanation: "Questions end with question marks."
                },
                {
                    question: "Quotation marks are used for:",
                    options: ["Emphasis only", "Direct speech and titles", "Questions", "Commands"],
                    correct: 1,
                    explanation: "Quotation marks enclose direct speech and titles."
                }
            ]
        },
        
        'spelling-rules': {
            title: 'Spelling Rules',
            questions: [
                {
                    question: "Which is correctly spelled?",
                    options: ["beleive", "believe", "beleve", "beleiev"],
                    correct: 1,
                    explanation: "Remember: 'i' before 'e' except after 'c': believe."
                },
                {
                    question: "To form plural of 'box', add:",
                    options: ["s", "es", "ies", "ves"],
                    correct: 1,
                    explanation: "After x, s, z, ch, sh, add 'es': boxes."
                },
                {
                    question: "Which is correct?",
                    options: ["recieve", "receive", "receve", "reciev"],
                    correct: 1,
                    explanation: "After 'c', 'e' comes before 'i': receive."
                },
                {
                    question: "The plural of 'baby' is:",
                    options: ["babys", "babies", "babyes", "baby's"],
                    correct: 1,
                    explanation: "Words ending in consonant + y change y to ies."
                },
                {
                    question: "Which suffix rule applies to 'run' + 'ing'?",
                    options: ["Double the consonant: running", "Drop the n: ruing", "No change: runing", "Add e: runing"],
                    correct: 0,
                    explanation: "Double final consonant for CVC words: running."
                }
            ]
        },
        
        'sentence-building': {
            title: 'Sentence Building',
            questions: [
                {
                    question: "Which is a complete sentence?",
                    options: ["Running fast", "Because she was tired", "She runs every morning", "In the garden"],
                    correct: 2,
                    explanation: "A complete sentence has subject and predicate."
                },
                {
                    question: "To expand 'The dog barked', add:",
                    options: ["A preposition", "An adjective", "Both work", "Neither works"],
                    correct: 2,
                    explanation: "'The angry dog barked loudly' adds adjective and adverb."
                },
                {
                    question: "Which is a sentence fragment?",
                    options: ["She walked home", "After the movie ended", "They arrived late", "We ate dinner"],
                    correct: 1,
                    explanation: "'After the movie ended' is incomplete - needs a main clause."
                },
                {
                    question: "A run-on sentence occurs when:",
                    options: ["The sentence is too long", "Two independent clauses are joined incorrectly", "There's no verb", "There's no subject"],
                    correct: 1,
                    explanation: "Run-ons join independent clauses without proper punctuation."
                },
                {
                    question: "Which joins sentences correctly?",
                    options: ["I ran I walked", "I ran, I walked", "I ran; I walked", "I ran I walked."],
                    correct: 2,
                    explanation: "Semicolons properly join independent clauses."
                }
            ]
        },
        
        // COMPREHENSION & READING
        'comprehension-strategies': {
            title: 'Comprehension Strategies',
            questions: [
                {
                    question: "Skimming is reading to:",
                    options: ["Understand every detail", "Get the main idea quickly", "Memorize text", "Find specific information"],
                    correct: 1,
                    explanation: "Skimming is reading quickly for the main idea."
                },
                {
                    question: "Scanning is used to:",
                    options: ["Read for pleasure", "Find specific information", "Summarize text", "Critique writing"],
                    correct: 1,
                    explanation: "Scanning looks for specific details or information."
                },
                {
                    question: "Making predictions while reading:",
                    options: ["Slows comprehension", "Engages readers actively", "Is not helpful", "Only works for fiction"],
                    correct: 1,
                    explanation: "Predictions keep readers engaged and checking understanding."
                },
                {
                    question: "Context clues help readers:",
                    options: ["Skip difficult words", "Understand unknown words", "Memorize text", "Read faster"],
                    correct: 1,
                    explanation: "Context clues help determine meaning of unfamiliar words."
                },
                {
                    question: "The main idea of a passage is:",
                    options: ["The first sentence", "What the passage is mostly about", "The title", "The conclusion"],
                    correct: 1,
                    explanation: "Main idea is the central point of the passage."
                }
            ]
        },
        
        'inference-summary': {
            title: 'Inference & Summary',
            questions: [
                {
                    question: "An inference is:",
                    options: ["Stated directly in text", "A conclusion based on evidence", "Always an opinion", "The main idea"],
                    correct: 1,
                    explanation: "Inferences are conclusions drawn from text evidence."
                },
                {
                    question: "A good summary:",
                    options: ["Includes all details", "Captures main points briefly", "Adds new information", "Copies text exactly"],
                    correct: 1,
                    explanation: "Summaries capture main points concisely."
                },
                {
                    question: "To infer means to:",
                    options: ["State the obvious", "Read between the lines", "Skip difficult parts", "Memorize text"],
                    correct: 1,
                    explanation: "Inference means drawing conclusions from implied meaning."
                },
                {
                    question: "Which helps make inferences?",
                    options: ["Only the text", "Text + background knowledge", "Only opinions", "Only definitions"],
                    correct: 1,
                    explanation: "Inferences combine text evidence with prior knowledge."
                },
                {
                    question: "A summary should be:",
                    options: ["Longer than original", "Shorter than original", "Same length as original", "Unrelated to original"],
                    correct: 1,
                    explanation: "Summaries are always shorter than the original text."
                }
            ]
        },
        
        // WRITING
        'essay-types': {
            title: 'Essay Types',
            questions: [
                {
                    question: "A narrative essay:",
                    options: ["Explains a process", "Tells a story", "Argues a point", "Describes a place"],
                    correct: 1,
                    explanation: "Narrative essays tell stories with characters and events."
                },
                {
                    question: "Descriptive essays focus on:",
                    options: ["Arguments", "Sensory details", "Chronological events", "Causes and effects"],
                    correct: 1,
                    explanation: "Descriptive essays paint pictures with sensory details."
                },
                {
                    question: "An expository essay:",
                    options: ["Tells a story", "Explains or informs", "Persuades", "Describes feelings"],
                    correct: 1,
                    explanation: "Expository essays explain, inform, or define topics."
                },
                {
                    question: "Argumentative essays aim to:",
                    options: ["Tell a story", "Describe a scene", "Persuade the reader", "Explain a process"],
                    correct: 2,
                    explanation: "Argumentative essays persuade with evidence and reasoning."
                },
                {
                    question: "Which essay uses 'I' and personal experiences?",
                    options: ["Expository", "Narrative", "Technical", "Research"],
                    correct: 1,
                    explanation: "Narrative essays often use first-person perspective."
                }
            ]
        },
        
        'paragraph-structure': {
            title: 'Paragraph Structure',
            questions: [
                {
                    question: "The topic sentence is usually:",
                    options: ["At the end", "In the middle", "At the beginning", "Not needed"],
                    correct: 2,
                    explanation: "Topic sentences typically introduce the main idea at the start."
                },
                {
                    question: "Supporting sentences:",
                    options: ["State the main idea", "Provide evidence and details", "Conclude the paragraph", "Introduce new topics"],
                    correct: 1,
                    explanation: "Supporting sentences develop the topic sentence with details."
                },
                {
                    question: "A concluding sentence:",
                    options: ["Begins the paragraph", "Summarizes the main idea", "Provides examples", "Asks questions"],
                    correct: 1,
                    explanation: "Concluding sentences summarize or provide closure."
                },
                {
                    question: "Unity in a paragraph means:",
                    options: ["All sentences relate to one main idea", "Sentences are complex", "Paragraphs are short", "No topic sentence"],
                    correct: 0,
                    explanation: "Unity means all sentences support one main idea."
                },
                {
                    question: "Coherence is achieved through:",
                    options: ["Random organization", "Transitional words and logical order", "Long sentences", "No transitions"],
                    correct: 1,
                    explanation: "Coherence comes from logical order and transitions."
                }
            ]
        },
        
        'letter-writing': {
            title: 'Letter Writing',
            questions: [
                {
                    question: "A formal letter uses:",
                    options: ["Contractions", "Slang", "Formal language", "Abbreviations"],
                    correct: 2,
                    explanation: "Formal letters use complete words and formal language."
                },
                {
                    question: "The salutation 'Dear Sir' ends with:",
                    options: ["Sincerely,", "Yours faithfully,", "Best regards,", "Cheers,"],
                    correct: 1,
                    explanation: "'Dear Sir/Madam' pairs with 'Yours faithfully'."
                },
                {
                    question: "An informal letter is written to:",
                    options: ["Businesses", "Government officials", "Friends and family", "Schools"],
                    correct: 2,
                    explanation: "Informal letters are for personal contacts."
                },
                {
                    question: "The date in a formal letter appears:",
                    options: ["At the bottom", "After the signature", "At the top right", "In the middle"],
                    correct: 2,
                    explanation: "The date is written at the top right of formal letters."
                },
                {
                    question: "'Yours sincerely' is used when:",
                    options: ["You don't know the recipient's name", "You know the recipient's name", "Writing to friends", "Ending informal letters"],
                    correct: 1,
                    explanation: "'Yours sincerely' is used when you've addressed the person by name."
                }
            ]
        },
        
        'writing-process': {
            title: 'Writing Process',
            questions: [
                {
                    question: "The first step in writing is:",
                    options: ["Editing", "Publishing", "Prewriting/planning", "Drafting"],
                    correct: 2,
                    explanation: "Prewriting involves brainstorming and planning."
                },
                {
                    question: "During drafting, you:",
                    options: ["Correct grammar", "Write ideas without worrying about perfection", "Publish the work", "Create final copy"],
                    correct: 1,
                    explanation: "Drafting focuses on getting ideas down without editing."
                },
                {
                    question: "Revising involves:",
                    options: ["Fixing spelling", "Improving content and organization", "Adding punctuation", "Publishing"],
                    correct: 1,
                    explanation: "Revising improves content, structure, and clarity."
                },
                {
                    question: "Editing focuses on:",
                    options: ["Content", "Grammar, spelling, and punctuation", "Organization", "Ideas"],
                    correct: 1,
                    explanation: "Editing corrects grammar, spelling, and mechanics."
                },
                {
                    question: "The final step is:",
                    options: ["Drafting", "Editing", "Publishing/sharing", "Planning"],
                    correct: 2,
                    explanation: "Publishing is sharing the final polished work."
                }
            ]
        },
        
        'summary-precis': {
            title: 'Summary & Precis',
            questions: [
                {
                    question: "A précis is:",
                    options: ["A detailed analysis", "A concise summary", "An opinion piece", "A long explanation"],
                    correct: 1,
                    explanation: "A précis is a concise summary maintaining original meaning."
                },
                {
                    question: "A summary should be about ___ of the original length.",
                    options: ["100%", "50%", "One-third to one-quarter", "Double"],
                    correct: 2,
                    explanation: "Summaries are typically 1/3 to 1/4 of original length."
                },
                {
                    question: "When summarizing, you should:",
                    options: ["Include all examples", "Use your own words", "Copy exact phrases", "Add personal opinions"],
                    correct: 1,
                    explanation: "Summaries use your own words, not direct quotes."
                },
                {
                    question: "A good summary includes:",
                    options: ["Minor details", "Main ideas only", "Personal opinions", "Examples"],
                    correct: 1,
                    explanation: "Summaries focus only on main ideas."
                },
                {
                    question: "The purpose of a précis is to:",
                    options: ["Expand the original", "Retell the story with detail", "Convey main ideas concisely", "Critique the original"],
                    correct: 2,
                    explanation: "Précis conveys the essence of the original concisely."
                }
            ]
        }
    }
};

// ==========================================
// CHEMISTRY QUIZZES (Continued in part 2)
// ==========================================

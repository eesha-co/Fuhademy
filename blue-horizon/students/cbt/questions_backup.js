// JAMB Past Questions organized by Subject and Year
// Mathematics: 1983-2004 | Chemistry: 2010-2018 | Other subjects: Sample questions

const jambQuestions = {
    "Mathematics": {
        years: ["1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004"],
        questionsByYear: {
          "1983": [
                    {
                              "question": "If M represents the median and D the mode of the measurements 5, 9, 3, 5, 8 then (M,D) is",
                              "options": [
                                        "(6,5)",
                                        "(5,8)",
                                        "(5,7)",
                                        "(5,5)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A construction company is owned by two partners X and Y and it is agreed that their profit will be divided in the ratio 4:5. At the end of the year, Y received #5,000 more than X. What is the total profit of the company for the year?",
                              "options": [
                                        "#20,000.00",
                                        "#25,000.00",
                                        "#30,000.00",
                                        "#45,000.00"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given a regular hexagon, calculate each interior angle of the hexagon.",
                              "options": [
                                        "60°",
                                        "30°",
                                        "120°",
                                        "45°"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If x = 1 is a root of the equation x³ - 2x² - 5x + 6, find the other roots.",
                              "options": [
                                        "-3 and 2",
                                        "-2 and 2",
                                        "3 and -2",
                                        "1 and 3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If x is jointly proportional to the cube of y and the fourth power of z. In what ratio is x increased or decreased when y is halved and z is doubled?",
                              "options": [
                                        "4:1 increase",
                                        "2:1 increase",
                                        "1:4 decrease",
                                        "1:1 no change"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the value of (0.303)³ - (0.02)³",
                              "options": [
                                        "0.019",
                                        "0.0019",
                                        "0.00019",
                                        "0.000019"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify (x - 7)/(x² - 9) × (x² - 3x)/(x² - 49)",
                              "options": [
                                        "x/(x-3)(x+7)",
                                        "(x+3)(x+7)/x",
                                        "x/(x-3)(x-7)",
                                        "x/(x+3)(x+7)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The scores of a set of final year students in an examination are 41, 29, 55, 21, 47, 70, 70, 40, 43, 56, 73, 23, 50, 50. Find the median of the scores.",
                              "options": [
                                        "47",
                                        "48.5",
                                        "50",
                                        "49"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the angle of the sectors representing each item in a pie chart of the following data: 6, 10, 14, 16, 26",
                              "options": [
                                        "15°, 25°, 35°, 40°, 65°",
                                        "60°, 100°, 140°, 160°, 260°",
                                        "30°, 50°, 70°, 80°, 130°",
                                        "None of the above"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The letters of the word MATRICULATION are cut and put into a box. One of the letters is drawn at random from the box. Find the probability of drawing a vowel.",
                              "options": [
                                        "2/13",
                                        "5/13",
                                        "6/13",
                                        "8/13"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The lengths of the sides of a right-angled triangle are (3x+1)cm, (3x-1)cm and x cm. Find x.",
                              "options": [
                                        "2",
                                        "6",
                                        "18",
                                        "12"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Without using tables find the numerical value of log₇49 + log₇(1/7)",
                              "options": [
                                        "1",
                                        "2",
                                        "3",
                                        "0"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Factorize completely 81a⁴ - 16b⁴",
                              "options": [
                                        "(3a + 2b) (2a - 3b) (9a² + 4b²)",
                                        "(3a - 2b) (2a - 3b) (4a² - 9b²)",
                                        "(3a - 2b) (3a - 2b) (9a² + 4b²)",
                                        "(3a - 2b) (3a + 2b) (9a² + 4b²)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "One interior angle of a convex hexagon is 170° and each of the remaining interior angles is equal to x°. Find x",
                              "options": [
                                        "120°",
                                        "110°",
                                        "105°",
                                        "130°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A ship H leaves a port P and sails 30km due South. Then it sails 60km due west. What is the bearing of H from P?",
                              "options": [
                                        "26°34'",
                                        "243°26'",
                                        "116°34'",
                                        "240°"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Correct each of the number 59.81789 and 0.0746829 to three significant figures and multiply them, giving your answer to three significant figures.",
                              "options": [
                                        "4.45",
                                        "4.46",
                                        "4.47",
                                        "4.44"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "PQR is the diameter of a semicircle RSP with centre at Q and radius of length 3.5cm. If QPT = QRT = 60°. Find the perimeter of the figure PTRS (π = 22/7)",
                              "options": [
                                        "25cm",
                                        "18cm",
                                        "36cm",
                                        "29cm"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the mean of the following: 24.57, 25.63, 25.32, 26.01, 25.77",
                              "options": [
                                        "25.12",
                                        "25.30",
                                        "25.26",
                                        "25.50"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If PT is a tangent to the circle with centre O. If PQT = 30°. Find the value of PTO",
                              "options": [
                                        "30°",
                                        "15°",
                                        "24°",
                                        "60°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A man drove for 4 hours at a certain speed, he then doubled his speed and drove for another 3 hours. Altogether he covered 600km. At what speed did he drive for the last 3 hours?",
                              "options": [
                                        "120km/hr",
                                        "60km/hr",
                                        "600/7 km/hr",
                                        "100km/hr"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1984": [
                    {
                              "question": "Simplify (2/3 - 1/5) - 1/3 of 2/5 ÷ 3 - 1/2",
                              "options": [
                                        "1/7",
                                        "7",
                                        "1/3",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 263 + 441 = 714, what number base has been used?",
                              "options": [
                                        "12",
                                        "11",
                                        "10",
                                        "9"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "P sold his bicycle to Q at a profit of 10%. Q sold it to R for #209 at a loss of 5%. How much did the bicycle cost P?",
                              "options": [
                                        "#200",
                                        "#196",
                                        "#180",
                                        "#205"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If the price of oranges was raised by 1/2k per orange, the number of oranges a customer can buy for #2.40 will be less by 16. What is the present price of an orange?",
                              "options": [
                                        "2½k",
                                        "3½k",
                                        "5½k",
                                        "20k"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A man invested a total of #50,000 in two companies. If these companies pay dividend of 6% and 8% respectively, how much did he invest at 8% if the total yield is #3,700?",
                              "options": [
                                        "#15,000",
                                        "#29,600",
                                        "#21,400",
                                        "#35,000"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Thirty boys and x girls sat for a test. The mean of the boys' scores and that of the girls were respectively 6 and 8. Find x if the total score was 468.",
                              "options": [
                                        "38",
                                        "24",
                                        "36",
                                        "22"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find without using logarithm tables, the value of Log₃27 - Log₁/₄64 ÷ Log₃1/81",
                              "options": [
                                        "7/4",
                                        "-7/4",
                                        "-3/2",
                                        "7/3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A variable point P(x, y) traces a graph in a two dimensional plane. (0, -3) is one position of P. If x increases by 1 unit, y increases by 4 units. The equation of the graph is:",
                              "options": [
                                        "y + 3 = 4x",
                                        "4y = x + 3",
                                        "y - 3 = 4x",
                                        "4y = x - 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "p varies directly as the square of q and inversely as r. If p = 36 when q = 3 and r = 4, find p when q = 5 and r = 2.",
                              "options": [
                                        "72",
                                        "100",
                                        "90",
                                        "200"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Factorise 6x² - 14x - 12",
                              "options": [
                                        "2(3x+2)(x-3)",
                                        "2(3x-2)(x+3)",
                                        "(6x+4)(x-3)",
                                        "(3x+2)(2x-6)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A straight line y = mx meets the curve y = x² - 12x + 40 in two distinct points. If one of them is (5,5), find the other.",
                              "options": [
                                        "(5,6)",
                                        "(8,8)",
                                        "(8,5)",
                                        "(7,5)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the angle of the sector representing labour in a pie chart. Labour #70, Power #15, Materials #30, Miscellaneous #5",
                              "options": [
                                        "210°",
                                        "105°",
                                        "175°",
                                        "150°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 3ⁿ × 3ⁿ - 27 × 3ⁿ⁻¹",
                              "options": [
                                        "1",
                                        "0",
                                        "1/27",
                                        "2/27"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The sum of the first 20 terms in an arithmetic progression whose first term is 7 and last term is 117 is:",
                              "options": [
                                        "1200",
                                        "1240",
                                        "1300",
                                        "1320"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "In the figure, PS = QS and QSR = 100°. Find QPR",
                              "options": [
                                        "40°",
                                        "50°",
                                        "80°",
                                        "100°"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find a factor which is common to all three binomial expressions 4a² - 9b², a³ + 27b³, (4a + 6b)²",
                              "options": [
                                        "(a+3b)",
                                        "(2a+3b)",
                                        "(a-3b)",
                                        "(2a-3b)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A cone is formed by bending a sector of a circle having an angle of 210°. Find the radius of the base of the cone if the diameter of the circle is 12cm",
                              "options": [
                                        "7.00cm",
                                        "1.75cm",
                                        "√21cm",
                                        "3.50cm"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The sides of a triangle are (x + 4)cm, x cm and (x- 4)cm respectively. If the cosine of the largest angle is 1/5, find the value of x",
                              "options": [
                                        "24cm",
                                        "20cm",
                                        "28cm",
                                        "88/7cm"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the figure, QRS is a line, PSQ = 35° SPR = 30° and O is the centre of the circle. Find OQP",
                              "options": [
                                        "35°",
                                        "30°",
                                        "130°",
                                        "65°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the integral values of x which satisfy the inequalities -3 < 2 -5x < 12",
                              "options": [
                                        "-2, -1",
                                        "-2, 2",
                                        "-1, 0",
                                        "0, 1"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1985": [
                    {
                              "question": "Arrange the following numbers in ascending order of magnitude: 6/7, 13/15, 0.865",
                              "options": [
                                        "6/7 < 0.865 < 13/15",
                                        "6/7 < 13/15 < 0.865",
                                        "13/15 < 6/7 < 0.865",
                                        "0.865 < 6/7 < 13/15"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A sum of money was invested at 8% per annum simple interest. If after 4 years the money amounts to #330.00, find the amount originally invested.",
                              "options": [
                                        "#250",
                                        "#275",
                                        "#300",
                                        "#280"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "List all integers satisfying the inequality -2 < 2x - 6 < 4",
                              "options": [
                                        "2, 3, 4, 5",
                                        "2, 3, 4",
                                        "2, 5",
                                        "3, 4, 5"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Find correct to two decimal places: 100 + 1/100 + 3/1000 + 27/10000",
                              "options": [
                                        "100.02",
                                        "1000.02",
                                        "100.22",
                                        "100.01"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If three numbers p, q, r are in the ratio 6:4:5 find the value of (3p - q)/(4q + r)",
                              "options": [
                                        "1/2",
                                        "2/3",
                                        "3/4",
                                        "1"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Without using tables, evaluate Log₂4 + Log₄2 - Log₂55",
                              "options": [
                                        "1/2",
                                        "1/5",
                                        "0",
                                        "5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In a restaurant, the cost of providing a particular type of food is partly constant and partly inversely proportional to the number of people. If the cost per head for 100 people is 30k and the cost for 40 people is 60k, find the cost for 50 people.",
                              "options": [
                                        "15k",
                                        "45k",
                                        "20k",
                                        "50k"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If 3^(2y) - 6(3^y) = 27 find y",
                              "options": [
                                        "3",
                                        "-1",
                                        "2",
                                        "1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "At what real value of x do the curves whose equations are y = x³ + x and y = x² + 1 intersect?",
                              "options": [
                                        "-2",
                                        "2",
                                        "-1",
                                        "0"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If the quadratic function 3x² - 7x + R is a perfect square, find R.",
                              "options": [
                                        "49/24",
                                        "49/3",
                                        "49/6",
                                        "49/12"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the following equation 2/(2r - 1) - 5/3 = 1/(r + 2)",
                              "options": [
                                        "(-1, 5/2)",
                                        "(-1, -5/2)",
                                        "(5/2, 1)",
                                        "(1, 2)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve for (x,y) in the equations 2x + y = 4: x² + xy = -12",
                              "options": [
                                        "(6, -8); (-2,8)",
                                        "(3, -4); (-1, 4)",
                                        "(8, -4); (-1, 4)",
                                        "(-4, 3);(4,-1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the simultaneous equations 2x - 3y + 10 = 10x - 6y = 5",
                              "options": [
                                        "x = 21/2, y = 31/2",
                                        "x = 31/2, y = 21/2",
                                        "x = 21/4, y = 21/5",
                                        "x = 21/2, y = 33/4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If f(x - 2) = 4x² + x + 7 find f(1)",
                              "options": [
                                        "12",
                                        "27",
                                        "7",
                                        "46"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In ΔXYZ, XY = 13cm, YZ = 9cm, XZ= 11cm and XYZ= θ°. Find cos θ",
                              "options": [
                                        "4/39",
                                        "43/39",
                                        "209/286",
                                        "43/78"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the number of goals scored by a football team in 20 matches. What are the values of the mean and the mode respectively?",
                              "options": [
                                        "(1.75, 5)",
                                        "(1.75, 2)",
                                        "(1.75, 1)",
                                        "(2,2)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the hypotenuse of a right angle isosceles triangle is 2, what is the length of each of the other sides?",
                              "options": [
                                        "√2",
                                        "1/√2",
                                        "2√2",
                                        "1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If two fair coins are tossed, what is the probability of getting at least one head?",
                              "options": [
                                        "1/4",
                                        "1/2",
                                        "1",
                                        "3/4"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "The ratio of the length of two similar rectangular blocks is 2:3, if the volume of the larger block is 351cm³, then the volume of the other block is",
                              "options": [
                                        "234.00cm³",
                                        "526.50cm³",
                                        "166.00cm³",
                                        "104.00cm³"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The bearing of a bird on a tree from a hunter on the ground is N72°E. What is the bearing of the hunter from the bird?",
                              "options": [
                                        "S18°W",
                                        "S72°W",
                                        "S72°E",
                                        "S27°W"
                              ],
                              "correctAnswer": 1
                    }
          ],
          "1986": [
                    {
                              "question": "Evaluate (212)₃ - (121)₃ + (222)₃",
                              "options": [
                                        "(313)₃",
                                        "(1000)₃",
                                        "(1020)₃",
                                        "(1222)₃"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If Musa scored 75 in Biology instead of 57, his average mark in four subjects would have been 60. What was his total mark?",
                              "options": [
                                        "282",
                                        "240",
                                        "222",
                                        "210"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Divide the L.C.M. of 48, 64 and 80 by their H.C.F.",
                              "options": [
                                        "20",
                                        "30",
                                        "48",
                                        "60"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the smallest number by which 252 can be multiplied to obtain a perfect square.",
                              "options": [
                                        "2",
                                        "3",
                                        "5",
                                        "7"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Find the reciprocal of 2/3 ÷ (1/2 + 1/3)",
                              "options": [
                                        "4/5",
                                        "5/4",
                                        "2/5",
                                        "6/7"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Three boys shared some oranges. The first received 1/3 of the oranges, the second received 2/3 of the remainder, if the third boy received the remaining 12 oranges. How many oranges did they share?",
                              "options": [
                                        "60",
                                        "54",
                                        "48",
                                        "42"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If P = 18, Q = 21, R = -6 and S = -4, calculate (P - Q)/(R + S²)",
                              "options": [
                                        "-11/216",
                                        "11/216",
                                        "-43/115",
                                        "41/116"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 0.03 × 4 × 0.00064 ÷ (0.48 × 0.012)",
                              "options": [
                                        "3.6 × 10²",
                                        "36 × 10²",
                                        "3.6 × 10³",
                                        "3.6 × 10⁴"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Udoh deposited #150.00 in the bank. At the end of 5 years the simple interest on the principal was #55.00. At what rate per annum was the interest paid?",
                              "options": [
                                        "5%",
                                        "7%",
                                        "7.33%",
                                        "8%"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A number of pencils were shared out among Bisi, Sola and Tunde in the ratio 2:3:5 respectively. If Bisi got 5, how many were shared out?",
                              "options": [
                                        "15",
                                        "25",
                                        "50",
                                        "75"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The ages of Tosan and Isa differ by 6 and the product of their ages is 187. Write their ages in the form (x, y), where x > y",
                              "options": [
                                        "(17, 11)",
                                        "(11, 17)",
                                        "(22, 16)",
                                        "(18, 12)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In 1984, Ike was 24 years old and his father was 45 years old. In what year was Ike exactly half his father's age?",
                              "options": [
                                        "1978",
                                        "1975",
                                        "1982",
                                        "1980"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (1/√3 - 1/√2)(-1/√6)",
                              "options": [
                                        "√3/√5",
                                        "-2/√3",
                                        "-2",
                                        "-1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find n if Log 4 + Log 7 - Log n = -1",
                              "options": [
                                        "10/2",
                                        "20",
                                        "14",
                                        "28"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "(9¹/³ × 27⁻¹/²) / (3⁻¹/⁶ × 3⁻²/³)",
                              "options": [
                                        "1/3",
                                        "1",
                                        "3",
                                        "9"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If x varies directly as y³ and x = 2 when y = 1, find x when y = 5",
                              "options": [
                                        "2",
                                        "10",
                                        "125",
                                        "250"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Factorize completely 3a + 125ax³",
                              "options": [
                                        "(2a+ 5x²)(4 + 25ax)",
                                        "a(2 + 5x)(4 - 10x + 25ax²)",
                                        "(2a + 5x)(4 - 10ax + 25ax²)",
                                        "a(2 + 5x)(4 + 10ax + 25ax²)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If y = x/(x - 3) + x/(x + 4) find y when x = -2",
                              "options": [
                                        "-3/5",
                                        "3/5",
                                        "-7/5",
                                        "7/5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find all the numbers x which satisfy the inequality 1/3(x + 1) - 1 > 1/5 (x + 4)",
                              "options": [
                                        "x < 11",
                                        "x < -1",
                                        "x > 6",
                                        "x > 11"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Factorize x² + 2a + ax + 2x",
                              "options": [
                                        "(x + 2a)(x + 1)",
                                        "(x + 2a)(x - 1)",
                                        "(x² - 1)(x + a)",
                                        "(x + 2)(x + a)"
                              ],
                              "correctAnswer": 3
                    }
          ],
          "1987": [
                    {
                              "question": "Convert 241 in base 5 to base 8",
                              "options": [
                                        "71₈",
                                        "107₈",
                                        "176₈",
                                        "241₈"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the least length of a rod which can be cut into exactly equal strips, each of either 40cm or 48cm in length.",
                              "options": [
                                        "120cm",
                                        "240cm",
                                        "360cm",
                                        "480cm"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A rectangular lawn has an area of 1815 square yards. If its length is 50 meters, find its width in metres. Given that 1 meter equals 1.1 yards",
                              "options": [
                                        "39.93",
                                        "35.00",
                                        "33.00",
                                        "30.00"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Reduce each number to two significant figures and then evaluate (0.02174 × 1.2047) ÷ 0.023789",
                              "options": [
                                        "0.8",
                                        "0.9",
                                        "1.1",
                                        "1.2"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A train moves from P to Q at an average speed of 90km/hr and immediately returns from Q to P through the same route at an average speed of 45km/h. Find the average speed for the return journey.",
                              "options": [
                                        "55.00km/hr",
                                        "60.00km/hr",
                                        "67.50km/hr",
                                        "75.00km/hr"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the length of a square is increased by 20% while its width is decreased by 20% to form a rectangle, what is the ratio of the area of the rectangle to the area of the square?",
                              "options": [
                                        "24:25",
                                        "25:24",
                                        "5:6",
                                        "6:5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Two brothers invested a total of #5,000.00 on a farm project. The farm yield was sold for #15,000.00 at the end of the season. If the profit was shared in the ratio 2:3, what is the difference in the amount of profit received by the brothers?",
                              "options": [
                                        "#2,000.00",
                                        "#4,000.00",
                                        "#6,000.00",
                                        "#10,000.00"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Peter's weekly wages are #20.00 for the first 20 weeks and #36.00 for the next 24 weeks. Find his average weekly wage for the remaining 8 weeks of the year if his average weekly wage for the whole year is #30.00",
                              "options": [
                                        "#37.00",
                                        "#35.00",
                                        "#30.00",
                                        "#5.00"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A man invests a sum of money at 4% per annum simple interest. After 3 years, the principal amounts to #7,000.00. Find the sum invested.",
                              "options": [
                                        "#7,840.00",
                                        "#6,250.00",
                                        "#6,160.00",
                                        "#5,833.33"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "By selling 20 oranges for #1.35 a trader makes a profit 8%. What is his percentage gain or loss if he sells the same 20 oranges for #1.10?",
                              "options": [
                                        "8%",
                                        "10%",
                                        "12%",
                                        "15%"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Four boys and ten girls can cut a field in 5 hours. If the boys work at ¼ the rate of which the girls work, how many boys will be needed to cut the field in 3 hours?",
                              "options": [
                                        "180",
                                        "60",
                                        "25",
                                        "20"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate without using tables (625/8)^(1/3)",
                              "options": [
                                        "625/8",
                                        "8/625",
                                        "1/8",
                                        "8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Instead of writing 35/6 as a decimal correct to 3 significant figures, a student wrote it correct to 3 places of decimals. Find his error in standard form.",
                              "options": [
                                        "0.003",
                                        "3.0 × 10⁻³",
                                        "0.3 × 10²",
                                        "0.3 × 10⁻³"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify without using tables (Log₂6 - Log₂3)/(Log₂8 - 2Log₂1/2)",
                              "options": [
                                        "1/5",
                                        "1/2",
                                        "-1/2",
                                        "Log₂3/Log₂7"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify without using tables (2√14 × 3√21) / (7√24 × 2√98)",
                              "options": [
                                        "3√3/4",
                                        "3√3/28",
                                        "3√14/28",
                                        "3√2/28"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If p = 2/3(1 - r²)/n², find n when r = √1/3 and p = 1",
                              "options": [
                                        "3/2",
                                        "3",
                                        "1/3",
                                        "2/3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If a = u² - 3v² and b = 2uv + v² evaluate (2a - b)(a - b³), when u = 1 and v = -1",
                              "options": [
                                        "9",
                                        "15",
                                        "27",
                                        "33"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The formula Q = 15 + 0.5n gives the cost Q (in Naira) of feeding n people for a week. Find in kobo the extra cost of feeding one additional person.",
                              "options": [
                                        "350k",
                                        "200k",
                                        "150k",
                                        "50k"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If P varies inversely as V and V varies directly as R², find the relationship between P and R given that R = 7 when P = 2",
                              "options": [
                                        "P = 98R²",
                                        "PR² = 98",
                                        "P = 1/98R",
                                        "P = R²/98"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Make y the subject of the formula Z = x² + 1/y³",
                              "options": [
                                        "y = 1/(Z - x²)³",
                                        "y = 1/(Z + x³)^(1/3)",
                                        "y = 1/(Z - x²)^(1/3)",
                                        "y = 1/(Z - x³)^(1/3)"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "1988": [
                    {
                              "question": "Simplify (1½ - 1¼)/(2½ × 1¾)",
                              "options": [
                                        "3/256",
                                        "3/32",
                                        "6",
                                        "85"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If x is the addition of the prime numbers between 1 and 6, and y the H.C.F of 6, 9, 15, find the product of x and y",
                              "options": [
                                        "27",
                                        "30",
                                        "33",
                                        "90"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A 5.0g of salts was weighed by Tunde as 5.1g. What is the percentage error?",
                              "options": [
                                        "20%",
                                        "2%",
                                        "0.2%",
                                        "0.02%"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find correct to one decimal place, 0.24633 ÷ 0.0306",
                              "options": [
                                        "0.8",
                                        "1.8",
                                        "8.0",
                                        "8.1"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Two sisters, Taiwo and Kehinde, own a store. The ratio of Taiwo's share to Kehinde's is 11:9. Later Kehinde sells 2/3 of her share to Taiwo for #720.00. Find the value of the store.",
                              "options": [
                                        "#1,080.00",
                                        "#2,400.00",
                                        "#3,000.00",
                                        "#3,600.00"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A basket contains green, black and blue balls in the ratio 5:2:1. If there are 10 blue balls, find the corresponding new ratio when 10 green and 10 black balls are removed from the basket.",
                              "options": [
                                        "1:1:1",
                                        "4:2:1",
                                        "5:1:1",
                                        "4:1:1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A taxpayer is allowed 1/8th of his income tax free, and pays 20% on the remainder. If he pays #490.00 tax, what is his income?",
                              "options": [
                                        "#560.00",
                                        "#2,450.00",
                                        "#2,800.00",
                                        "#3,920.00"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate (8⅓ × 5⅔) ÷ 10⅔",
                              "options": [
                                        "2/5",
                                        "5/3",
                                        "2√5",
                                        "3√5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If Log₁₀2 = 0.3010 and Log₁₀3 = 0.4771, evaluate, without using logarithm tables Log₁₀4.5",
                              "options": [
                                        "0.3010",
                                        "0.6532",
                                        "0.6352",
                                        "0.7781"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find m such that (m ÷ 3)(1 - √3)² = 6 - 2√3",
                              "options": [
                                        "1",
                                        "2",
                                        "3",
                                        "4"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The thickness of an 800-paged book is 18mm. Calculate the thickness of one leaf of the book giving your answer in metres and in standard form.",
                              "options": [
                                        "2.25 × 10⁻⁴m",
                                        "4.50 × 10⁻⁴m",
                                        "2.25 × 10⁻⁵m",
                                        "4.50 × 10⁻⁵m"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (x + 2)/(x + 1) - (x - 2)/(x + 2)",
                              "options": [
                                        "3/(x + 1)",
                                        "(3x + 2)/((x+1)(x+2))",
                                        "(5x + 6)/((x+1)(x+2))",
                                        "(2x² + 5x + 2)/((x+1)(x+2))"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If 1/p = (a² + 2ab + b²)/(a - b) and 1/q = (a + b)/(a² - 2ab + b²) find p/q",
                              "options": [
                                        "(a + b)/(a - b)",
                                        "1/(a² - b²)",
                                        "(a - b)/(a + b)",
                                        "(a² - b²)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If x varies inversely as the cube root of y and x = 1 when y = 8 find y when x = 3",
                              "options": [
                                        "1/3",
                                        "2/3",
                                        "8/27",
                                        "4/9"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If a = -3, b = 2, c = 4, calculate (a³ - b³ - c^(1/2))/(b^(-1) - c)",
                              "options": [
                                        "-37/5",
                                        "-37",
                                        "37/5",
                                        "37"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If g(y) = y - 3/11 + 11/(y² - 9) what is g(y + 3)?",
                              "options": [
                                        "y/11 + 11/y(y+6)",
                                        "(y + 11)/11y(y+3)",
                                        "(y + 30)/11 + 11/y(y+3)",
                                        "y/11 + 11/y(y-6)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Factorize completely (x² + x)² - (2x + 2)²",
                              "options": [
                                        "(x+1)(x+2)(x-2)",
                                        "(x+1)²(x+2)²",
                                        "(x+1)²(x+2)²(x-2)",
                                        "(x+1)²(x-2)²"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (x - y)(x^(1/3) - y^(1/2))",
                              "options": [
                                        "x² - xy + y²",
                                        "x^(2/3) + x^(1/3)y^(1/3) + y^(2/3)",
                                        "x^(2/3) - x^(1/3)y^(1/3) - y^(2/3)",
                                        "x² - xy + y²"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Solve the following equation for x: x² + 2x + 1 = r²/r¹",
                              "options": [
                                        "r²",
                                        "1/r²",
                                        "-1/r²",
                                        "1/r"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "List the integral values of x which satisfy the inequality 1 < 5 < -2x < 7",
                              "options": [
                                        "-3, -2",
                                        "-2, -1",
                                        "-1, 0",
                                        "0, 1"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1989": [
                    {
                              "question": "Which of the following is in descending order?",
                              "options": [
                                        "9/10, 4/5, 3/4, 17/10",
                                        "4/5, 9/10, 3/4, 17/20",
                                        "6/10, 17/20, 4/5, 3/4",
                                        "4/5, 9/10, 17/10, 3/4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate 2,700,000 × 0.03 ÷ 18,000",
                              "options": [
                                        "4.5 × 10⁰",
                                        "4.5 × 10¹",
                                        "4.5 × 10²",
                                        "4.5 × 10³"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The prime factors of 2,520 are",
                              "options": [
                                        "2, 9, 5,",
                                        "2, 9, 7,",
                                        "2, 3, 5, 7,",
                                        "2, 3, 7, 9,"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If 1/2 = 12/x, find x where e = 12",
                              "options": [
                                        "6",
                                        "12",
                                        "24",
                                        "36"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify (∛64r⁻⁶)^(1/2)",
                              "options": [
                                        "r",
                                        "2r",
                                        "1/2r",
                                        "2/r"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "What is the difference between 0.007685 correct to three significant figures and 0.007685 correct to four places of decimal?",
                              "options": [
                                        "10⁻⁵",
                                        "7 × 10⁻⁴",
                                        "8 × 10⁻⁵",
                                        "10⁻⁶"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If a : b = 5: 8, x : y = 25 : 16, evaluate a/x : b/y",
                              "options": [
                                        "125:128",
                                        "3:5",
                                        "3:4",
                                        "2:5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Oke deposited #800.00 in the bank at the rate of 12½% simple interest. After some time the total amount was one and half times the principal. For how many years was the money left in the bank?",
                              "options": [
                                        "2",
                                        "4",
                                        "5½",
                                        "8"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the surface area of a sphere is increased by 44%. Find the percentage increase in its diameter.",
                              "options": [
                                        "44%",
                                        "30%",
                                        "22%",
                                        "20%"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Simplify 4 - 1/(2-√3)",
                              "options": [
                                        "2√3",
                                        "2, √3",
                                        "-2 + √3",
                                        "2, -√3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find p in terms of q if Log₃p + 3Log₃q = 3",
                              "options": [
                                        "(3)³/(q)",
                                        "(q)^(1/3)/(3)",
                                        "(q)³/(3)",
                                        "(3)^(1/3)/(q)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "What are the values of y which satisfy the equation 9y - 4(3y) + 3 = 0",
                              "options": [
                                        "-1 and 0",
                                        "-1 and 1",
                                        "1 and 3",
                                        "0 and 1"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Make R the subject of the formula S = √(R/(3RT))",
                              "options": [
                                        "R = T/(TS² - 1)",
                                        "R = T/2(TS² - 1)",
                                        "R = T/(TS² + 1)",
                                        "R = T/2(TS² + 1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the value of the expression 3² - 64/81x³ when x = -3/4",
                              "options": [
                                        "10⅓",
                                        "10⅔",
                                        "6",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The cost of dinner for a group of students is partly constant and partly varies directly as the number of students. If the cost is #74.00 when the number of students is 20, and #96.00 when the number is 30, find the cost when there are 15 students.",
                              "options": [
                                        "#68.50",
                                        "#63.00",
                                        "#60.00",
                                        "#52.00"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If f(x) = 2x² + 5x + 3, find f(x + 1)",
                              "options": [
                                        "2x² - x",
                                        "2x² - x + 10",
                                        "4x² + 3x + 2",
                                        "4x² + 3x + 12"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the positive number x such that 2(x³ - x² - 2x) = 1",
                              "options": [
                                        "4",
                                        "3",
                                        "2",
                                        "1"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Simplify (32x - 4x²)/(2x + 18)",
                              "options": [
                                        "2(x-9)",
                                        "2(9 + x)",
                                        "81 - x²",
                                        "-2(x - 9)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Factorize completely y³ - 4xy + xy³ - 4y",
                              "options": [
                                        "(x + xy)(y+ 2)(y - 2)",
                                        "(y + xy)(y + 2)(y - 2)",
                                        "y(1 + x)(y + 2)(y - 2)",
                                        "y(1 - x)(y + 2)(y - 2)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If one of x³ - 8⁻¹ is x - 2⁻¹, the other factor is",
                              "options": [
                                        "x² + 2⁻¹x - 4⁻¹",
                                        "x² - 2⁻¹x - 4⁻¹",
                                        "x² + 2⁻¹x + 4⁻¹",
                                        "x² + 2⁻¹x - 4⁻¹"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "1990": [
                    {
                              "question": "Simplify (4¾ - 6¼) ÷ (4⅕ of 1¼)",
                              "options": [
                                        "-7⅚",
                                        "-2/7",
                                        "-10/21",
                                        "10/21"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The H.C.F. of a²bx + abx² and a²b - b³ is",
                              "options": [
                                        "ab(x + b)",
                                        "ab(a - b)",
                                        "b(a + x)",
                                        "b(a - x)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Correct 241.34 (3 × 10⁻³)² to 4 significant figures",
                              "options": [
                                        "0.0014",
                                        "0.001448",
                                        "0.0022",
                                        "0.002172"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "At what rate would a sum of #100.00 deposited for 5 years raise an interest of #7.50?",
                              "options": [
                                        "1½%",
                                        "2½%",
                                        "15%",
                                        "25%"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Three children shared a basket of mangoes in such a way that the first child took ¼ of the mangoes and the second ¾ of the remainder. What fraction of the mangoes did the third child take?",
                              "options": [
                                        "3/16",
                                        "5/16",
                                        "7/16",
                                        "9/16"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify and express in standard form (0.00275 × 0.0064)/(0.025 × 0.08)",
                              "options": [
                                        "8.8 × 10⁻³",
                                        "8.8 × 10⁻²",
                                        "8.8 × 10⁻¹",
                                        "8.8 × 10⁰"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Three brothers in a business deal share the profit at the end of contract. The first received ⅓ of the profit and the second ⅔ of the remainder. If the third received the remaining #12,000.00, how much profit did they share?",
                              "options": [
                                        "#60,000.00",
                                        "#54,000.00",
                                        "#48,000.00",
                                        "#42,000.00"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify √160r² + √(71r⁴ + √100r³)",
                              "options": [
                                        "9r²",
                                        "13r²",
                                        "13r",
                                        "r√160"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify √27 + 3/√3",
                              "options": [
                                        "4√3",
                                        "4/√3",
                                        "3√3",
                                        "3/√4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 3Log₆9 + Log₆12 + Log₆64 - Log₆72",
                              "options": [
                                        "5",
                                        "7776",
                                        "Log 31",
                                        "(7776)⁶"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (1/(x⁻¹) + 1/(y⁻¹))⁻¹",
                              "options": [
                                        "x/y",
                                        "xy",
                                        "y/x",
                                        "(xy)⁻¹"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If a = 2, b = -2 and c = -½, evaluate (ab² - bc²)/(a²c - abc)",
                              "options": [
                                        "0",
                                        "28",
                                        "-30",
                                        "34"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Y varies inversely as x² and X varies directly as Z². Find the relationship between Y and Z, if C is a constant.",
                              "options": [
                                        "Y = CZ²",
                                        "Y = C/Z²",
                                        "YZ² = C",
                                        "Y/Z² = C"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the value of r in terms of p and q in the following equation P/2 = r/(r+q)",
                              "options": [
                                        "r = q",
                                        "r = pq²/(2-p²)",
                                        "r = p²q²/(2-pq)",
                                        "r = p/(2-p)q"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If f(x - 4) = x² + 2x + 3, find f(2)",
                              "options": [
                                        "6",
                                        "11",
                                        "27",
                                        "51"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Factorize 9(x + y)² - 4(x - y)²",
                              "options": [
                                        "(x + 5y)(5x + y)",
                                        "(5x + y)(x + 5y)",
                                        "(x - 5y)(5x - y)",
                                        "(5x - y)(x - 5y)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If a² + b² = 16 and 2ab = 7 find all the possible values of (a - b)",
                              "options": [
                                        "±3",
                                        "±2",
                                        "±4",
                                        "±1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Divide x³ - 2x² - 5x + 6 by (x - 1)",
                              "options": [
                                        "x² - x -6",
                                        "x² - 5x + 6",
                                        "x² - 7x + 6",
                                        "x² - 5x - 6"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If x + 1/x = 4, find x² + 1/x²",
                              "options": [
                                        "16",
                                        "14",
                                        "12",
                                        "9"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "What must be added to 4x² - 4 to make it a perfect square?",
                              "options": [
                                        "-1/x²",
                                        "1/x²",
                                        "1",
                                        "-1"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "1991": [
                    {
                              "question": "Simplify 3⅙ - 1⅚ × 2/5 + 1¾",
                              "options": [
                                        "2 17/30",
                                        "39/10",
                                        "4⅙",
                                        "4 11/36"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 2257 is the result of subtracting 4577 from 7056 in base n, find n.",
                              "options": [
                                        "8",
                                        "9",
                                        "10",
                                        "11"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find correct to 3 decimal places (1/0.05 - 1/5.005) - (0.05 × 2.05)",
                              "options": [
                                        "99.998",
                                        "98.999",
                                        "89.899",
                                        "9.998"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Express 6⅔ as a decimal correct to 3 significant figures.",
                              "options": [
                                        "20.6",
                                        "20.667",
                                        "20.67",
                                        "20.7"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Factory P produces 20,000 bags of cement per day while factory Q produces 15,000 bags per day. If P reduces production by 5% and Q increases production by 5% determine the effective loss in the number of bags produced per day by the two factories.",
                              "options": [
                                        "250",
                                        "750",
                                        "1000",
                                        "1250"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Musa borrows #10.00 at 2% per month interest and repays #8.00 after 4 months. However much does he still owe?",
                              "options": [
                                        "#10.80",
                                        "#10.67",
                                        "#2.80",
                                        "#2.67"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If 3 gallons of spirit containing 20% water are added to 5 gallons of another spirit containing 15% water, what percentage of the mixture is water?",
                              "options": [
                                        "24⅜%",
                                        "16⅞%",
                                        "18 5/8%",
                                        "18⅞%"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "What is the product of 27/5 - (3)³ and (1/5)?",
                              "options": [
                                        "5",
                                        "3",
                                        "1",
                                        "1/25"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify 2log 2/5 - log 72/125 + log 9",
                              "options": [
                                        "1 - 4log 3",
                                        "-1 + 2log3",
                                        "-1 + 5log2",
                                        "1 - 2log2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the range of values of x which satisfy the inequality (x/2 + x/3 + x/4) < 1",
                              "options": [
                                        "3 < x < 4",
                                        "-4 < x < -3",
                                        "-2 < x < -1",
                                        "-3 < x < 0"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Write h in terms of a = b(1 - ch)/(1-dh)",
                              "options": [
                                        "h = (a - b)/(ad - bc)",
                                        "h = (a + b)/(ad - bc)",
                                        "h = (ad - bc)/(a - b)",
                                        "h = (1 - b)/(d - bc)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "22⅛% of the Nigerian Naira is equal to 17⅛% of a foreign currency M. What is the conversion rate of the M to the Naira?",
                              "options": [
                                        "(0, 12)",
                                        "(1, 2)",
                                        "(21, 0)",
                                        "(3, 4)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If eˣ = 1 + x + x²/1.2 + x³/1.2.3 + ... find 1/e^(1/2)",
                              "options": [
                                        "1 - x + x² - x³ + ...",
                                        "1 + x + x² + x³ + ...",
                                        "1 + x - x² + x³ + ...",
                                        "1 - x - x² - x³ + ..."
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "(4√3 + 4√2)(4√3 - 4√2)(3√3 + √2) is equal to",
                              "options": [
                                        "0",
                                        "4√3 + 4√2",
                                        "(4√2 - 4√3)(√3 + √2)",
                                        "1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In a restaurant, the cost of providing a particular type of food is partly constant and partly inversely proportional to the number of people. If the cost per head for 100 people is 30k and the cost for 40 people is 60k, find the cost for 50 people.",
                              "options": [
                                        "15k",
                                        "45k",
                                        "20k",
                                        "50k"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The factors of 9 - (x² - 3x - 1)² are",
                              "options": [
                                        "-(x - 4)(x + 1)(x - 1)(x - 2)",
                                        "(x - 4)(x - 1)(x - 1)(x + 2)",
                                        "-(x - 2)(x + 1)(x + 2)(x + 4)",
                                        "(x - 4)(x - 3)(x - 2)(x + 1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 3^(2y) - 6(3^y) = 27 find y",
                              "options": [
                                        "3",
                                        "-1",
                                        "2",
                                        "1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Factorize abx² + 8y - 4bx - 2axy",
                              "options": [
                                        "(ax - 4)(bx - 2y)",
                                        "(ax + b)(x - 8y)",
                                        "(ax - 2y)(by - 4)",
                                        "(bx - 4)(ax - 2y)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "At what real value of x do the curves whose equations are y = x³ + x and y = x² + 1 intersect?",
                              "options": [
                                        "-2",
                                        "2",
                                        "-1",
                                        "0"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If the quadratic function 3x² - 7x + R is a perfect square, find R.",
                              "options": [
                                        "49/24",
                                        "49/3",
                                        "49/6",
                                        "49/12"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1992": [
                    {
                              "question": "Find n if 34n = 10011₂",
                              "options": [
                                        "5",
                                        "6",
                                        "7",
                                        "8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The radius of a circle is given as 5cm subject to an error of 0.1cm. What is the percentage error in the area of the circle?",
                              "options": [
                                        "1/25",
                                        "1/4",
                                        "4",
                                        "25"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate Log aⁿ if b = 1/aⁿ",
                              "options": [
                                        "n²",
                                        "n",
                                        "1/n",
                                        "1/n³"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "What is the value of x satisfying the equation 4^(2y) / 4^(3x) = 2?",
                              "options": [
                                        "-2",
                                        "-1/2",
                                        "1/2",
                                        "2"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify {(1.25 × 10⁴) × (2.0 × 10⁻¹)}/(6.25 × 10⁵)",
                              "options": [
                                        "4.0 × 10⁻³",
                                        "5.0 × 10⁻²",
                                        "2.0 × 10⁻¹",
                                        "5.0 × 10³"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 5√18 - 3√72 + 4√50",
                              "options": [
                                        "17√4",
                                        "4√17",
                                        "17√2",
                                        "12√4"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If x = 3 - √3, find x² + 36/x²",
                              "options": [
                                        "9",
                                        "18",
                                        "24",
                                        "27"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If x = {all prime factors of 44} and y = {all prime factors of 60}, the elements of x ∪ y and x ∩ y respectively are",
                              "options": [
                                        "{2, 4, 3, 5, 11} and {4}",
                                        "{4, 3, 5, 11} and {3, 4}",
                                        "{2, 5, 11} and {2}",
                                        "{2, 3, 5, 11} and {2}"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If U = {0, 2, 3, 6, 7, 8, 9, 10} is the universal set, E = {0, 4, 6, 8} and F = {x: x² = 26, x is odd}. Find (E ∪ F)' where ' means the complement of a set",
                              "options": [
                                        "{0}",
                                        "U",
                                        "{ }",
                                        "{2}"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Make l the subject of the formula s = ut + ½at²",
                              "options": [
                                        "1/a[u ± √(u² + 2as)]",
                                        "1/a[-u ± √(u² - 2as)]",
                                        "1/a[u ± √(u² + 2as)]",
                                        "1/a[-u ± √(u² + 2as)]"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Factorize 9p² - q² + 6pr - 9r²",
                              "options": [
                                        "(3p - 3q + r)(3p - q - 9r)",
                                        "(6p - 3q + 3r)(3p - q - 4r)",
                                        "(3p - q + 3r)(3p + q - 3r)",
                                        "(3p - q + 3r)(3p - q - 3r)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Solve the equation y² - 11y + 24 = 0",
                              "options": [
                                        "8, 3",
                                        "64, 9",
                                        "6, 4",
                                        "9, -8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A man invested a sum of #280.00 partly at 5% and partly at 4%. If the total interest is #12.80 per annum, find the amount invested at 5%.",
                              "options": [
                                        "#14.00",
                                        "#120.00",
                                        "#140.00",
                                        "#160.00"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If x + 1 is a factor of x³ + 3x² + kx + 4, find the value of k",
                              "options": [
                                        "6",
                                        "-6",
                                        "8",
                                        "-8"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Resolve 3/(x² + x - 2) into partial fractions",
                              "options": [
                                        "1/(x-1) - 1/(x+2)",
                                        "1/(x+2) + 1/(x-1)",
                                        "1/(x+1) - 1/(x-2)",
                                        "1/(x-2) + 1/(x+1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find all values of x satisfying the inequality -11 ≤ 4 - 3x ≤ 28",
                              "options": [
                                        "-5 ≤ x ≤ 18",
                                        "5 ≤ x ≤ 8",
                                        "-8 ≤ x ≤ 5",
                                        "-5 < x ≤ 8"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the sum of the infinity of the following series: 3 + 2 + 4/3 + 8/9 + 16/27 + ...",
                              "options": [
                                        "127",
                                        "19",
                                        "18",
                                        "9"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "What is the nth term of the sequence 2, 6, 12, 20, ...?",
                              "options": [
                                        "4n - 2",
                                        "2(3n - 1)",
                                        "n² + n",
                                        "n² + 3n + 2"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "For an arithmetic sequence, the first term is 2 and the common difference is 3. Find the sum of the first 11 terms.",
                              "options": [
                                        "157",
                                        "187",
                                        "197",
                                        "200"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If the binary operation * is defined by m*n = mn + m + n for any real number m and n, find the identity element under this operation.",
                              "options": [
                                        "e = 1",
                                        "e = -1",
                                        "e = -2",
                                        "e = 0"
                              ],
                              "correctAnswer": 1
                    }
          ],
          "1993": [
                    {
                              "question": "Change 71₁₀ to base 8",
                              "options": [
                                        "107₈",
                                        "106₈",
                                        "71₈",
                                        "17₈"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate 3524/0.05 correct to 3 significant figures.",
                              "options": [
                                        "70480",
                                        "70400",
                                        "70500",
                                        "70400"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 9^(x-1/2) = 3^(x²), find the value of x.",
                              "options": [
                                        "1/2",
                                        "1",
                                        "2",
                                        "3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Solve for y in the equation 10^(y) × 5^(2y-2) × 4^(y-1) = 1",
                              "options": [
                                        "3/4",
                                        "2/3",
                                        "1",
                                        "5/3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify 1/(3-√2) - 1/(3+√2)",
                              "options": [
                                        "4/7",
                                        "4/5",
                                        "2/7",
                                        "1/5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 2 log₃x - 4 logₓ3² = 4, then y is",
                              "options": [
                                        "(4 - log₃x²)/2",
                                        "4/log₃x²",
                                        "2/3",
                                        "± 9"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve without using tables log₅(62.5) - log₅(1/2)",
                              "options": [
                                        "3",
                                        "4",
                                        "12",
                                        "27"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If #225.00 yields #27.00 in x years simple interest at the rate of 4% per annum, find x",
                              "options": [
                                        "3",
                                        "4",
                                        "12",
                                        "27"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If f(x+2) = 2x² + 7x - 5, find f(-1)",
                              "options": [
                                        "-10",
                                        "-8",
                                        "4",
                                        "10"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If A. x² + 9 = x + 1, solve for x",
                              "options": [
                                        "5",
                                        "4",
                                        "3",
                                        "1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Make x the subject of the relation (1+ax)/(1-ax) = p/q",
                              "options": [
                                        "(p-q)/(a(p+q))",
                                        "(p+q)/(a(p-q))",
                                        "(q-p)/(a(p+q))",
                                        "(p-q)/(a(q-p))"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Which of the following is a factor of 15 + 7x - 2x²?",
                              "options": [
                                        "(x-5)",
                                        "(x+5)",
                                        "(2x-3)",
                                        "(2x+3)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate ((x+1)/(x+1))² - ((x-1)/(x-1))²",
                              "options": [
                                        "4x²",
                                        "(2/x+2)²",
                                        "4",
                                        "4(1+x)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the following simultaneous equations for x: x² + y - 5 = 0, y + 5x - 2 = 0",
                              "options": [
                                        "-3, -21",
                                        "2/3, 21",
                                        "2/3, 4/5",
                                        "2, 10"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Solve the following equation CA. 40(5x-4) = (3x-2)1",
                              "options": [
                                        "-3, -21",
                                        "2/3, 21",
                                        "2/3, 4/5",
                                        "2, 10"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Q and P are two points such that angle PQR = 30°. Find the angle of the sectors representing each item in a pie chart of the following data: 6, 10, 14, 16, 26",
                              "options": [
                                        "(6,5)",
                                        "(5,8)",
                                        "(5,7)",
                                        "(5,5)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "In the figure above, PT is a tangent to the circle at U and QU//RS. If TUR = 35° and SRU = 50°. Find x.",
                              "options": [
                                        "95°",
                                        "85°",
                                        "50°",
                                        "35°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A regular polygon has 150° as the size of each interior angle. How many sides has the polygon?",
                              "options": [
                                        "12",
                                        "10",
                                        "9",
                                        "8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Calculate the length, in cm, of the arc of the circle of diameter 8cm which subtends an angle of 22½°",
                              "options": [
                                        "2π",
                                        "π",
                                        "2/3π",
                                        "1/2π"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "In the diagram above, PQRS is a circle with O as centre and PQ//RT. If RTS = 32°, find PSQ",
                              "options": [
                                        "32°",
                                        "45°",
                                        "58°",
                                        "90°"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1994": [
                    {
                              "question": "Evaluate 1/3[5/(9/10 - 1) + 3/4]",
                              "options": [
                                        "28/7",
                                        "13/10",
                                        "39/4",
                                        "84/7"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate (0.36 × 5.4 × 0.63)/(4.2 × 9.0 × 2.4) correct to 2 significant figures",
                              "options": [
                                        "0.013",
                                        "0.014",
                                        "0.13",
                                        "0.14"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate Log₅(0.04)(Log₃18 - Log₃2)",
                              "options": [
                                        "1",
                                        "-1",
                                        "2/3",
                                        "-2/3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Without using tables, solve the equation 8^(x-2) = 2/(x/5)",
                              "options": [
                                        "4/3",
                                        "3/4",
                                        "2/3",
                                        "1/4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given that √2 = 1.414, find without using tables, the value of 1/√2",
                              "options": [
                                        "0.141",
                                        "0.301",
                                        "0.667",
                                        "0.707"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "In a science class of 42 students, each offers at least one of Mathematics and Physics. If 22 students offer Physics and 28 students offer Mathematics, find how many students offer Physics only?",
                              "options": [
                                        "6",
                                        "8",
                                        "12",
                                        "14"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Given that for sets A and B, in a universal set E, A ⊂ B then A ∩ (A ∪ B)' is",
                              "options": [
                                        "A",
                                        "∅",
                                        "B",
                                        "ξ"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Solve for x if 2^(5x) + 3(5^x) = 4",
                              "options": [
                                        "1 or -4",
                                        "0",
                                        "1",
                                        "-4 or 0"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the values of p and q such that (x - 1) and (x - 3) are factors of px³ + qx² + 11x - 6",
                              "options": [
                                        "-1, -6",
                                        "1, -6",
                                        "1, 6",
                                        "6, -1"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If a = 1, b = 3, solve for x in the equation a/(a-x) = b/(x-b)",
                              "options": [
                                        "4/3",
                                        "2/3",
                                        "3/4",
                                        "3/2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve for r in the following equation 1/(r-1) + 2/(r+1) = 3/r",
                              "options": [
                                        "3",
                                        "4",
                                        "5",
                                        "6"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find P if (x-3)/(1-x)(x+2) = P/(1-x) + Q/(x+2)",
                              "options": [
                                        "-2/3",
                                        "-5/3",
                                        "5/3",
                                        "2/3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the range of values of x for which 1/x > 2 is true",
                              "options": [
                                        "x < 1/2",
                                        "x < 0 or x > 1/2",
                                        "0 < x < 1/2",
                                        "1 < x < 2"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the 6th term of an arithmetic progression is 11 and the first term is 1, find the common difference.",
                              "options": [
                                        "12/5",
                                        "5/2",
                                        "-2",
                                        "2"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Find the value of r if log₁₀r + log₁₀r² + log₁₀r⁴ + log₁₀r⁸ = 63",
                              "options": [
                                        "10⁻⁸",
                                        "10⁰",
                                        "10",
                                        "10²"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the nth term of the sequence 3, 6, 10, 15, 21, ...",
                              "options": [
                                        "n(n - 1/2)",
                                        "n(n + 1/2)",
                                        "(n + 1)(n + 2)/2",
                                        "n(2n + 1)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A binary operation * is defined on the set of all positive integers by a*b = ab for all positive integers a, b. Which of the following properties does NOT hold?",
                              "options": [
                                        "Closure",
                                        "Associativity",
                                        "Identity",
                                        "Inverse"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "The determinant of the matrix |1 2 3; 4 5 6; 2 0 -1| is",
                              "options": [
                                        "-67",
                                        "-57",
                                        "-3",
                                        "3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The multiplication table above has modulo 10 on the set S = {2, 4, 6, 8}. Find the inverse of 2",
                              "options": [
                                        "x = -3, y = 3",
                                        "x = 8, y = 3",
                                        "x = 3, y = -8",
                                        "x = 8, y = -3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the diagram above, PTS is a tangent to the circle TQR at T. Calculate RTS",
                              "options": [
                                        "120°",
                                        "70°",
                                        "60°",
                                        "40°"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "1995": [
                    {
                              "question": "Calculate 3310₅ - 1442₅",
                              "options": [
                                        "1313₅",
                                        "2113₅",
                                        "4302₅",
                                        "1103₅"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Convert 3.1415926 to 5 decimal places",
                              "options": [
                                        "3.14160",
                                        "3.14159",
                                        "0.31415",
                                        "3.14200"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The length of a notebook 15cm, was measured as 16.8cm. Calculate the percentage error to 2 significant figures.",
                              "options": [
                                        "12.00%",
                                        "11.00%",
                                        "10.71%",
                                        "0.12%"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A worker's present salary is #24,000 per annum. His annual increment is 10% of his basic salary. What would be his annual salary at the beginning of the third year?",
                              "options": [
                                        "#28,800",
                                        "#29,040",
                                        "#31,200",
                                        "#31,944"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Express the product of 0.0014 and 0.011 in standard form.",
                              "options": [
                                        "1.54 × 10²",
                                        "1.54 × 10⁻³",
                                        "1.54 × 10⁴",
                                        "1.54 × 10⁻⁵"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Evaluate (81^(3/4) - 27^(1/3))/(3 × 2³)",
                              "options": [
                                        "27",
                                        "1",
                                        "1/3",
                                        "1/8"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the value of (16)^(3/2) + log₁₀0.0001 + log₃32",
                              "options": [
                                        "0.065",
                                        "0.650",
                                        "6.500",
                                        "65.00"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Simplify (√12 - √3)/(√12 + √3)",
                              "options": [
                                        "1/3",
                                        "0",
                                        "9/15",
                                        "1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Four members of a school first eleven cricket team are also members of the first fourteen rugby team. How many boys play for at least one of the two teams?",
                              "options": [
                                        "25",
                                        "21",
                                        "16",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If S = {x : x² = 9, x > 4}, then S is equal to",
                              "options": [
                                        "0",
                                        "{0}",
                                        "∅",
                                        "{∅}"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If x - 1 and x + 1 are both factors of the equation x³ + px³ + qx + 6 = 0, evaluate p and q",
                              "options": [
                                        "-6, -1",
                                        "6, 1",
                                        "-1, 1",
                                        "6, -6"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find a positive value of p if the equation 2x² - px + p leaves a remainder 6 when divided by x - 2",
                              "options": [
                                        "1",
                                        "2",
                                        "3",
                                        "4"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find r in terms of K, Q and S if s = 2rπ√Q/(k - r)",
                              "options": [
                                        "(r² - k)/(2π²Q)",
                                        "(r² - k)/Q",
                                        "(r² - k)/(2π²Q)",
                                        "(r² - k)/(4π²Q)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The graph of f(x) = x² - 5x + 6 crosses the x-axis at the points",
                              "options": [
                                        "(-6, 0)(-1, 0)",
                                        "(-3, 0)(-2, 0)",
                                        "(-6, 0)(1, 0)",
                                        "(2, 0)(3, 0)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Factorize completely the expression abx² + 6y - 3ax - 2byx",
                              "options": [
                                        "(ax - 2y)(bx - 3)",
                                        "(bx + 3)(2y - ax)",
                                        "(bx + 3)(ax - 2y)",
                                        "(ax - 2y)(ax - b)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Solve the following inequality (x - 3)(x - 4) ≥ 0",
                              "options": [
                                        "3 ≤ x ≤ 4",
                                        "3 < x < 4",
                                        "3 ≤ x < 4",
                                        "3 < x ≤ 4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The 4th term of an A.P is 13cm while the 10th term is 31. Find the 31st term.",
                              "options": [
                                        "175",
                                        "85",
                                        "64",
                                        "45"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify (x² - 1)/(x³ + 2x² - x - 2)",
                              "options": [
                                        "1/(x + 2)",
                                        "(x - 1)/(x + 1)",
                                        "(x - 1)/(x + 2)",
                                        "1/(x - 2)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Express 5x - 1/2(x - 2)(x - 3) in partial fraction",
                              "options": [
                                        "2/(x-2) - 3/(x-3)",
                                        "2/(x-2) + 3/(x-3)",
                                        "2/(x-3) - 3/(x-2)",
                                        "5/(x-3) + 4/(x-2)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Use the graph of the curve y = f(x) above to solve the inequality f(x) > 0.",
                              "options": [
                                        "-1 ≤ x ≤ 1, x > 2",
                                        "x ≤ -1, 1 ≤ x > 2",
                                        "x ≤ -1, 1 ≤ x ≤ 2",
                                        "x ≤ 2, -1 ≤ x ≤ 1"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1996": [
                    {
                              "question": "Evaluate 2⅔ + 1½ - 1⅓ × 2⅖",
                              "options": [
                                        "3",
                                        "3⅓",
                                        "3⅔",
                                        "4"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The angle of a sector of a circle radius 10.5cm is 48°. Calculate the perimeter of the sector",
                              "options": [
                                        "25.4cm",
                                        "25.6cm",
                                        "26.4cm",
                                        "28.6cm"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the inequality 2 - x > x²",
                              "options": [
                                        "x < -2 or x > 1",
                                        "x > 2 or x < -1",
                                        "-1 < x < 2",
                                        "-2 < x < 1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If a and b are the roots of the equation 3x² + 5x - 2 = 0, find the value of 1/a + 1/b",
                              "options": [
                                        "-5/2",
                                        "-2/3",
                                        "1/2",
                                        "5/2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the minimum value of the function f(θ) = 2/3 - cosθ for 0 ≤ θ ≤ 2π",
                              "options": [
                                        "1/2",
                                        "2/3",
                                        "1",
                                        "2"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A frustum of a pyramid with square base has its upper and lower sections as squares of sizes 2m and 5m respectively and the distance between them 6m. Find the height of the pyramid from which the frustum was obtained.",
                              "options": [
                                        "8.0m",
                                        "8.4m",
                                        "9.0m",
                                        "10.0m"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "P is a point on one side of the straight line UV and P moves in the same direction as UV. If the straight line ST is on the locus of P and VUS = 50°, find UST",
                              "options": [
                                        "310°",
                                        "130°",
                                        "80°",
                                        "50°"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A ship sails a distance of 50km in the direction S50°E and then sails a distance of 50km in the direction N40°E. Find the bearing of the ship from its original position.",
                              "options": [
                                        "S90°E",
                                        "N40°E",
                                        "S95°E",
                                        "N85°E"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "An equilateral triangle of side √3 cm is inscribed in a circle. Find the radius of the circle.",
                              "options": [
                                        "2/3cm",
                                        "2cm",
                                        "1cm",
                                        "3cm"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "3y = 4x - 1 and Ky = x + 3 are equations of two straight lines. If the two lines are perpendicular to each other, find K",
                              "options": [
                                        "-4/3",
                                        "-3/4",
                                        "3/4",
                                        "4/3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the x coordinates of the points of intersection of the two equations in the graph above.",
                              "options": [
                                        "-1 and 2",
                                        "-2 and 1",
                                        "-1 and 3",
                                        "1 and 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the figure above, O is the centre of circle PQRS and PS//RT. If PRT = 135°, then PSQ is",
                              "options": [
                                        "67½°",
                                        "45°",
                                        "90°",
                                        "33⅔°"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the figure above TSP = PRQ, QR = 8cm, PR = 6cm and ST = 12cm. Find the length SP",
                              "options": [
                                        "4cm",
                                        "16cm",
                                        "9cm",
                                        "14cm"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In the figure above, the area of the shaded segment is",
                              "options": [
                                        "3π",
                                        "9¾",
                                        "3(π - 3√3/4)",
                                        "3(√3 - π)/4"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the total area of the surface of a solid cylinder whose base radius is 4cm and height is 5cm.",
                              "options": [
                                        "56πcm²",
                                        "72πcm²",
                                        "96πcm²",
                                        "192πcm²"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The mean and the range of the set of numbers 0.20, 1.00, 0.90, 1.40, 0.80, 0.80, 1.20, and 1.10 are m and r respectively. Find m + r",
                              "options": [
                                        "1.11",
                                        "1.65",
                                        "1.85",
                                        "2.45"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the variance of the scores 1, 2, 3, 4, 5",
                              "options": [
                                        "1.2",
                                        "1.4",
                                        "2.0",
                                        "3.0"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The frequency distribution above shows the ages of students in a secondary school. In a pie chart constructed to represent the data, the angle corresponding to the 15 years-old is",
                              "options": [
                                        "27°",
                                        "30°",
                                        "54°",
                                        "108°"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The pie chart above shows the distribution of students in a secondary school class. If 30 students offered French, how many offered C.R.K?",
                              "options": [
                                        "25",
                                        "15",
                                        "10",
                                        "8"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Let P be a probability function on set S, where S = {a₁, a₂, a₃, a₄} find P(a₁) if P(a₂) = P(a₃) = 1/6 and P(a₄) = 1/5",
                              "options": [
                                        "7/10",
                                        "2/3",
                                        "1/3",
                                        "3/10"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1997": [
                    {
                              "question": "If (1P03)₄ = 115₁₀, find P",
                              "options": [
                                        "0",
                                        "1",
                                        "2",
                                        "3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Evaluate 64.764² - 35.236² correct to 3 significant figures",
                              "options": [
                                        "2960",
                                        "2950",
                                        "2860",
                                        "2850"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the value of (0.006)³ + (0.004)³ in standard form.",
                              "options": [
                                        "2.8 × 10⁻⁹",
                                        "2.8 × 10⁻⁸",
                                        "2.8 × 10⁻⁷",
                                        "2.8 × 10⁻⁶"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Given that logₐ2 = 0.693 and logₐ3 = 1.097, find logₐ13.5",
                              "options": [
                                        "1.404",
                                        "1.790",
                                        "2.598",
                                        "2.790"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Simplify log₂96 - 2log₂6",
                              "options": [
                                        "2 - log 3",
                                        "3 - log 3",
                                        "log₂3 - 3",
                                        "log₂3 - 2"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If 8^(x/2) = [2^(3/8)][4^(3/4)], find x",
                              "options": [
                                        "3/8",
                                        "3/4",
                                        "4/5",
                                        "5/4"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify (2√3 + 3√5)/(3√5 - 2√3)",
                              "options": [
                                        "(6 + √15)/17",
                                        "(6 - √15)/17",
                                        "(6 + √15)/11",
                                        "(6 - √15)/11"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the simple interest rate per cent per annum at which #1000 accumulates to #1240 in 3 years.",
                              "options": [
                                        "6%",
                                        "8%",
                                        "10%",
                                        "12%"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If U = {S,P,L,E,N,D,O,U,R} X = {S,P,E,N,D} Y = {P,N,O,U,R}. Find X ∩ (Y' ∪ Z).",
                              "options": [
                                        "{P,O,U,R}",
                                        "{S,P,D,R}",
                                        "{P,N,D}",
                                        "{N,D,U}"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A survey of 100 students in an institution shows that 80 students speak Hausa and 20 students Igbo, while only 9 students speaks both languages. How many students neither Hausa nor Igbo?",
                              "options": [
                                        "0",
                                        "9",
                                        "11",
                                        "20"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the function f(x) = x³ + 2x² + qx - 6 is divisible by x + 1, find q.",
                              "options": [
                                        "-5",
                                        "-2",
                                        "2",
                                        "5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Solve the simultaneous equations x²/2 - 3y = 2, 4x² + 3y = 10",
                              "options": [
                                        "x = 3/2, y = 1/2",
                                        "x = 1/2, y = 3/2",
                                        "x = -1/2, y = -3/2",
                                        "x = 1/2, y = -3/2"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Find the minimum value of x² - 3x + 2 for all real values of x.",
                              "options": [
                                        "-1/4",
                                        "-1/2",
                                        "1/4",
                                        "1/2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Make f the subject of the formula t = √(v/gf)",
                              "options": [
                                        "gv - t²/gt²",
                                        "gt²/gv - t²",
                                        "v/t^(1/2) - 1/g",
                                        "gv/t² - g"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "What value of g will make the expression 4x² - 18xy - g a perfect square?",
                              "options": [
                                        "9",
                                        "9y²/4",
                                        "81y²",
                                        "81y²/4"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Find the value of K if (5 + 2r)/(r+1)(r-2) expressed in partial fraction is K/(r-2) + L/(r+1), where K and L are constants.",
                              "options": [
                                        "3",
                                        "2",
                                        "1",
                                        "-1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Let f(x) = 2x + 4 and g(x) = 6x + 7 where g(x) > 0. Solve the inequality f(x)/g(x) < 1",
                              "options": [
                                        "x > 3/4",
                                        "x < 3/4",
                                        "x > -3/4",
                                        "x < -3/4"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the range of values of x which satisfies the inequality 12x² < x + 1",
                              "options": [
                                        "-1/4 < x < 1/3",
                                        "1/4 < x < 1/3",
                                        "-1/3 < x < 1/4",
                                        "-1/4 < x < -1/3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Sn is the sum of the first n terms of a series given by S = n² - 1. Find the nth term.",
                              "options": [
                                        "4n + 1",
                                        "4n - 1",
                                        "2n + 1",
                                        "2n - 1"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The nth term of a sequence is given by 3^(1-n). Find the sum of the first three terms of the sequence.",
                              "options": [
                                        "13/9",
                                        "11/9",
                                        "1/9",
                                        "13/3"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "1998": [
                    {
                              "question": "If 1011₂ + X₇ = 25₁₀, solve for X",
                              "options": [
                                        "14",
                                        "20",
                                        "24",
                                        "25"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate [1/0.03 - 1/0.024]⁻¹, correct to 2 decimal places",
                              "options": [
                                        "3.76",
                                        "1.25",
                                        "0.13",
                                        "0.04"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If b³ = a⁻³ and c^(1/3) = a^(1/2)b, express c in terms of a",
                              "options": [
                                        "a^(-1/2)",
                                        "a^(1/2)",
                                        "a^(3/2)",
                                        "a^(-2/3)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given that Log(y - 1) + Log(1/2x) = 1 and Log(y + 1) + log₂x = 2, solve for x and y respectively",
                              "options": [
                                        "2, 3",
                                        "3, 2",
                                        "-2, -3",
                                        "-3, -2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the value of K if K/(√3 + √2) = √3 - 2",
                              "options": [
                                        "3",
                                        "2",
                                        "√3",
                                        "√2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A market woman sells oils in cylindrical tins 10cm deep and 6cm diameter at #15.00 each. If she bought a full cylindrical jug 18cm deep and 10cm in diameter for #50.00, how much did she make by selling all the oil?",
                              "options": [
                                        "#62.50",
                                        "#35.00",
                                        "#31.00",
                                        "#25.00"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A man is paid r naira per hour for normal work and double rate for overtime. If he does a 35-hour week which includes q hours of overtime, what is his weekly earning in naira?",
                              "options": [
                                        "r(35 + q)",
                                        "q(35r - q)",
                                        "q(35r + r)",
                                        "r(35r - q)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given the universal set U = {1, 2, 3, 4, 5, 6} and the sets P = {1, 2, 3, 4} Q = {3, 4, 5} and R = {2, 4, 6}. Find P ∪ (Q ∪ R).",
                              "options": [
                                        "{4}",
                                        "{1, 2, 3, 4}",
                                        "{1, 2, 3, 5, 6}",
                                        "{1, 2, 3, 4, 5, 6}"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "In the venn diagram above, the shaded region is",
                              "options": [
                                        "(P ∩ Q) ∪ R",
                                        "(P ∩ Q) ∩ R",
                                        "(P ∩ Q') ∩ R",
                                        "(P ∩ Q') ∪ R"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "When the expression pm² + qm + 1 is divided by (m - 1), it has a remainder 2 and when divided by (m + 1) the remainder is 4. Find p and q respectively",
                              "options": [
                                        "1, 2",
                                        "2, 1",
                                        "3, 1",
                                        "1, 3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Factorize r² - r(2p + q) + 2pq",
                              "options": [
                                        "(r - 2q)(2r - p)",
                                        "(r - q)(r + p)",
                                        "(r - q)(r - 2p)",
                                        "(2r - q)(r + p)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Solve the equation x - (x - 2)⁻¹ - 1 = 0",
                              "options": [
                                        "3/2",
                                        "2/3",
                                        "4/9",
                                        "9/4"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the range of values of m for which the roots of the equation 3x² - 3mx + (m² - m - 3) = 0",
                              "options": [
                                        "-1 < m < 7",
                                        "-2 < m < 6",
                                        "-3 < m < 9",
                                        "-4 < m < 8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Make a/x the subject of the formula (x + a)/(x - a) = m",
                              "options": [
                                        "(m - 1)/(m + 1)",
                                        "(1 + m)/(1 - m)",
                                        "(1 - m)/(1 + m)",
                                        "(m + 1)/(m - 1)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Divide 2x³ + 11x² + 17x + 6 by 2x + 1",
                              "options": [
                                        "x² + 5x + 6",
                                        "2x² + 5x + 6",
                                        "2x² - 5x + 6",
                                        "x² - 5x + 6"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Express in partial fractions (11x + 2)/(6x² - x - 1)",
                              "options": [
                                        "1/(3x-1) + 3/(2x+1)",
                                        "3/(3x+1) - 1/(2x-1)",
                                        "3/(3x-1) - 1/(2x+1)",
                                        "1/(3x+1) + 3/(2x-1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If x is a positive real number, find the range of values for which 1/3x + 1/2 > 1/4x",
                              "options": [
                                        "x > -1/6",
                                        "x > 0",
                                        "0 < x < 4",
                                        "0 < x < 1/6"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The shaded area above represents",
                              "options": [
                                        "x ≥ 0, 3y + 2x ≥ 6",
                                        "x ≥ 0, y ≥ 3, 3x + 2y ≥ 6",
                                        "x ≥ 2, y ≥ 0, 3x + 2y ≥ 6",
                                        "x ≥ 0, y ≥ 0, 3x + 2y ≥ 6"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "If p + 1, 2p - 10, 1 - 4p² are the consecutive terms of an arithmetic progression, find the possible values of p.",
                              "options": [
                                        "1, 3",
                                        "2, -3",
                                        "-2, 3",
                                        "-1, 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The sum of the first three terms of a geometric progression is half its sum to infinity. Find the positive common ratio of the progression.",
                              "options": [
                                        "1/4",
                                        "1/2",
                                        "1/√3",
                                        "1/√2"
                              ],
                              "correctAnswer": 1
                    }
          ],
          "1999": [
                    {
                              "question": "If (a²b³c)/a⁻¹b⁴c⁵, What is the value of P + 2q?",
                              "options": [
                                        "5/2",
                                        "-5/4",
                                        "-25/4",
                                        "-10"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the value of x if √2/(x + √2) = 1/(x - √2)",
                              "options": [
                                        "3√2 + 4",
                                        "3√2 - 4",
                                        "3 - 2√2",
                                        "4 + 2√2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A trader bought 100 oranges at 5 for #1.20, 20 oranges got spoilt and the remaining were sold at 4 for #1.50. Find the percentage gain or loss",
                              "options": [
                                        "30% gain",
                                        "25% gain",
                                        "30% loss",
                                        "25% loss"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If U = {1, 2, 3, 4, 5, 6}, P = {3, 4, 5}, Q = {2, 4, 6} and R = {1, 2, 3, 4}, list elements of (P ∪ Q' ∩ R).",
                              "options": [
                                        "{1, 2, 3, 4, 5, 6}",
                                        "{1, 2, 3, 4}",
                                        "{1}",
                                        "∅"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Divide 24346 by 426",
                              "options": [
                                        "23",
                                        "35",
                                        "6/526",
                                        "6"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 2/9x (Y³) = 9/3 (Y⁵³), find the value of Y",
                              "options": [
                                        "4",
                                        "3",
                                        "2",
                                        "1"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify (√0.0023 × 750)/(0.00345 × 1.25)",
                              "options": [
                                        "15",
                                        "20",
                                        "40",
                                        "75"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If log₈10 = x, evaluate log₈5 in terms of x.",
                              "options": [
                                        "1/x",
                                        "x - 1/4",
                                        "x - 1/3",
                                        "x - 1/2"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A group of market women sell at least one of yam, plantain and maize. 12 of them sell maize, 10 sell yam and 14 sell plantain. 5 sell plantain and maize, 4 sell yam and maize, 2 sell yam and plantain only while 3 sell all the three items. How many women are in the group?",
                              "options": [
                                        "25",
                                        "19",
                                        "18",
                                        "17"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given that Q = (6, 0) and Q + P = (7, 2) evaluate |Q + 2P|",
                              "options": [
                                        "90",
                                        "96",
                                        "102",
                                        "120"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A binary operation * is defined by a*b = ab + b for any real number a and b. If the identity element is zero, find the inverse of 2 under this operation",
                              "options": [
                                        "2/3",
                                        "1/2",
                                        "-1/2",
                                        "56/9"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The first term of a geometrical progression is twice its common ratio. Find the sum of the first two terms of the progression if its sum to infinity is 8",
                              "options": [
                                        "8/5",
                                        "8/3",
                                        "72/25",
                                        "56/9"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Tope bought x oranges at #5.00 each and some mangoes at #4.00 each. If she bought twice as many mangoes as oranges and spent at least #50 and at most #70, find the range of the value of x",
                              "options": [
                                        "4 ≤ x ≤ 5",
                                        "5 ≤ x ≤ 8",
                                        "5 ≤ x ≤ 10",
                                        "8 ≤ x ≤ 10"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If m*n = m/n - n/m, for m,n ∈ R, evaluate -3 * 4",
                              "options": [
                                        "-25/12",
                                        "-7/12",
                                        "7/12",
                                        "25/12"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the matrix T if ST = I where S = |-1, 1| and I is the identity matrix. |1, -2|",
                              "options": [
                                        "|-2, 1|",
                                        "|-2, -1|",
                                        "|-1, -1|",
                                        "|-1, -1|"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Divide 4x³ - 3x + 1 by 2x - 1",
                              "options": [
                                        "2x² - x + 1",
                                        "2x² - x - 1",
                                        "2x² + x + 1",
                                        "2x² + x - 1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Three consecutive positive integers k, l and m are such that l² = 3(k + m). Find the value of m.",
                              "options": [
                                        "4",
                                        "5",
                                        "6",
                                        "7"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "The shaded portion in the graph above is represented by",
                              "options": [
                                        "y + x - x³ ≥ 0, y - x ≤ 0",
                                        "y - x³ + x ≥ 0, y - x ≤ 0",
                                        "y + x - x³ ≤ 0, y + x ≥ 0",
                                        "y - x + x³ ≤ 0, y + x ≤ 0"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Factorize completely x² + 2xy + y² + 3x + 3y - 18",
                              "options": [
                                        "(x + y + 6)(x + y - 3)",
                                        "(x - y + 6)(x - y - 3)",
                                        "(x - y - 6)(x - y + 3)",
                                        "(x + y - 6)(x + y + 3)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The sum of two numbers is twice their difference. If the difference of the numbers is P, find the larger of the two numbers.",
                              "options": [
                                        "p/2",
                                        "3p/2",
                                        "5p/2",
                                        "3p"
                              ],
                              "correctAnswer": 1
                    }
          ],
          "2000": [
                    {
                              "question": "Let P = {1, 2, u, v, w, x}, Q = {2, 3, u, v, w, 5, 6, y} and R = {2, 3, 4, v, x, y}. Determine (P - Q) ∪ R.",
                              "options": [
                                        "{2, 3, 4, v, x, y}",
                                        "{1, 3, 4, x, y}",
                                        "{3, 4, x, y}",
                                        "{4, x}"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the population of a town was 240000 in January 1998 and it increased by 2% each year, what would be the population of the town in January 2000?",
                              "options": [
                                        "480,000",
                                        "249,696",
                                        "249,600",
                                        "244,800"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If (2√3 - √2)/(√3 + 2√2) = m + n√6, find the values of m and n respectively",
                              "options": [
                                        "1, -2",
                                        "-2, 1",
                                        "-2/5, 1/5",
                                        "2/5, -1/5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In a youth club with 94 members, 60 like modern music and 50 like traditional music. The number of members who like both traditional and modern music is three times who do not like any type of music. How many members like only one type of music?",
                              "options": [
                                        "8",
                                        "24",
                                        "62",
                                        "86"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate (2.813 × 10⁻³ × 1.063)/(5.637 × 10⁻²) reducing each number to two significant figures and leaving your answers in two significant figures.",
                              "options": [
                                        "0.056",
                                        "0.055",
                                        "0.054",
                                        "0.54"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A man wishes to keep some money in a savings deposit at 25% compound interest so that after 3 years he can buy a car for #150,000. How much does he need to deposit now?",
                              "options": [
                                        "#76,800",
                                        "#96,000",
                                        "#120,000",
                                        "#80,000"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If 314 - 256 = 340, find x",
                              "options": [
                                        "2",
                                        "3",
                                        "4",
                                        "5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Audu bought an article for #50,000 and sold it to Femi at a loss of x%. Femi later sold the article to Oche at a profit of 40%. If Femi made a profit of #10,000, find the value of x.",
                              "options": [
                                        "60",
                                        "50",
                                        "40",
                                        "20"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Simplify (3(2n + 1) - 4(2n - 1))/(2(n + 1) - 2n)",
                              "options": [
                                        "2n + 1",
                                        "2n - 1",
                                        "4",
                                        "1/4"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If P3446 - 23P26 = 2PP26, find the value of digit P.",
                              "options": [
                                        "2",
                                        "3",
                                        "4",
                                        "5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The 3rd term of an A.P. is 4x - 2y and the 9th term is 10x - 8y. Find the common difference.",
                              "options": [
                                        "19x - 17y",
                                        "8x - 4y",
                                        "x - y",
                                        "2x"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the inverse of p under the binary operation * by p * q = p + q - pq, where p and q are real numbers and zero is the identity.",
                              "options": [
                                        "p",
                                        "p - 1",
                                        "p/(p - 1)",
                                        "p/(p + 1)"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A matrix P = |a, b| is such that Pᵀ = P, where Pᵀ is the transpose of P, if b = 1, then P is |c, d|",
                              "options": [
                                        "|0, 1| |1, 0|",
                                        "|0, 1| |-1, 0|",
                                        "|0, 1| |1, 1|",
                                        "|1, 1| |-1, 0|"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate (1/2 - 1/4 + 1/8 - 1/16 + ...)⁻¹",
                              "options": [
                                        "2/3",
                                        "0",
                                        "-2/3",
                                        "1"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The solution of the simultaneous inequalities 2x - 2 ≤ y and 2y ≤ x² is represented by",
                              "options": [
                                        "-3 ≤ x ≤ 2",
                                        "-2 ≤ x ≤ 3",
                                        "-2 ≤ x ≤ 1",
                                        "1 ≤ x ≤ 2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the values of t for which the determinant of the matrix |t-4, 0, 0; -1, t+t, 1; 3, 4, t-2| is zero",
                              "options": [
                                        "0, 2, 3",
                                        "-4, 2, 3",
                                        "-4, -2, -3",
                                        "4, -2, 3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If (x - 1), (x + 1) and (x - 2) are factors of the polynomial ax³ + bx² + cx - 1, find a, b, c, respectively",
                              "options": [
                                        "8, 11/2",
                                        "11/2, 2/5",
                                        "1/8, 1",
                                        "2/5, 1/8"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A trader realizes 10x - x² naira profit from the sale of x bags of corn. How many bags will give him the maximum profit?",
                              "options": [
                                        "4",
                                        "5",
                                        "6",
                                        "7"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Solve the inequality 2 - x > x²",
                              "options": [
                                        "x < -2 or x > 1",
                                        "x > 2 or x < -1",
                                        "-1 < x < 2",
                                        "-2 < x < 1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If a and b are the roots of the equation 3x² + 5x - 2 = 0, find the value of 1/a + 1/b",
                              "options": [
                                        "-5/2",
                                        "-2/3",
                                        "1/2",
                                        "5/2"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "2001": [
                    {
                              "question": "Find the principal which amounts to #5,000 at simple interest in 5 years at 2% per annum",
                              "options": [
                                        "#5000",
                                        "#4900",
                                        "#4800",
                                        "#4700"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "A car dealer bought a second-hand car for #250,000.00 and spent #70,000.00 refurbishing it. He then sold the car for #400,000.00. What is the percentage gain?",
                              "options": [
                                        "20%",
                                        "25%",
                                        "32%",
                                        "60%"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Evaluate 21.05347 - 1.6324 × 0.43, to 3 decimal places.",
                              "options": [
                                        "20.351",
                                        "20.352",
                                        "20.980",
                                        "20.981"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate (0.14)² × 0.275)/7(0.02) correct to 3 decimal places",
                              "options": [
                                        "0.033",
                                        "0.039",
                                        "0.308",
                                        "0.358"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Given that p = 1 + √2 and q = 1 - √2, evaluate (p² - q²)/2pq",
                              "options": [
                                        "4",
                                        "-2",
                                        "-4",
                                        "-12"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If y/2 = x, evaluate (x³/y³ + 1/2) + (1/2 - x²/y²)",
                              "options": [
                                        "5/16",
                                        "5/8",
                                        "5/4",
                                        "5/2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (3√64a³)⁻³",
                              "options": [
                                        "8a",
                                        "4a",
                                        "1/4a",
                                        "1/8a"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Factorize 4x² - 9y² + 20x + 25",
                              "options": [
                                        "(2x - 3y)(2x + 3y)",
                                        "(2x + 5)(2x - 9y + 5)",
                                        "(2x - 3y + 5)(2x - 3y - 5)",
                                        "(2x - 3y)(2x + 3y + 5)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If two graphs y = px² and y = 2x² - 1 intersect at x = 2, find the value of p in terms of q",
                              "options": [
                                        "(7 + q)/8",
                                        "(8 - q)/2",
                                        "(q - 8)/7",
                                        "7/(q - 1)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Solve the equations: m² + n² = 29; m + n = 7",
                              "options": [
                                        "(5, 2) and (5, 3)",
                                        "(5, 3) and (3, 5)",
                                        "(2, 3) and (3, 5)",
                                        "(2, 5) and (5, 2)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Divide a³x - 26a²x + 156ax - 216 by a²x - 24ax + 108",
                              "options": [
                                        "ax - 18",
                                        "ax - 6",
                                        "ax - 2",
                                        "ax + 2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Triangle SPT is the solution of the linear inequalities",
                              "options": [
                                        "2y - x - 2 ≥ 0, y + 2x + 2 ≤ 0, y ≥ 0",
                                        "2y - x - 2 ≤ 0, y + 2x + 2 ≥ 0, y ≤ 0",
                                        "2y - x - 2 ≥ 0, y + 2x + 2 ≤ 0, y ≥ 0, x ≤ -1",
                                        "-2y ≤ x ≤ 2 ≥ 0, y + 2x + 2 ≤ 0, y ≥ 0"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The sixth term of an arithmetic progression is half of its twelfth term. The first term is equal to",
                              "options": [
                                        "half of the common difference",
                                        "double of the common difference",
                                        "the common difference",
                                        "zero"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A man saves #100.00 in his first year of work and each year saves #20.00 more than in the preceding year. In how many years will he save #580.00",
                              "options": [
                                        "20 years",
                                        "29 years",
                                        "58 years",
                                        "100 years"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "An operation * is defined on the set of real numbers by a*b = a + b + 1. If the identity element is -1, find the inverse of the element 2 under.",
                              "options": [
                                        "-4",
                                        "2",
                                        "0",
                                        "4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The identity element with respect to the multiplication shown in the table above is",
                              "options": [
                                        "k",
                                        "l",
                                        "m",
                                        "o"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Given that matrix K = |2, 1| the matrix K² + K + I, where I is the 2 × 2 identity matrix, is |3, 4|",
                              "options": [
                                        "|9, 8| |22, 23|",
                                        "|10, 7| |21, 24|",
                                        "|7, 2| |12, 21|",
                                        "|6, 3| |13, 20|"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate |-1, 3, 1; 1, 2, 1; 3, 1, -1|",
                              "options": [
                                        "-6, -4, -2",
                                        "-6, 4, -8",
                                        "-6, -4, 2",
                                        "10, 2, -12"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the number of sides of a regular polygon whose interior angle is twice the exterior angle",
                              "options": [
                                        "2",
                                        "3",
                                        "6",
                                        "8"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In the figure above, PQR is a straight line segment, PQ = QT. Triangle PQT is an isosceles triangle, SRQ = 75° and QPT = 25°. Calculate the value of RST.",
                              "options": [
                                        "25°",
                                        "45°",
                                        "50°",
                                        "55°"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "2002": [
                    {
                              "question": "A trader bought goats for #4,000 each. He sold them for #180,000 at a loss of 25%. How many goats did he buy?",
                              "options": [
                                        "36",
                                        "45",
                                        "50",
                                        "60"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Simplify (√0.7 + √70)²",
                              "options": [
                                        "217.7",
                                        "168.7",
                                        "84.7",
                                        "70.7"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Evaluate (0.21 × 0.072 × 0.0054)/(0.006 × 1.68 × 0.063) correct to four significant figures.",
                              "options": [
                                        "0.1286",
                                        "0.1285",
                                        "0.01286",
                                        "0.01285"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In a school, 220 students offer Biology or Mathematics or both. 125 offer Biology and 110 Mathematics. How many offer Biology but not Mathematics?",
                              "options": [
                                        "125",
                                        "110",
                                        "95",
                                        "80"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify 5².4 - 5.7 - 3.45 - 1.75",
                              "options": [
                                        "42.2",
                                        "42.1",
                                        "41.5",
                                        "41.4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Without using tables, evaluate (343)^(1/3) × (0.14)⁻¹ × (25)^(1/2)",
                              "options": [
                                        "7",
                                        "8",
                                        "10",
                                        "12"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In the diagram below are two concentric circles of radii r and R respectively with centre O. If r = 2/5 R, express the area of the shaded portion in terms of π and R.",
                              "options": [
                                        "9/25πR²",
                                        "5/9πR²",
                                        "21/25πR²",
                                        "21/25πR²"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the value of & if the line 2y - &x + 4 = 0 is perpendicular to the line y + 1/2x - 7 = 0",
                              "options": [
                                        "-8",
                                        "-4",
                                        "4",
                                        "8"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A bucket is 12cm in diameter at the top, 8cm in diameter at the bottom and 4cm deep. Calculate its volume.",
                              "options": [
                                        "144πcm³",
                                        "304πcm³/3",
                                        "72πcm³",
                                        "128πcm³/3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "In the diagram below, XZ is the diameter of the circle XYZW, with centre O and radius 15/2cm. If XY = 12cm, find the area of the triangle XYZ.",
                              "options": [
                                        "75cm²",
                                        "54cm²",
                                        "45cm²",
                                        "27cm²"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the coordinate of the midpoint of x and y intercepts of the line 2y = 4x - 8",
                              "options": [
                                        "(-1, -2)",
                                        "(1, 2)",
                                        "(2, 0)",
                                        "(1, -2)"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A chord of a circle subtends an angle of 120° at the centre of a circle of diameter 4√3cm. Calculate the area of the major sector.",
                              "options": [
                                        "32πcm²",
                                        "16πcm²",
                                        "8πcm²",
                                        "4πcm²"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "If tan θ = 4/3, calculate sin²θ - cos²θ.",
                              "options": [
                                        "7/25",
                                        "9/25",
                                        "16/25",
                                        "24/25"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the diagram above, PST is a straight line, PQ = QS = RS. If RSRT = 72°, find x.",
                              "options": [
                                        "72°",
                                        "36°",
                                        "24°",
                                        "18°"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The locus of a point P which is equidistant from two given points S and T is",
                              "options": [
                                        "a perpendicular to ST",
                                        "a line parallel to ST",
                                        "the angle bisector of PS and ST",
                                        "the perpendicular bisector ST"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "A solid hemisphere has radius 7cm. Find the total surface area.",
                              "options": [
                                        "462cm²",
                                        "400cm²",
                                        "308cm²",
                                        "66cm²"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The angle PGR below is",
                              "options": [
                                        "a scalene triangle",
                                        "an isosceles triangle",
                                        "an equilateral triangle",
                                        "an obtuse-angled triangle"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The sum of the interior angles of a polygon is 20 right angles. How many sides does the polygon have?",
                              "options": [
                                        "10",
                                        "12",
                                        "20",
                                        "40"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the equation of the set of points which are equidistant from the parallel lines x = 1 and x = 7",
                              "options": [
                                        "y = 4",
                                        "y = 3",
                                        "x = 3",
                                        "x = 4"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "In the diagram below, a cylinder is surrounded by a hemispherical bowl. Calculate the volume of the solid.",
                              "options": [
                                        "216πcm³",
                                        "198πcm³",
                                        "180πcm³",
                                        "162πcm³"
                              ],
                              "correctAnswer": 0
                    }
          ],
          "2003": [
                    {
                              "question": "Simplify (2/3 - 1/5) - 1/3 of 2/5 ÷ 3 - 1/2",
                              "options": [
                                        "1/7",
                                        "7",
                                        "1/3",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 2/3 × 1¾ - 1½ ÷ 2½",
                              "options": [
                                        "3/2",
                                        "2/3",
                                        "2",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify 2134 × 234",
                              "options": [
                                        "1, 10",
                                        "2, 10",
                                        "3, 13",
                                        "4, 16"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A woman buys 270 oranges for #1800.00 and sells at 5 for #40.00. What is her profit?",
                              "options": [
                                        "#630.00",
                                        "#360.00",
                                        "#1620.00",
                                        "#2160.00"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Simplify (√98 - √50)/√32",
                              "options": [
                                        "1/2",
                                        "1/4",
                                        "1",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The sum of four numbers is 12145. What is the average expressed in base five?",
                              "options": [
                                        "411",
                                        "401",
                                        "141",
                                        "114"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Evaluate log₇49 + log₁/₂16 - log₄32",
                              "options": [
                                        "-2.5",
                                        "5.5",
                                        "-5.5",
                                        "2.5"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given: U = {Even numbers between 0 and 30} P = {Multiples of 6 between 0 and 30} Q = {Multiples of 4 between 0 and 30} Find (P ∪ Q)'.",
                              "options": [
                                        "{0, 2, 6, 22, 26}",
                                        "{2, 4, 14, 18, 26}",
                                        "{2, 10, 14, 22, 26}",
                                        "{0, 10, 14, 22, 26}"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In a class of 40 students, 32 offer Mathematics, 24 offer Physics and 4 offer neither Mathematics nor Physics. How many offer both Mathematics and Physics?",
                              "options": [
                                        "20",
                                        "16",
                                        "12",
                                        "8"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find (1/0.06 - 1/0.042)⁻¹, correct to two decimal places",
                              "options": [
                                        "0.08",
                                        "0.13",
                                        "0.20",
                                        "0.25"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Factorize completely 4abx - 2axy - 12b²x + 6bxy",
                              "options": [
                                        "2x(3b - a)(2b - y)",
                                        "2x(a - 3b)(b - 2y)",
                                        "2x(2b - a)(3b - y)",
                                        "2x(a - 3b)(2b - y)"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "The sum of the first n terms of an arithmetic progression is 252. If the first term is -16 and the last term is 72, find the number of terms in the series.",
                              "options": [
                                        "7",
                                        "9",
                                        "6",
                                        "8"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "The graphs of the function y = x² + 4 and a straight line PQ are drawn to solve the equation x² - 3x + 2 = 0. What is the equation of PQ?",
                              "options": [
                                        "y = 3x - 2",
                                        "y = 3x + 2",
                                        "y = -3x + 2",
                                        "y = -3x - 2"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "A matrix P has an inverse P⁻¹ = |1, -3| Find P. |0, 1|",
                              "options": [
                                        "|1, -3| |0, 1|",
                                        "|1, 3| |0, 1|",
                                        "|1, 0| |-3, 1|",
                                        "|1, 0| |3, 1|"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Find the values of x and y respectively if 3x - 5y + 5 = 0 and 4x - 7y + 8 = 0",
                              "options": [
                                        "-4, -5",
                                        "-5, -4",
                                        "5, 4",
                                        "4, 5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the range of values of x satisfying the inequalities 5 + x ≤ 8 and 13 + x ≥ 7.",
                              "options": [
                                        "-6 ≤ x ≤ 3",
                                        "-6 ≤ x ≤ -3",
                                        "3 ≤ x ≤ 6",
                                        "-3 ≤ x ≤ 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "x varies directly as the product of U and V and inversely as their sum. If x = 3 when U = 3 and V = 1, what is the value of x if U = 3 and V = 3?",
                              "options": [
                                        "4",
                                        "9",
                                        "6",
                                        "3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Three consecutive terms of a geometric progression are given as n - 2, n and n + 3. Find the common ratio.",
                              "options": [
                                        "3/2",
                                        "2/3",
                                        "2",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The length a person can jump is inversely proportional to his weight. If a 20kg person can jump 1.5m, find the constant of proportionality.",
                              "options": [
                                        "30",
                                        "60",
                                        "15",
                                        "20"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In the diagram above, O is the centre of the circle, POM is a diameter and MNQ = 42°. Calculate QMP.",
                              "options": [
                                        "138°",
                                        "132°",
                                        "42°",
                                        "48°"
                              ],
                              "correctAnswer": 2
                    }
          ],
          "2004": [
                    {
                              "question": "Find x and y respectively in the subtraction above carried out in base 5 1 3 x 2 - y 3 4 4",
                              "options": [
                                        "2, 4",
                                        "3, 2",
                                        "4, 2",
                                        "4, 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find p, if 4516 - p7 = 3056",
                              "options": [
                                        "6117",
                                        "1427",
                                        "1167",
                                        "627"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "1/10 × 2/3 + 1/4 ÷ 1/3 - 1/4",
                              "options": [
                                        "2",
                                        "0",
                                        "1",
                                        "K + 1"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "A farmer planted 5000 grains of maize and harvested 5000 cobs, each bearing 500 grains. What is the ratio of the number of grains sowed to the number harvested?",
                              "options": [
                                        "1:500",
                                        "1:5000",
                                        "1:25000",
                                        "1:250000"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Three teachers shared a packet of chalk. The first teacher got 2/5 of the chalk and the second teacher received 2/15 of the remainder. What fraction did the third teacher receive?",
                              "options": [
                                        "11/15",
                                        "12/15",
                                        "13/15",
                                        "8/15"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Given that 3√4 = 2x, find the value of x",
                              "options": [
                                        "3",
                                        "6",
                                        "12",
                                        "18"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "Simplify 1/(√3 + 2) in the form a + b√3",
                              "options": [
                                        "-2 - 3",
                                        "-2 + 3",
                                        "2 - 3",
                                        "2 + 3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If 6logx2 - 3logx3 = 3logx0.2, find x.",
                              "options": [
                                        "3/8",
                                        "3/4",
                                        "4/3",
                                        "8/3"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "In the diagram above, the shaded region is",
                              "options": [
                                        "Pc ∩ (Q ∪ R)",
                                        "P ∩ Q",
                                        "Pc ∪ (Q ∩ R)",
                                        "Pc ∩ (Q ∪ R)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "In a class of 40 students, each student offers at least one of Physics and Chemistry. If the number of students that offer Physics is three times the number that offer both subjects and the number that offers Chemistry is twice the number that offer Physics, find the number of students that offer Physics only.",
                              "options": [
                                        "25",
                                        "15",
                                        "10",
                                        "5"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the values of x where the curve y = x³ + 2x² - 5x - 6 crosses the x-axis.",
                              "options": [
                                        "-2, -1 and 3",
                                        "-2, 1 and -3",
                                        "2, -1 and -3",
                                        "2, 1 and 3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Find the remainder when 3x³ + 5x² - 11x + is divided by x + 3",
                              "options": [
                                        "4",
                                        "1",
                                        "-1",
                                        "4"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "Factorize completely ac - 2bc - a² + 4b²",
                              "options": [
                                        "(a - 2b)(c + a - 2b)",
                                        "(a - 2b)(c - a - 2b)",
                                        "(a - 2b)(c + a + 2b)",
                                        "(a - 2b)(c - a + 2b)"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "y is inversely proportional to x and y = 4 when x = 1/2. Find x when y = 10",
                              "options": [
                                        "1/5",
                                        "1/4",
                                        "1/3",
                                        "1/2"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The length L of a simple pendulum varies directly as the square of its period T. If a pendulum with period 4 secs is 64cm long, find the length of a pendulum whose period is 9 sec.",
                              "options": [
                                        "36cm",
                                        "96cm",
                                        "144cm",
                                        "324cm"
                              ],
                              "correctAnswer": 3
                    },
                    {
                              "question": "Given that the first and fourth terms of a G.P are 6 and 162 respectively, find the sum of the first three terms of the progression.",
                              "options": [
                                        "8",
                                        "27",
                                        "48",
                                        "78"
                              ],
                              "correctAnswer": 2
                    },
                    {
                              "question": "Find the sum to infinity of the series 1/2, 1/6, 1/18, ...",
                              "options": [
                                        "1",
                                        "3/4",
                                        "2/3",
                                        "1/3"
                              ],
                              "correctAnswer": 1
                    },
                    {
                              "question": "If the operation * on the set of integers is defined by p*q = √pq, find the value of 4*(8*32).",
                              "options": [
                                        "16",
                                        "8",
                                        "4",
                                        "3"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "The inverse of the matrix |2, 1; 1, 1| is",
                              "options": [
                                        "|1, -1; -1, 2|",
                                        "|1, 1; -1, 2|",
                                        "|1, -1; 1, 2|",
                                        "|1, 1; 1, 2|"
                              ],
                              "correctAnswer": 0
                    },
                    {
                              "question": "If |3, 4, 5; -1, 0, 1| then |P| is",
                              "options": [
                                        "-8",
                                        "0",
                                        "4",
                                        "8"
                              ],
                              "correctAnswer": 1
                    }
          ]
}
    },"Chemistry": {
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
        questionsByYear: {
            "2010": [
                {
                    question: "Which of the following is an example of a mixture?",
                    options: ["Common salt", "Blood", "Sand", "Washing soda"],
                    correctAnswer: 1
                },
                {
                    question: "Calculate the percentage by mass of nitrogen in calcium trioxonitrate (V). [Ca = 40, N = 14, O = 16]",
                    options: ["8.5%", "13.1%", "17.1%", "27.6%"],
                    correctAnswer: 2
                },
                {
                    question: "The droplets of water observed around a bottle of milk taken out of the refrigerator is due to the fact that the:",
                    options: ["water vapour in the air around the bottle gains some energy from the bottle", "temperature of the milk drops as it loses heat into the surroundings", "saturated vapour pressure of the milk is equal to the atmospheric pressure", "water vapour in the air around the bottle loses some of its energy to the bottle"],
                    correctAnswer: 3
                },
                {
                    question: "The volume of a given gas is V cm³ at P mm Hg. What is the new volume of the gas if the pressure is reduced to half at constant temperature?",
                    options: ["4V cm³", "2V cm³", "V/2 cm³", "V cm³"],
                    correctAnswer: 1
                },
                {
                    question: "Moving from left to right across a period, the general rise in the first ionization energy can be attributed to the:",
                    options: ["decrease in nuclear charge", "increase in nuclear charge", "decrease in screening effect", "increase in screening effect"],
                    correctAnswer: 1
                },
                {
                    question: "How many unpaired electron(s) are there in the nitrogen sub-levels?",
                    options: ["3", "2", "1", "none"],
                    correctAnswer: 0
                },
                {
                    question: "The stability of the noble gases is due to the fact that they:",
                    options: ["have no electron in their outermost shells", "have duplet or octet electron configurations", "belong to group zero of the periodic table", "are volatile in nature"],
                    correctAnswer: 1
                },
                {
                    question: "The maximum number of electrons in the L shell of an atom is:",
                    options: ["2", "8", "18", "32"],
                    correctAnswer: 1
                },
                {
                    question: "Elements in the same period in the periodic table have the same:",
                    options: ["number of shells", "atomic number", "chemical properties", "physical properties"],
                    correctAnswer: 0
                },
                {
                    question: "A noble gas with a high power of fog penetration used in aerodrome beacons is:",
                    options: ["krypton", "argon", "helium", "neon"],
                    correctAnswer: 0
                },
                {
                    question: "Permanent hardness of water can be removed by",
                    options: ["filtration", "adding slaked lime", "adding caustic soda", "boiling"],
                    correctAnswer: 1
                },
                {
                    question: "Substance employed as drying agents are usually",
                    options: ["amphoteric", "hydroscopic", "efflorescent", "acidic"],
                    correctAnswer: 1
                },
                {
                    question: "Calculate the solubility in mol dm⁻³ of 40g of CuSO₄ dissolved in 100g of water at 120°C. [Cu = 64, S = 32, O = 16]",
                    options: ["4.00", "2.50", "0.40", "0.25"],
                    correctAnswer: 1
                },
                {
                    question: "Coffee stains can best be removed by",
                    options: ["Kerosene", "turpentine", "a solution of borax in water", "ammonia solution"],
                    correctAnswer: 3
                },
                {
                    question: "Carbon (II) oxide is considered dangerous if inhaled mainly because it",
                    options: ["can cause injury to the nervous system", "competes with oxygen in the blood", "competes with carbon (IV) oxide in the blood", "can cause lung cancer"],
                    correctAnswer: 1
                },
                {
                    question: "The acid that is used to remove rust is",
                    options: ["boric", "hydrochloric", "trioxonitrate (V)", "tetraoxosulphate (VI)"],
                    correctAnswer: 1
                },
                {
                    question: "Calculate the volume of 0.5 mol dm⁻³ H₂SO₄ that is neutralized by 25 cm³ of 0.1 mol dm⁻³ NaOH",
                    options: ["5.0 cm³", "2.5 cm³", "0.4 cm³", "0.1 cm³"],
                    correctAnswer: 1
                },
                {
                    question: "The colour of methyl orange in alkaline medium is",
                    options: ["yellow", "pink", "orange", "red"],
                    correctAnswer: 0
                },
                {
                    question: "Which of the following salts is slightly soluble in water?",
                    options: ["AgCl", "CaSO₄", "Na₂CO₃", "PbCl₂"],
                    correctAnswer: 1
                },
                {
                    question: "In the reaction 6AgNO₄(aq) + PH₃(g) + 3H₂O(l) → 6Ag(s) + H₃PO₃(g) + 6HNO₃(aq), the reducing agent is",
                    options: ["HNO₃(aq)", "H₂O(l)", "PH₃(g)", "AgNO₃(aq)"],
                    correctAnswer: 2
                },
                {
                    question: "The IUPAC nomenclature of the compound LiAlH₄ is",
                    options: ["lithium tetrahydridoaluminate (III)", "aluminium tetrahydrido lithium", "tetrahydrido lithium aluminate (III)", "lithium aluminium hydride"],
                    correctAnswer: 0
                },
                {
                    question: "Iron can be protected from corrosion by coating the surface with",
                    options: ["gold", "silver", "copper", "zinc"],
                    correctAnswer: 3
                },
                {
                    question: "What quantity of aluminium is deposited when a current of 10A is passed through a solution of an aluminium salt for 1930s? [Al = 27, F = 96500 C mol⁻¹]",
                    options: ["0.2 g", "1.8 g", "5.4 g", "14.2 g"],
                    correctAnswer: 1
                },
                {
                    question: "In which of the following is the entropy change positive?",
                    options: ["Thermal dissociation of ammonium chloride", "Reaction between an acid and a base", "Addition of concentrated acid to water", "Dissolution of sodium metal in water"],
                    correctAnswer: 0
                },
                {
                    question: "If a reaction is exothermic and there is a great disorder, it means that",
                    options: ["the reaction is static", "the reaction is in a state of equilibrium", "there will be a large increase in free energy", "there will be a large decrease in free energy"],
                    correctAnswer: 3
                },
                {
                    question: "In the preparation of oxygen by heating KClO₃ in the presence of MnO₂, only moderate heat is needed because the catalyst acts by",
                    options: ["lowering the pressure of the reaction", "increasing the surface area of the reactant", "increasing the rate of the reaction", "lowering the energy barrier of the reaction"],
                    correctAnswer: 3
                },
                {
                    question: "To a solution of an unknown compound, a little dilute tetraoxosulphate (VI) acid was added with some freshly prepared iron (II) tetraoxosulphate (VI) solution. The brown ring observed after the addition of a stream of concentrated tetraoxosulphate (VI) acid confirmed the presence of",
                    options: ["CO", "Cl⁻", "SO₄²⁻", "NO₃⁻"],
                    correctAnswer: 3
                },
                {
                    question: "Which of the following is used in rocket fuels?",
                    options: ["HNO₃", "CH₃COOH", "H₂SO₄", "HCl"],
                    correctAnswer: 0
                },
                {
                    question: "A constituent common to bronze and solder is",
                    options: ["lead", "silver", "copper", "tin"],
                    correctAnswer: 3
                },
                {
                    question: "When iron is exposed to moist air, it gradually rusts. This is due to the formation of",
                    options: ["hydrate iron (III) oxide", "anhydrous iron (III) oxide", "anhydrous iron (II) oxide", "hydrate iron (II) oxide"],
                    correctAnswer: 0
                },
                {
                    question: "A compound gives an orange-red colour to non-luminous flame. This compound is likely to contain",
                    options: ["Na⁺", "Ca²⁺", "Fe³⁺", "Fe²⁺"],
                    correctAnswer: 1
                },
                {
                    question: "Stainless steel is used for making",
                    options: ["magnets", "tools", "coins and medals", "moving parts of clocks"],
                    correctAnswer: 2
                },
                {
                    question: "The residual solids from the fractional distillation of petroleum are used as",
                    options: ["coatings of pipes", "raw materials for the cracking process", "fuel for the driving tractors", "fuel for jet engines"],
                    correctAnswer: 0
                },
                {
                    question: "The IUPAC nomenclature of 4-ethyloctane is",
                    options: ["4-ethyloctane", "5-ethyloctane", "5-propylheptane", "3-propylheptane"],
                    correctAnswer: 0
                },
                {
                    question: "Which of the following is used as fuel in miners' lamp?",
                    options: ["Ethanal", "Ethyne", "Ethene", "Ethane"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following organic compounds is very soluble in water?",
                    options: ["CH₃COOH", "C₂H₂", "C₂H₄", "CH₃COOC₂H₅"],
                    correctAnswer: 0
                },
                {
                    question: "Benzene reacts with hydrogen in the presence of nickel catalyst at 180°C to give",
                    options: ["xylene", "toluene", "cyclopentane", "cyclohexane"],
                    correctAnswer: 3
                },
                {
                    question: "Which of the following is used to hasten the ripening of fruit?",
                    options: ["Ethene", "Ethanol", "Ethyne", "Ethane"],
                    correctAnswer: 0
                },
                {
                    question: "The final products of the reaction between methane and chlorine in the presence of ultraviolet light are hydrogen chloride and",
                    options: ["tricloromethane", "dichloromethane", "tetrachloromethane", "chloromethane"],
                    correctAnswer: 2
                },
                {
                    question: "The correct order of increasing boiling points of the following compounds C₃H₇OH, C₇H₁₆ and C₄H₁₀ is",
                    options: ["C₃H₇OH < C₄H₁₀ < C₇H₁₆", "C₄H₁₀ < C₇H₁₆ < C₃H₇OH", "C₇H₁₆ < C₃H₇OH < C₄H₁₀", "C₄H₁₀ < C₃H₇OH < C₇H₁₆"],
                    correctAnswer: 3
                },
                {
                    question: "One of the major uses of alkane is",
                    options: ["as domestic and industrial fuel", "in the hydrogenation of oils", "in the textile industries", "in the production of plastics"],
                    correctAnswer: 0
                },
                {
                    question: "The haloalkanes used in dry-cleaning industries are",
                    options: ["trichloromethane and tetrachloromethane", "chloroethene and dichloroethene", "trichloroethene and tetrachloroethene", "chloroethane and dichloroethane"],
                    correctAnswer: 2
                },
                {
                    question: "Two hydrocarbons X and Y were treated with bromine water. X decolorized the solution and Y did not. Which class of compound does Y belong?",
                    options: ["Benzene", "Alkynes", "Alkenes", "Alkanes"],
                    correctAnswer: 3
                },
                {
                    question: "The compound that is used as an anaesthetic is",
                    options: ["CCl₄", "CHCl₃", "CH₂Cl₂", "CH₃Cl"],
                    correctAnswer: 1
                }
            ],
            "2011": [
                {
                    question: "What is the concentration of a solution containing 2g of NaOH in 100cm³ of solution? [Na = 23, O = 16, H = 1]",
                    options: ["0.40 mol dm⁻³", "0.50 mol dm⁻³", "0.05 mol dm⁻³", "0.30 mol dm⁻³"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following properties is NOT peculiar to matter?",
                    options: ["kinetic energy of particles increases from solid to gas", "Random motion of particles increases from liquid to gas", "Orderliness of particles increases from gas to liquid", "Random motion of particles increases from gas to solid"],
                    correctAnswer: 3
                },
                {
                    question: "The principle of column chromatography is based on the ability of the constituents to:",
                    options: ["move at different speeds in the column", "dissolve in each other in the column", "react with the solvent in the column", "react with each other in the column"],
                    correctAnswer: 0
                },
                {
                    question: "Which of the following statements is correct about the periodic table?",
                    options: ["The non-metallic properties of the elements tend to decrease across each period", "The valence electrons of the elements increase progressively across the period", "Elements in the same group have the same number of electron shells", "Elements in the same period have the same number of valence electrons"],
                    correctAnswer: 1
                },
                {
                    question: "An isotope has an atomic number of 15 and a mass number of 31. The number of protons it contains is:",
                    options: ["16", "15", "46", "31"],
                    correctAnswer: 1
                },
                {
                    question: "The molecular lattice of iodine is held together by:",
                    options: ["dative bond", "metallic bond", "hydrogen bond", "van der Waal's forces"],
                    correctAnswer: 3
                },
                {
                    question: "The arrangement of particles in crystal lattices can be studied using:",
                    options: ["X-rays", "γ-rays", "α-rays", "β-rays"],
                    correctAnswer: 0
                },
                {
                    question: "The importance of sodium aluminate (III) in the treatment of water is to:",
                    options: ["cause coagulation", "neutralize acidity", "prevent goitre and tooth decay", "kill germs"],
                    correctAnswer: 0
                },
                {
                    question: "What type of bond exists between an element X with atomic number 12 and Y with atomic number 17?",
                    options: ["Electrovalent", "Metallic", "Covalent", "Dative"],
                    correctAnswer: 0
                },
                {
                    question: "Hardness of water is mainly due to the presence of:",
                    options: ["calcium hydroxide or magnesium hydroxide", "calcium trioxocarbonate (IV) or calcium tetraoxosulphate (VI)", "sodium hydroxide or magnesium hydroxide", "calcium chloride or sodium chloride salts"],
                    correctAnswer: 1
                }
            ],
            "2012": [
                {
                    question: "How many atoms are present in 6.0g of magnesium? [Mg = 24, NA = 6.02 × 10²³ mol⁻¹]",
                    options: ["1.20 × 10²²", "2.41 × 10²²", "1.51 × 10²³", "3.02 × 10²³"],
                    correctAnswer: 0
                },
                {
                    question: "50 cm³ of gas was collected over water at 10°C and 765 mm Hg. Calculate the volume of the gas at s.t.p. if the saturated vapour pressure of water at 10°C is 5mm Hg.",
                    options: ["49.19 cm³", "48.87 cm³", "48.55 cm³", "48.23 cm³"],
                    correctAnswer: 0
                },
                {
                    question: "An increase in the pressure exerted on a gas at a constant temperature results in:",
                    options: ["a decrease in the number of effective collisions", "a decrease in volume", "an increase in the average intermolecular distance", "an increase in volume"],
                    correctAnswer: 1
                },
                {
                    question: "In the reaction 2H₂(g) + O₂(g) → 2H₂O(g), what volume of hydrogen would be left over when 300 cm³ of oxygen and 1000 cm³ of hydrogen are exploded in a sealed tube?",
                    options: ["200 cm³", "400 cm³", "600 cm³", "700 cm³"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following can correctly be listed as evidences for the particulate nature of matter? I. Evaporation. II. Sublimation. III. Diffusion. IV. Brownian motion.",
                    options: ["I and III only", "II and IV only", "I, II and III only", "I, II, III and IV"],
                    correctAnswer: 3
                },
                {
                    question: "If the elements X and Y have atomic numbers 11 and 17 respectively, what type of bond can they form?",
                    options: ["Dative", "Covalent", "Ionic", "Metallic"],
                    correctAnswer: 2
                },
                {
                    question: "A hydrogen atom which has lost an electron contains:",
                    options: ["one proton only", "one neutron only", "one proton and one neutron", "one proton, one electron and one neutron"],
                    correctAnswer: 0
                },
                {
                    question: "The electronic configuration of Mg²⁺ is:",
                    options: ["1s² 2s² 2p⁶ 3s² 3p²", "1s² 2s² 2p⁶ 3s²", "1s² 2s² 2p⁶", "1s² 2s² 2p⁴"],
                    correctAnswer: 2
                },
                {
                    question: "Group VII elements are:",
                    options: ["monoatomic", "good oxidizing agents", "highly electropositive", "electron donors"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following is used to study the arrangement of particles in crystal lattices?",
                    options: ["Alpha-particles", "Beta-particles", "Gamma-rays", "X-rays"],
                    correctAnswer: 3
                }
            ],
            "2013": [
                {
                    question: "The presence of an impurity in a substance will cause the melting point to:",
                    options: ["be zero", "reduce", "increase", "be stable"],
                    correctAnswer: 1
                },
                {
                    question: "What volume of carbon (II) oxide is produced by reacting excess carbon with 10 dm³ of oxygen?",
                    options: ["5 dm³", "20 dm³", "15 dm³", "10 dm³"],
                    correctAnswer: 1
                },
                {
                    question: "The rate of diffusion of a gas Y is twice that of Z. If the relative molecular mass of Y is 64 and the two gases diffuse under the same conditions, find the relative molecular mass of Z.",
                    options: ["32", "4", "8", "16"],
                    correctAnswer: 0
                },
                {
                    question: "The radioisotope used in industrial radiography for the rapid checking of faults in welds and casting is:",
                    options: ["Carbon-14", "Phosphorus-32", "Cobalt-60", "Iodine-131"],
                    correctAnswer: 2
                },
                {
                    question: "How many unpaired electrons are in the p-orbitals of a fluorine atom?",
                    options: ["3", "0", "1", "2"],
                    correctAnswer: 2
                },
                {
                    question: "The radioactive emission with the least ionization power is:",
                    options: ["α-particles", "X-rays", "γ-rays", "β-particles"],
                    correctAnswer: 2
                },
                {
                    question: "The shape of the carbon (IV) oxide molecule is:",
                    options: ["pyramidal", "linear", "angular", "tetrahedral"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following molecules is held together by hydrogen bond?",
                    options: ["CH₄", "HBr", "H₂SO₄", "HF"],
                    correctAnswer: 3
                },
                {
                    question: "The bond formed between two elements with electron configurations 1s² 2s² 2p⁶ 3s² and 1s² 2s² 2p⁴ is:",
                    options: ["metallic", "covalent", "dative", "ionic"],
                    correctAnswer: 1
                },
                {
                    question: "The constituent of air that acts as a diluent is:",
                    options: ["nitrogen", "carbon (IV) oxide", "noble gases", "oxygen"],
                    correctAnswer: 0
                }
            ],
            "2014": [
                { question: "Which of the following is a physical change?", options: ["Burning of wood", "Rusting of iron", "Melting of ice", "Fermentation of sugar"], correctAnswer: 2 },
                { question: "The method of separation used to separate solid-liquid mixture is called", options: ["filtration", "distillation", "evaporation", "crystallization"], correctAnswer: 0 },
                { question: "An element with atomic number 12 belongs to which group?", options: ["Group 1", "Group 2", "Group 3", "Group 4"], correctAnswer: 1 },
                { question: "The arrangement of electrons in an atom is called", options: ["electron configuration", "atomic number", "mass number", "valency"], correctAnswer: 0 },
                { question: "Which of the following is a noble gas?", options: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"], correctAnswer: 2 }
            ],
            "2015": [
                { question: "The nucleus of an atom consists of", options: ["protons only", "neutrons only", "protons and neutrons", "electrons and protons"], correctAnswer: 2 },
                { question: "Which of the following is an example of a transition metal?", options: ["Sodium", "Iron", "Calcium", "Aluminium"], correctAnswer: 1 },
                { question: "The process of removing water of crystallization from a hydrated salt is called", options: ["dehydration", "efflorescence", "deliquescence", "hygroscopy"], correctAnswer: 0 },
                { question: "The pH of a neutral solution is", options: ["0", "7", "14", "1"], correctAnswer: 1 },
                { question: "Which gas is prepared by the action of dilute acid on marble?", options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], correctAnswer: 2 }
            ],
            "2016": [
                { question: "The empirical formula of a compound is CH₂O and its molecular mass is 180. The molecular formula is", options: ["C₆H₁₂O₆", "C₅H₁₀O₅", "C₄H₈O₄", "C₃H₆O₃"], correctAnswer: 0 },
                { question: "The oxidation state of nitrogen in HNO₃ is", options: ["+1", "+3", "+5", "+7"], correctAnswer: 2 },
                { question: "Which of the following gases is the lightest?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"], correctAnswer: 2 },
                { question: "The catalyst used in the Haber process is", options: ["Platinum", "Iron", "Vanadium(V) oxide", "Nickel"], correctAnswer: 1 },
                { question: "A saturated solution is one that", options: ["contains undissolved solute", "cannot dissolve more solute", "can still dissolve more solute", "is concentrated"], correctAnswer: 1 }
            ],
            "2017": [
                { question: "The number of electrons in the outermost shell of a group 2 element is", options: ["1", "2", "3", "4"], correctAnswer: 1 },
                { question: "Which of the following compounds contains ionic bond?", options: ["HCl", "H₂O", "NaCl", "CH₄"], correctAnswer: 2 },
                { question: "The IUPAC name for CH₃CH₂OH is", options: ["methanol", "ethanol", "propanol", "butanol"], correctAnswer: 1 },
                { question: "The process of coating iron with zinc is called", options: ["galvanization", "electroplating", "alloying", "anodizing"], correctAnswer: 0 },
                { question: "Which of the following is used as a drying agent?", options: ["CaCl₂", "NaCl", "KCl", "MgCl₂"], correctAnswer: 0 }
            ],
            "2018": [
                { question: "The chemical formula of calcium hydroxide is", options: ["CaO", "Ca(OH)₂", "CaCO₃", "CaCl₂"], correctAnswer: 1 },
                { question: "The number of moles of electrons needed to deposit 108g of silver is [Ag = 108]", options: ["0.5 mol", "1 mol", "2 mol", "3 mol"], correctAnswer: 1 },
                { question: "Which of the following is a weak acid?", options: ["HCl", "H₂SO₄", "CH₃COOH", "HNO₃"], correctAnswer: 2 },
                { question: "The type of bonding in sodium chloride crystal is", options: ["covalent", "ionic", "metallic", "dative"], correctAnswer: 1 },
                { question: "An element with electronic configuration 2,8,8,2 belongs to period", options: ["2", "3", "4", "5"], correctAnswer: 2 }
            ]
        }
    },
    "Physics": {
        years: ["2022", "2021"],
        questionsByYear: {
            "2022": [
                { question: "A car travels at a constant speed of 20 m/s for 10 seconds. What distance does it cover?", options: ["100 m", "200 m", "300 m", "400 m"], correctAnswer: 1 },
                { question: "Which of the following is a vector quantity?", options: ["Mass", "Temperature", "Velocity", "Time"], correctAnswer: 2 },
                { question: "The SI unit of electric current is:", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswer: 1 },
                { question: "An object is projected vertically upward with a velocity of 20 m/s. The maximum height reached is: (g = 10 m/s²)", options: ["10 m", "20 m", "30 m", "40 m"], correctAnswer: 1 },
                { question: "The phenomenon of total internal reflection occurs when light travels from:", options: ["A denser to a less dense medium", "A less dense to a denser medium", "One medium to another of the same density", "A vacuum to a denser medium"], correctAnswer: 0 },
                { question: "The unit of specific heat capacity is:", options: ["J/kg", "J/kg.K", "J.K/kg", "kg/J.K"], correctAnswer: 1 },
                { question: "The resistance of a wire depends on all of the following EXCEPT:", options: ["Length", "Cross-sectional area", "Temperature", "Color of the wire"], correctAnswer: 3 },
                { question: "The frequency of a wave is 50 Hz and its wavelength is 2 m. What is its velocity?", options: ["25 m/s", "100 m/s", "52 m/s", "48 m/s"], correctAnswer: 1 },
                { question: "Which type of lens is used to correct short-sightedness?", options: ["Convex lens", "Concave lens", "Biconvex lens", "Plano-convex lens"], correctAnswer: 1 },
                { question: "The principle behind the working of a hydraulic press is:", options: ["Archimedes' principle", "Pascal's principle", "Newton's principle", "Boyle's principle"], correctAnswer: 1 }
            ],
            "2021": [
                { question: "A body of mass 2 kg moving with a velocity of 5 m/s collides with a stationary body of mass 3 kg. If they move together after collision, their common velocity is:", options: ["1 m/s", "2 m/s", "3 m/s", "4 m/s"], correctAnswer: 1 },
                { question: "The dimension of power is:", options: ["ML²T⁻³", "MLT⁻²", "ML²T⁻²", "MLT⁻¹"], correctAnswer: 0 },
                { question: "A simple pendulum has a period of 2 seconds. What is its length? (g = 10 m/s², π² = 10)", options: ["0.5 m", "1.0 m", "1.5 m", "2.0 m"], correctAnswer: 1 },
                { question: "The energy stored in a capacitor is given by:", options: ["½CV²", "CV²", "½CV", "CV"], correctAnswer: 0 },
                { question: "The process by which heat is transferred through a vacuum is:", options: ["Conduction", "Convection", "Radiation", "Advection"], correctAnswer: 2 },
                { question: "An object is placed 20 cm from a convex lens of focal length 15 cm. The image distance is:", options: ["30 cm", "60 cm", "45 cm", "35 cm"], correctAnswer: 1 },
                { question: "The refractive index of a medium is 1.5. The critical angle for total internal reflection is:", options: ["30°", "42°", "48°", "60°"], correctAnswer: 1 },
                { question: "The half-life of a radioactive element is 10 days. What fraction of the element will remain after 30 days?", options: ["1/2", "1/4", "1/8", "1/16"], correctAnswer: 2 },
                { question: "In a series R-C circuit, the voltage across the resistor and capacitor are 3V and 4V respectively. The supply voltage is:", options: ["5V", "7V", "1V", "12V"], correctAnswer: 0 },
                { question: "The work done in moving a unit positive charge from infinity to a point in an electric field is called:", options: ["Electric potential", "Potential difference", "Electric field intensity", "Electric flux"], correctAnswer: 0 }
            ]
        }
    },
    "Biology": {
        years: ["2022", "2021"],
        questionsByYear: {
            "2022": [
                { question: "The basic unit of life is the:", options: ["Tissue", "Cell", "Organ", "Organism"], correctAnswer: 1 },
                { question: "Which of the following is NOT a function of the liver?", options: ["Production of bile", "Storage of glycogen", "Production of insulin", "Detoxification"], correctAnswer: 2 },
                { question: "The process by which green plants manufacture their food is called:", options: ["Respiration", "Photosynthesis", "Digestion", "Absorption"], correctAnswer: 1 },
                { question: "The genetic material in living organisms is:", options: ["Protein", "RNA", "DNA", "Carbohydrate"], correctAnswer: 2 },
                { question: "Which of the following is a vector for malaria?", options: ["Housefly", "Female Anopheles mosquito", "Male Anopheles mosquito", "Tsetse fly"], correctAnswer: 1 },
                { question: "The part of the brain that controls voluntary actions is the:", options: ["Cerebellum", "Cerebrum", "Medulla oblongata", "Thalamus"], correctAnswer: 1 },
                { question: "The blood vessel that carries blood away from the heart is the:", options: ["Vein", "Artery", "Capillary", "Venule"], correctAnswer: 1 },
                { question: "The enzyme that breaks down starch into maltose is:", options: ["Ptyalin", "Pepsin", "Trypsin", "Lipase"], correctAnswer: 0 },
                { question: "The organelle responsible for protein synthesis is the:", options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"], correctAnswer: 1 },
                { question: "The mode of nutrition in tapeworms is:", options: ["Autotrophic", "Holozoic", "Parasitic", "Saprophytic"], correctAnswer: 2 }
            ],
            "2021": [
                { question: "The largest organ in the human body is the:", options: ["Liver", "Brain", "Skin", "Heart"], correctAnswer: 2 },
                { question: "Which of the following is NOT a sexually transmitted infection?", options: ["Gonorrhea", "Syphilis", "Malaria", "HIV/AIDS"], correctAnswer: 2 },
                { question: "The powerhouse of the cell is the:", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], correctAnswer: 1 },
                { question: "The process of cell division that results in the formation of gametes is called:", options: ["Mitosis", "Meiosis", "Binary fission", "Budding"], correctAnswer: 1 },
                { question: "Which of the following is a primary consumer?", options: ["Lion", "Grass", "Goat", "Snake"], correctAnswer: 2 },
                { question: "The structure in plant cells that is absent in animal cells is:", options: ["Nucleus", "Cell wall", "Mitochondria", "Ribosome"], correctAnswer: 1 },
                { question: "The hormone that regulates blood sugar level is:", options: ["Thyroxine", "Insulin", "Adrenaline", "Glucagon"], correctAnswer: 1 },
                { question: "Which blood group is known as the universal donor?", options: ["A", "B", "AB", "O"], correctAnswer: 3 },
                { question: "The excretory organ in amoeba is the:", options: ["Kidney", "Contractile vacuole", "Flame cell", "Nephridium"], correctAnswer: 1 },
                { question: "The theory of natural selection was propounded by:", options: ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Robert Hooke"], correctAnswer: 1 }
            ]
        }
    },
    "Economics": {
        years: ["2022", "2021"],
        questionsByYear: {
            "2022": [
                { question: "The basic economic problem is:", options: ["Unemployment", "Scarcity", "Inflation", "Poverty"], correctAnswer: 1 },
                { question: "Which of the following is a factor of production?", options: ["Money", "Capital", "Profit", "Trade"], correctAnswer: 1 },
                { question: "The law of demand states that:", options: ["Price increases, quantity demanded increases", "Price decreases, quantity demanded decreases", "Price decreases, quantity demanded increases", "Price increases, supply increases"], correctAnswer: 2 },
                { question: "A market with many buyers and few sellers is called:", options: ["Perfect competition", "Monopoly", "Oligopoly", "Monopolistic competition"], correctAnswer: 2 },
                { question: "Which of the following is NOT a function of money?", options: ["Medium of exchange", "Store of value", "Measure of value", "Factor of production"], correctAnswer: 3 }
            ],
            "2021": [
                { question: "Opportunity cost is best described as:", options: ["The money spent on a good", "The alternative forgone", "The total cost of production", "The price of a commodity"], correctAnswer: 1 },
                { question: "Which economic system relies mainly on market forces?", options: ["Socialist economy", "Capitalist economy", "Mixed economy", "Traditional economy"], correctAnswer: 1 },
                { question: "A tax that takes a higher percentage from high income earners is called:", options: ["Regressive tax", "Proportional tax", "Progressive tax", "Indirect tax"], correctAnswer: 2 },
                { question: "Inflation can be controlled by:", options: ["Increasing money supply", "Reducing interest rates", "Increasing taxes", "Increasing government spending"], correctAnswer: 2 },
                { question: "Balance of trade refers to:", options: ["Total exports and imports", "Difference between visible exports and imports", "Difference between visible and invisible trade", "Total balance of payments"], correctAnswer: 1 }
            ]
        }
    },
    "Government": {
        years: ["2022", "2021"],
        questionsByYear: {
            "2022": [
                { question: "The organ of government responsible for making laws is the:", options: ["Executive", "Legislature", "Judiciary", "Civil service"], correctAnswer: 1 },
                { question: "A system of government where power is shared between central and regional governments is called:", options: ["Unitary system", "Federal system", "Confederal system", "Presidential system"], correctAnswer: 1 },
                { question: "The right to vote is known as:", options: ["Human right", "Franchise", "Civil right", "Natural right"], correctAnswer: 1 },
                { question: "Which of the following is NOT a characteristic of democracy?", options: ["Periodic elections", "Rule of law", "One-party system", "Fundamental human rights"], correctAnswer: 2 },
                { question: "The principle of separation of powers was propounded by:", options: ["John Locke", "Baron de Montesquieu", "Jean Jacques Rousseau", "Aristotle"], correctAnswer: 1 }
            ],
            "2021": [
                { question: "A government that is accountable to the people is described as:", options: ["Military government", "Democratic government", "Authoritarian government", "Totalitarian government"], correctAnswer: 1 },
                { question: "The Nigerian independence was achieved in:", options: ["1960", "1963", "1966", "1979"], correctAnswer: 0 },
                { question: "The head of government in a parliamentary system is the:", options: ["President", "Prime Minister", "Governor", "Monarch"], correctAnswer: 1 },
                { question: "Public opinion can be influenced by all of the following EXCEPT:", options: ["Mass media", "Education", "Age", "Religion"], correctAnswer: 2 },
                { question: "The first military coup in Nigeria occurred in:", options: ["1960", "1963", "1966", "1979"], correctAnswer: 2 }
            ]
        }
    },
    "Geography": {
        years: ["2022", "2021"],
        questionsByYear: {
            "2022": [
                { question: "The imaginary line at 0° longitude is called:", options: ["Equator", "Prime Meridian", "Tropic of Cancer", "Tropic of Capricorn"], correctAnswer: 1 },
                { question: "Which of the following is an agent of erosion?", options: ["Wind", "Gravity", "Water", "All of the above"], correctAnswer: 3 },
                { question: "The largest ocean in the world is the:", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correctAnswer: 2 },
                { question: "The process by which rocks are broken down in situ is called:", options: ["Erosion", "Weathering", "Mass movement", "Deposition"], correctAnswer: 1 },
                { question: "Which type of map shows the relief features of an area?", options: ["Political map", "Topographical map", "Climate map", "Vegetation map"], correctAnswer: 1 }
            ],
            "2021": [
                { question: "The equator passes through which of these African countries?", options: ["Nigeria", "Kenya", "South Africa", "Egypt"], correctAnswer: 1 },
                { question: "The study of population is called:", options: ["Demography", "Geography", "Cartography", "Topography"], correctAnswer: 0 },
                { question: "Which of the following is NOT a type of volcano?", options: ["Active", "Dormant", "Extinct", "Erupted"], correctAnswer: 3 },
                { question: "The process by which water vapor turns into liquid water is called:", options: ["Evaporation", "Condensation", "Precipitation", "Transpiration"], correctAnswer: 1 },
                { question: "The local time at longitude 30°E when it is 12 noon at Greenwich is:", options: ["10 am", "2 pm", "12 noon", "4 pm"], correctAnswer: 1 }
            ]
        }
    }
};

// Helper function to get available subjects
function getAvailableSubjects() {
    if (typeof jambQuestions === 'undefined' || !jambQuestions) {
        console.error('jambQuestions is not defined!');
        return [];
    }
    return Object.keys(jambQuestions);
}

// Helper function to get years for a subject
function getYearsForSubject(subject) {
    if (!jambQuestions || !jambQuestions[subject]) {
        return [];
    }
    return jambQuestions[subject].years || [];
}

// Helper function to get questions for subject and year
function getQuestionsForSubjectAndYear(subject, year) {
    if (!jambQuestions || !jambQuestions[subject] || !jambQuestions[subject].questionsByYear) {
        return [];
    }
    return jambQuestions[subject].questionsByYear[year] || [];
}

/**
 * Quiz: Angles of Elevation and Depression
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'elevation-depression', [
    {
        question: "The angle of elevation is measured from which line?",
        options: ["Vertical line", "Horizontal line", "Line of sight", "Ground surface"],
        correct: 1,
        explanation: "The angle of elevation is measured from the horizontal line upward to the line of sight."
    },
    {
        question: "From a point on the ground 30m away from a tower, the angle of elevation to the top is 45°. What is the height of the tower?",
        options: ["15m", "30m", "45m", "60m"],
        correct: 1,
        explanation: "tan 45° = height/distance = h/30. Since tan 45° = 1, h = 30m."
    },
    {
        question: "The angle of depression from the top of a building to a car on the ground is the same as:",
        options: ["Angle of elevation from the car to the building top", "Angle of elevation from the building to the car", "The complement of the angle of elevation", "The supplement of the angle of elevation"],
        correct: 0,
        explanation: "By alternate angles theorem, the angle of depression equals the angle of elevation from the ground point."
    },
    {
        question: "A ladder leans against a wall making an angle of 60° with the ground. If the foot of the ladder is 3m from the wall, how long is the ladder?",
        options: ["3m", "6m", "3√3m", "6√3m"],
        correct: 1,
        explanation: "cos 60° = adjacent/hypotenuse = 3/L. L = 3/cos 60° = 3/0.5 = 6m."
    },
    {
        question: "From a cliff 100m high, the angle of depression to a boat is 30°. How far is the boat from the base of the cliff?",
        options: ["50m", "100m", "100√3m", "50√3m"],
        correct: 2,
        explanation: "tan 30° = 100/distance. Distance = 100/tan 30° = 100/(1/√3) = 100√3m."
    }
]);

/**
 * Quiz: Financial Arithmetic
 * Subject: Mathematics
 */

registerTopicQuiz('mathematics', 'financial-arithmetic', [
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
]);

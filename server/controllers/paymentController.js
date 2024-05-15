
// Import the Payment model
const Payment = require('../models/Payment');

exports.generateSamplePayments = async (req, res) => {
  try {
    // Generate 20 sample payment records
    const samplePayments = [];
    for (let i = 1; i <= 20; i++) {
      const payment = {
        userID: req.user.id, // Assuming you have user authentication
        transactionId: i,
        userCardNum: Math.floor(Math.random() * 10000000000000000), // Random 16-digit number
        userCardExpiry: Math.floor(Math.random() * 12) + 1 + '/' + (new Date().getFullYear() + Math.floor(Math.random() * 10)), // Random MM/YY format
        userCVV: Math.floor(Math.random() * 1000), // Random 3-digit CVV
      };
      samplePayments.push(payment);
    }

    // Insert sample payments into the database
    await Payment.insertMany(samplePayments);

    res.status(201).json({ msg: 'Sample payments generated successfully' });
  } catch (error) {
    console.error('Error generating sample payments:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};
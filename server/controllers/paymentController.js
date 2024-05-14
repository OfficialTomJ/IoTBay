const Payment = require('../models/Payment');
const AccessLog = require('../models/AccessLog');

exports.createPayment = async (req, res) => {
  const { transactionId, userCardNum, userCardExpiry, userCVV } = req.body;
  console.log(req.body);
  try {
    // Create a new payment record
    const payment = await Payment.create({
      transactionId,
      userCardNum,
      userCardExpiry,
      userCVV,
      userID: req.user.id
    });

     AccessLog.create({
       eventType: 'payment_created',
       userId: req.user.id,
     });

    // Send response
    res.status(201).json({ payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userID: req.user.id });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

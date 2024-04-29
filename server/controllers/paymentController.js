const Payment = require('../models/Shipment');
const AccessLog = require('../models/AccessLog');

exports.createPayment = async (req, res) => {
  const { transactionId, userCardNum, userCardExpiry, user_CCV } = req.body;
  console.log(transactionId);
  try {
    // Create a new payment record
    const payment = await Payment.create({
      transactionId,
      userCardNum,
      userCardExpiry,
      user_CCV,
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

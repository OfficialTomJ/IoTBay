const Shipment = require('../models/Shipment');
const AccessLog = require('../models/AccessLog');

exports.createShipment = async (req, res) => {
  const { orderId, shipmentMethod, address, status, tracking } = req.body;
  console.log(orderId);
  try {
    // Create a new shipment record
    const shipment = await Shipment.create({
      orderId,
      shipmentMethod,
      address,
      status,
      tracking,
      userID: req.user.id
    });

     AccessLog.create({
       eventType: 'shipment_created',
       userId: req.user.id,
     });

    // Send response
    res.status(201).json({ shipment });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

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

exports.getUserShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ userID: req.user.id });

    res.json({ shipments });
  } catch (error) {
    console.error('Error fetching user shipments:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const shipments = await Shipment.find({ userID: req.user.id });

    const uniqueAddresses = Array.from(
      new Set(shipments.map((shipment) => shipment.address))
    );

    res.json({ addresses: uniqueAddresses });
  } catch (error) {
    console.error("Error fetching user shipments:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateShipment = async (req, res) => {
  const { orderId, shipmentMethod, address, status, tracking, _id } = req.body;
  const { id } = req.params;
  try {
    const shipment = await Shipment.findById(_id);
    if (!shipment) {
      return res.status(404).json({ msg: "Shipment not found" });
    }
    console.log("runs");

    // Update the shipment record
    shipment.shipmentMethod = shipmentMethod;
    shipment.address = address;
    await shipment.save();

    // Send response
    res.json({ msg: "Shipment updated successfully" });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
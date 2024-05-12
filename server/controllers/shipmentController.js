const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');
const mongoose = require("mongoose");

exports.createShipment = async (req, res) => {
  const { orderId, shipmentMethod, address, status, tracking } = req.body;
  try {
    // Convert orderId to ObjectId
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    // Check if there's a valid order ID in orders
    const existingOrder = await Order.findOne({ _id: orderObjectId });
    if (!existingOrder) {
      return res.status(400).json({ msg: "Invalid order ID" });
    }

    // Create a new shipment record
    const shipment = await Shipment.create({
      orderId, 
      shipmentMethod,
      address,
      status,
      tracking,
      userID: req.user.id,
    });

    // Update the associated order's shipmentID
    existingOrder.shipmentID = shipment._id;
    await existingOrder.save();

    // Log the shipment creation
    AccessLog.create({
      eventType: "shipment_created",
      userId: req.user.id,
    });

    // Send response
    res.status(201).json({ shipment });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ msg: "Server Error" });
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

exports.deleteShipment = async (req, res) => {
  const { id } = req.params;
  console.log("runs delete", id);
  try {
    // Find the shipment by ID
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ msg: "Shipment not found" });
    }

    // Delete the shipment record
    await Shipment.findByIdAndDelete(id);

    // Log the shipment deletion
    await AccessLog.create({
      eventType: "shipment_deleted",
      userId: req.user.id,
      shipmentId: id,
    });

    // Send success response
    res.json({ msg: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
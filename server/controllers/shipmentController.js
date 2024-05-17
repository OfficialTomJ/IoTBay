const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const AccessLog = require("../models/AccessLog");
const mongoose = require("mongoose");

// Controller for creating a new shipment
exports.createShipment = async (req, res) => {
  // Check if req.body is defined and contains the required properties
  if (
    !req.body
  ) {
    return res.status(500).json({ msg: "Invalid request body" });
  }

  const { orderId, shipmentMethod, address, status, tracking } = req.body;

  try {
    // Convert orderId to ObjectId
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    // Check if there's a valid order ID in orders
    const existingOrder = await Order.findOne({ _id: orderObjectId });
    if (!existingOrder) {
      return res.status(400).json({ msg: "Invalid order ID" });
    }

    // Validate shipmentMethod
    if (shipmentMethod !== "Air" && shipmentMethod !== "Sea") {
      return res
        .status(400)
        .json({ msg: "Shipment method must be either 'Air' or 'Sea'" });
    }

    // Validate address (check if address is not empty)
    if (!address) {
      return res.status(400).json({ msg: "Address is required" });
    }

    // Validate status
    const validStatuses = ["processing", "packing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid shipment status" });
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


// Controller for fetching user shipments
exports.getUserShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ userID: req.user.id });

    res.json({ shipments });
  } catch (error) {
    console.error("Error fetching user shipments:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Controller for fetching user addresses
exports.getUserAddresses = async (req, res) => {
  try {
    const shipments = await Shipment.find({ userID: req.user.id });

    const uniqueAddresses = Array.from(
      new Set(shipments.map((shipment) => shipment.address))
    );

    res.json({ addresses: uniqueAddresses });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Controller for updating a shipment
exports.updateShipment = async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ msg: "Invalid request body" });
  }

  const { shipmentMethod, address, _id } = req.body;

  try {
    // Validate shipmentId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ msg: "Invalid shipmentId" });
    }

    // Find the shipment by ID
    const shipment = await Shipment.findById(_id);
    if (!shipment) {
      return res.status(404).json({ msg: "Shipment not found" });
    }

    // Validate shipmentMethod
    if (
      shipmentMethod &&
      shipmentMethod !== "Air" &&
      shipmentMethod !== "Sea"
    ) {
      return res
        .status(400)
        .json({ msg: "Shipment method must be either 'Air' or 'Sea'" });
    }

    // Validate address (Check if address is not empty)
    if (address && !address.trim()) {
      return res.status(400).json({ msg: "Address is required" });
    }

    // Update the shipment record
    if (shipmentMethod) {
      shipment.shipmentMethod = shipmentMethod;
    }
    if (address) {
      shipment.address = address;
    }
    await shipment.save();

    AccessLog.create({
      eventType: "shipment_updated",
      userId: req.user.id,
    });

    // Send response
    res.json({ msg: "Shipment updated successfully" });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};


// Controller for deleting a shipment
exports.deleteShipment = async (req, res) => {
  if (!req.body || !req.body.id) {
    return res
      .status(400)
      .json({ msg: "Invalid request data: ID is required" });
  }
  const { id } = req.body;

  try {
    // Validate shipmentId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid shipmentId" });
    }

    // Find the shipment by ID
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ msg: "Shipment not found" });
    }

    // Delete the shipment record
    const deletedShipment = await Shipment.findByIdAndDelete(id);

    // Check if shipment was deleted
    if (!deletedShipment) {
      return res.status(404).json({ msg: "Shipment not found" });
    }

    // Log the shipment deletion
    await AccessLog.create({
      eventType: "shipment_deleted",
      userId: req.user.id,
    });

    // Send success response
    res.json({ msg: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};



// Controller for searching shipments
exports.searchShipments = async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ msg: "Invalid request body" });
  }

  const { shipmentId, date } = req.query;
  console.log("Search query:", { shipmentId, date });

  try {
    // Validate userID
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ msg: "Invalid userID" });
    }

    // Construct the query
    let query = { userID: req.user.id };

    if (shipmentId) {
      if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
        return res.status(400).json({ msg: "Invalid shipmentId" });
      }
      query._id = shipmentId;
    }

    if (date) {
      const isoDate = new Date(date);
      if (isNaN(isoDate.getTime())) {
        return res.status(400).json({ msg: "Invalid date" });
      }
      const startOfDay = new Date(
        isoDate.getFullYear(),
        isoDate.getMonth(),
        isoDate.getDate()
      );
      const endOfDay = new Date(
        isoDate.getFullYear(),
        isoDate.getMonth(),
        isoDate.getDate() + 1
      );
      query.date = { $gte: startOfDay, $lt: endOfDay };
    }

    // Log the constructed query
    console.log("Constructed query:", query);

    // Find shipments matching the query
    const shipments = await Shipment.find(query);

    // If no filtering criteria were provided, return an empty array
    if (!shipmentId && !date) {
      return res.json({ shipments: [] });
    }

    // Send the search results
    res.json({ shipments });
  } catch (error) {
    console.error("Error searching shipments:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};


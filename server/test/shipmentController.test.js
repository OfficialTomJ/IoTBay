const mongoose = require("mongoose");
const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const {
  createShipment,
  getUserShipments,
  getUserAddresses,
  updateShipment,
  deleteShipment,
  searchShipments,
} = require("../controllers/shipmentController");

jest.mock("../models/Shipment");
jest.mock("../models/Order");

describe("Shipment Controller", () => {
  let mockRequest;
  let mockResponse;
  let mockUser;

  beforeEach(() => {
    mockUser = { id: new mongoose.Types.ObjectId() };
    mockRequest = { user: mockUser };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createShipment", () => {
    it("should return error for invalid order ID", async () => {
      mockRequest.body = { orderId: "66348624c9759a58dfcab46e" };

      await createShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Invalid order ID",
      });
    });

    it("should return error for invalid shipment method", async () => {
      mockRequest.body = {
        orderId: new mongoose.Types.ObjectId(),
        shipmentMethod: "spaceship",
      };

      await createShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Shipment method must be either 'Air' or 'Sea'",
      });
    });

    it("should return error if address is empty", async () => {
      mockRequest.body = {
        orderId: new mongoose.Types.ObjectId(),
        shipmentMethod: "Air",
        address: "",
      };

      await createShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Address is required",
      });
    });

    it("should create a new shipment and update the associated order", async () => {
      const orderId = mongoose.Types.ObjectId();
      const shipmentId = mongoose.Types.ObjectId();
      const mockOrder = { _id: orderId, save: jest.fn() };
      const mockShipment = { _id: shipmentId };
      Order.findOne.mockResolvedValue(mockOrder);
      Shipment.create.mockResolvedValue(mockShipment);

      mockRequest.body = {
        orderId,
        shipmentMethod: "Air",
        address: "123 Street",
        status: "processing",
        tracking: "123456",
      };

      await createShipment(mockRequest, mockResponse);

      expect(Order.findOne).toHaveBeenCalledWith({ _id: orderId });
      expect(Shipment.create).toHaveBeenCalledWith({
        orderId,
        shipmentMethod: "Air",
        address: "123 Street",
        status: "processing",
        tracking: "123456",
        userID: mockUser.id,
      });
      expect(mockOrder.shipmentID).toEqual(shipmentId);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        shipment: mockShipment,
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Order.findOne.mockRejectedValue(error);

      await createShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

  describe("getUserShipments", () => {
    it("should return user shipments", async () => {
      const userId = mockUser.id;
      const mockShipments = [{}, {}];
      Shipment.find.mockResolvedValue(mockShipments);

      await getUserShipments(mockRequest, mockResponse);

      expect(Shipment.find).toHaveBeenCalledWith({ userID: userId });
      expect(mockResponse.json).toHaveBeenCalledWith({
        shipments: mockShipments,
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Shipment.find.mockRejectedValue(error);

      await getUserShipments(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

  describe("getUserAddresses", () => {
    it("should return unique user addresses", async () => {
      const mockShipments = [
        { address: "Address 1" },
        { address: "Address 2" },
        { address: "Address 1" },
      ];
      Shipment.find.mockResolvedValue(mockShipments);

      await getUserAddresses(mockRequest, mockResponse);

      expect(Shipment.find).toHaveBeenCalledWith({ userID: mockUser.id });
      expect(mockResponse.json).toHaveBeenCalledWith({
        addresses: ["Address 1", "Address 2"],
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Shipment.find.mockRejectedValue(error);

      await getUserAddresses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

  describe("updateShipment", () => {
    it("should return error for invalid shipment ID", async () => {
      mockRequest.body = { _id: "invalidID" };

      await updateShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Invalid shipmentId",
      });
    });

    it("should update shipment method", async () => {
      const validShipmentId = mongoose.Types.ObjectId();
      const mockShipment = { _id: validShipmentId, save: jest.fn() };
      Shipment.findById.mockResolvedValue(mockShipment);

      mockRequest.body = { _id: validShipmentId, shipmentMethod: "Air" };

      await updateShipment(mockRequest, mockResponse);

      expect(mockShipment.shipmentMethod).toEqual("Air");
      expect(mockShipment.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Shipment updated successfully",
      });
    });

    it("should update shipment address", async () => {
      const validShipmentId = mongoose.Types.ObjectId();
      const mockShipment = { _id: validShipmentId, save: jest.fn() };
      Shipment.findById.mockResolvedValue(mockShipment);

      mockRequest.body = { _id: validShipmentId, address: "New Address" };

      await updateShipment(mockRequest, mockResponse);

      expect(mockShipment.address).toEqual("New Address");
      expect(mockShipment.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Shipment updated successfully",
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Shipment.findById.mockRejectedValue(error);

      await updateShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

  describe("deleteShipment", () => {
    it("should return error for invalid shipment ID", async () => {
      const invalidShipmentId = "invalidID";
      mockRequest.params = { id: invalidShipmentId };

      await deleteShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Invalid shipmentId",
      });
    });

    it("should delete shipment", async () => {
      const validShipmentId = mongoose.Types.ObjectId();
      const mockShipment = { _id: validShipmentId };
      Shipment.findByIdAndDelete.mockResolvedValue(mockShipment);

      mockRequest.params = { id: validShipmentId };

      await deleteShipment(mockRequest, mockResponse);

      expect(Shipment.findByIdAndDelete).toHaveBeenCalledWith(validShipmentId);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Shipment deleted successfully",
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Shipment.findByIdAndDelete.mockRejectedValue(error);

      await deleteShipment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

  describe("searchShipments", () => {
    it("should return shipments matching query", async () => {
      const validUserId = mongoose.Types.ObjectId();
      const mockShipments = [{}, {}];
      const mockQuery = { userID: validUserId };
      Shipment.find.mockResolvedValue(mockShipments);

      mockRequest.user.id = validUserId;
      mockRequest.query = { shipmentId: "validID", date: "2024-05-15" };

      await searchShipments(mockRequest, mockResponse);

      expect(Shipment.find).toHaveBeenCalledWith({
        userID: validUserId,
        _id: "validID",
        date: { $gte: new Date("2024-05-15"), $lt: new Date("2024-05-16") },
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        shipments: mockShipments,
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      Shipment.find.mockRejectedValue(error);

      await searchShipments(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Server Error" });
    });
  });

});

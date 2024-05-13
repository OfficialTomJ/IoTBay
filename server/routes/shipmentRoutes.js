const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const shipmentController = require('../controllers/shipmentController');


router.post('/create', auth, shipmentController.createShipment);
router.get('/user-shipments', auth, shipmentController.getUserShipments);
router.get("/user-addresses", auth, shipmentController.getUserAddresses);
router.put('/update', auth, shipmentController.updateShipment);
router.delete("/delete/:id", auth, shipmentController.deleteShipment);
router.get("/search", auth, shipmentController.searchShipments);
module.exports = router;
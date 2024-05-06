const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const shipmentController = require('../controllers/shipmentController');


router.post('/create', auth, shipmentController.createShipment);
router.get('/user-shipments', auth, shipmentController.getUserShipments);
router.get("/user-addresses", auth, shipmentController.getUserAddresses);
module.exports = router;
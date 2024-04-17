const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const shipmentController = require('../controllers/shipmentController');

router.post('/create', auth, shipmentController.createShipment);

module.exports = router;
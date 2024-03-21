const express = require('express');
const router = express.Router();

//import controllers
const {getTest} = require('../controllers/test');

//api routes
router.get('/test', getTest);

module.exports = router;
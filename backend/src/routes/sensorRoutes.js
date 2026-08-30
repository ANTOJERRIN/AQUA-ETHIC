const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// POST: Receive data from ESP32 buoy
router.post('/data', sensorController.receiveData);

// GET: Get latest reading for a device
router.get('/latest/:deviceId', sensorController.getLatest);

// GET: Get historical readings for a device
router.get('/history/:deviceId', sensorController.getHistory);

// GET: Verify a reading by its hash
router.get('/verify/:dataHash', sensorController.verifyReading);

module.exports = router;
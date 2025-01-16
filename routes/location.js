const express = require('express');
const router = express.Router();
const Location = require('../models/location');

// Route to save location data
router.post('/update-location', async (req, res) => {
    const { deviceId, latitude, longitude } = req.body;
    try {
        const location = new Location({ deviceId, latitude, longitude });
        await location.save();
        res.status(200).json({ message: 'Location saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save location', error: error });
    }
});

// Route to get all location data
router.get('/get-location', async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get locations', error: error });
    }
});

module.exports = router;

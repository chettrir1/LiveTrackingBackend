const mongoose = require('mongoose');

// Create a mongoose schema for location data
const locationSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
});

// Create and export the model
module.exports = mongoose.model('Location', locationSchema);

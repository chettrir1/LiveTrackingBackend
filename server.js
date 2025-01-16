const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Create an express application
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Defining the server port (default to 6000)
const PORT = process.env.PORT || 1000;

// Import routes
const locationRoutes = require('./routes/location');

const Location = require('./models/location');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connecting to MongoDB using mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('Error connecting to MongoDB', err));

// Use routes for location API
app.use('/api', locationRoutes);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('User connected');

  // Emit location update every 5 seconds
    ws.on('message', async (msg) => {
        console.log('Received Location update: ', msg);

        //parse the incoming message
        let locationData;
        try {
            locationData = JSON.parse(msg);
        } catch (error) {
            console.error('Error parsing location update:', error);
            return;
        }

        try {
            const location = new Location(locationData);
            await location.save();
            console.log('Location saved to DB:', locationData);
        } catch (error) {
            console.error('Error saving location to DB:', error);
            return;
        }

        wss.clients.forEach(client => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(msg);
           } 
        });
    });

  // Log when a user disconnects
    ws.on('close', () => {
    console.log('User disconnected');
  });
    
 ws.on('error', () => {
    console.log('WebSocket error:', err);
  });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
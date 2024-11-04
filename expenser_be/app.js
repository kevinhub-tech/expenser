const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const expenser = require('./routes/expenser');
const app = express();
const cors = require('cors');

dotenv.config();

const port = process.env.port || 3000;
const mongodbURL = process.env.mongodb_url;

mongoose.set('debug', true);  // Enables detailed logging

mongoose.connect(mongodbURL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true // Allow credentials (cookies)
}));

app.use(express.json());

app.use('/expense', expenser);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

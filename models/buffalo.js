// models/buffalo.js
const mongoose = require('mongoose');

const buffaloSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or local path to image
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Buffalo', buffaloSchema);
// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
   
    password: {
        type: String,
        required: true
    }
});

// Optional: add timestamps for createdAt/updatedAt
userSchema.set('timestamps', true);

module.exports = mongoose.model('User', userSchema);
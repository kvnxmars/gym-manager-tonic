//import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define User schema
const UserSchema = new Schema({
    studentNumber: { 
        type: String,
        required: true
    },
    checkInTime: {
        type: Date,
        default: Date.now   
    }
});
//Create and export CheckIn model
module.exports = mongoose.model('CheckIn', UserSchema);
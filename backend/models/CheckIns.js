const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true, 
    ref: 'Student' // Reference to Student schema
  },
  checkInTime: { 
    type: Date, 
    required: true 
  },
  checkOutTime: { 
    type: Date, 
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('CheckIn', checkInSchema);
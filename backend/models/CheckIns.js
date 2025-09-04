const mongoose = require('mongoose');

// CheckIn schema

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

module.exports = mongoose.models.CheckIn || mongoose.model('CheckIn', checkInSchema) // Create CheckIn model


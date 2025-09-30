const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId,  // use ObjectId instead of String
    ref: 'Student',
    required: true
  },
  checkInTime: { 
    type: Date, 
    default: Date.now,  // auto-fill when created
    required: true 
  },
  checkOutTime: { 
    type: Date, 
    default: null       // ✅ allow null until checkout
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.models.CheckIn || mongoose.model('CheckIn', checkInSchema);

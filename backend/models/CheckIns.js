// backend/models/CheckIns.js
const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  checkInTime: { 
    type: Date, 
    required: true 
  },
  checkOutTime: { 
    type: Date, 
    default: null // null means student still inside
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("CheckIn", checkInSchema);

//User schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //for password hashing

//database logic
// Helper regex for email and phone validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

// Student schema
const studentSchema = new mongoose.Schema({
  studentNumber: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 8
  },
  name: {
    first: { type: String, required: true, minlength: 2 },
    last: { type: String, required: true, minlength: 2 }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [emailRegex, 'Please enter a valid email address']
  },
  /*phone: { 
    type: String, 
    match: [phoneRegex, 'Please enter a valid phone number'],
    required: false
  },*/
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  /*membershipStatus: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },*/
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema); // Create Student model

;

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

module.exports = mongoose.model('CheckIn', checkInSchema); // Create CheckIn model


//User schema
const mongoose = require('mongoose');

//database logic
// Helper regex for email and phone validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

// Student schema
const studentSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 11
  },
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
  phone: { 
    type: String, 
    match: [phoneRegex, 'Please enter a valid phone number'],
    required: false
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  membershipStatus: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Admin schema
const adminSchema = new mongoose.Schema({
  adminId: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 5
  },
  name: {
    first: { 
      type: String, 
      required: true, 
      minlength: 2 
    },
    last: { 
      type: String, 
      required: true, 
      minlength: 2 
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [emailRegex, 'Please enter a valid email address']
  },
  phone: { 
    type: String, 
    match: [phoneRegex, 'Please enter a valid phone number'],
    required: false
  },
  password: { 
    type: String, 
    required: true,
    minlength: 5
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Student = mongoose.model('Student', studentSchema); // Create Student model
const Admin = mongoose.model('Admin', adminSchema); // Create Admin model

module.exports = { Student, Admin };
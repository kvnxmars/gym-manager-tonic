const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //for password hashing

//database logic
// Helper regex for email and phone validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

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
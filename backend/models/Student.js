// models/Student.js
const mongoose = require('mongoose');

// Helper regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Student schema
const studentSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: [true, 'Student number is required'],
        unique: true,
        maxlength: [8, 'Student number cannot exceed 8 characters'],
        trim: true
    },
    name: {
        first: { 
            type: String, 
            required: [true, 'First name is required'], 
            minlength: [2, 'First name must be at least 2 characters'],
            trim: true
        },
        last: { 
            type: String, 
            required: [true, 'Last name is required'], 
            minlength: [2, 'Last name must be at least 2 characters'],
            trim: true
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [emailRegex, 'Please enter a valid email address'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    membershipStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add indexes for better performance
studentSchema.index({ studentNumber: 1 });
studentSchema.index({ email: 1 });

// Check if model already exists before creating it
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
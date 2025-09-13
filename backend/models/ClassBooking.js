const mongoose = require('mongoose');

// Helper regex for class name validation (letters, numbers, spaces)
const classNameRegex = /^[A-Za-z0-9 ]{2,50}$/;

const ClassBookingSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
        minlength: [2, 'Class name must be at least 2 characters'],
        maxlength: [50, 'Class name cannot exceed 50 characters'],
        match: [classNameRegex, 'Class name can only contain letters, numbers, and spaces']
    },
    classTime: {
        type: Date,
        required: [true, 'Class time is required'],
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: 'Class time must be in the future'
        }
    },
     campus: {
        type: String,
        enum: {
            values: ['Potch', 'Vanderbijlpark', 'Mahikeng'],
            message: 'Campus must be Potch, Val, or Maf'
        },
        required: [true, 'Campus is required']
    },
    availability: {
        type: Boolean,
        required: true,
        default: false
    },
    spaceLeft: {
        type: Number,
        required: [true, 'Space left is required'],
        min: [0, 'Space left cannot be negative'],
        max: [50, 'Space left cannot exceed 100']
    }
});

module.exports = mongoose.models.ClassBooking || mongoose.model('ClassBooking', ClassBookingSchema);

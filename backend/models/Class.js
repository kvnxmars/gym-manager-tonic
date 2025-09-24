const mongoose = require('mongoose');

// Schema for a gym class and its details
const ClassSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required'],
        trim: true,
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    schedule: {
        type: String,
        required: [true, 'Schedule is required'],
        trim: true,
    },
    campus: {
        type: String,
        required: [true, 'Campus is required'],
        trim: true,
    },
    classTime: {
        type: String,
        required: [true, 'Class time is required'],
    },
    // Track the number of current bookings to enforce capacity limits
    bookedCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Class', ClassSchema);

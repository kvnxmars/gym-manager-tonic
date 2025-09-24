const mongoose = require('mongoose');

const ClassBookingSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    className: { 
        type: String, 
        required: true 
    },
    campus: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    instructor: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['booked', 'attended', 'cancelled'], 
        default: 'booked' 
    },
    bookedAt: { 
        type: Date, 
        default: Date.now 
    }
});


module.exports = mongoose.models.ClassBooking || mongoose.model('ClassBooking', ClassBookingSchema);

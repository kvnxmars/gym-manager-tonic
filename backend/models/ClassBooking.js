const mongoose = require('mongoose');

// Helper regex for class name validation (letters, numbers, spaces)
const classNameRegex = /^[A-Za-z0-9 ]{2,50}$/;

const mongoose = require('mongoose');

const classBookingSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
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

module.exports = mongoose.model('ClassBooking', classBookingSchema);
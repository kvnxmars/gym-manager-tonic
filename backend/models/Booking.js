const mongoose = require('mongoose');

//booking schema
const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    //student reference
    student: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        studentNumber: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            first: {
                type: String,
                required: true,
                trim: true
            },
        }
        },

        //class reference
        class: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
                required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        instructor: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },
        duration:{
            type: Number, //duration in minutes
            required: true,
            min: 1
        },
    // campus removed — location is taken from class/location fields if needed

    },
    //booking details
    booking: {
        status: {
            type: String,
            enum: ['booked', 'waitlisted', 'cancelled', 'completed', 'no-show'],
            default: 'booked',
        },
        bookedAt: { 
            type: Date, 
            default: Date.now
        },
        confirmedAt: {
            type: Date,

        },
        source: {
            type: String,
            enum: ['app', 'website', 'in-person', 'phone'],
            default: 'app'
        },

        addedAt: {
            type: Date,
            default: Date.now
        }

        
    },
    cancellation: {
        cancelledAt: {
            type: Date,
            default: null
        },
        
    },

    // Attendance Tracking
    attendance: {
      checkedIn: {
        type: Boolean,
        default: false,
      },
      checkedInAt: {
        type: Date,
        default: null,
      },
      checkedInBy: {
        type: String,
        enum: ["user", "instructor", "front_desk", null],
        default: null,
      },
      late: {
        type: Boolean,
        default: false,
      },
      minutesLate: {
        type: Number,
        default: 0,
        min: 0,
      },
      leftEarly: {
        type: Boolean,
        default: false,
      },
      leftEarlyAt: {
        type: Date,
        default: null,
      }
    },

    // User Experience
    feedback: {
      rating: {
        type: Number,
        default: null,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
        default: null,
        trim: true,
      },
      instructorRating: {
        type: Number,
        default: null,
        min: 1,
        max: 5,
      },
      facilityRating: {
        type: Number,
        default: null,
        min: 1,
        max: 5,
      },
      submittedAt: {
        type: Date,
        default: null,
      }
    },

    // Booking Modifications
    modifications: [
      {
        type: {
          type: String,
          required: true,
          enum: ["date_change", "cancellation", "waitlist_promotion"],
        },
        fromDate: {
          type: Date,
          default: null,
        },
        toDate: {
          type: Date,
          default: null,
        },
        modifiedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        modifiedBy: {
          type: String,
          required: true,
          enum: ["student", "staff", "system"],
        },
        reason: {
          type: String,
          default: null,
          trim: true,
        }
      }
    ],

    // System Fields
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    }
}, { // Enable automatic createdAt and updatedAt fields
    timestamps: true,
    // Enforce strict schema to throw errors for unknown fields
    strict: "throw"
});

// Define indexes
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ "student.studentNumber": 1 });
bookingSchema.index({ "class.id": 1, "class.date": 1 });
bookingSchema.index({ "booking.status": 1 });
bookingSchema.index({ "class.date": 1, "booking.status": 1 });
bookingSchema.index({ createdAt: -1 });

// Middleware to update `updatedAt` on save
bookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the model
module.exports = mongoose.model("Booking", bookingSchema);
        

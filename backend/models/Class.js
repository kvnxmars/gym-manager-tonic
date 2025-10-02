const mongoose = require('mongoose');
//const { campusData }  = require('../data/campusData');


//extract campus names/ID for validation
//const validCampusIds = campusData.campuses.map(campus => campus.id); 

//class schema
const classSchema = new mongoose.Schema({
    // Unique identifier for the class
    classId: {
        type: String,
        maxLength: 8,
        unique: true,
        required: true
    },
    // Name of the class
    name: {
        type: String,
        required: true
    },
    // Description of the class
    description: {
        type: String,
        default: ''
    },

    date: {
        type: Date,
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    //campus: {
        //type: String,
        //required:true,
        //enum: validCampusIds
    //},

    //class classification
    category: {
        primary: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            required: true
        },
        intensity: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            required: true
        }

    },

    //instructor details
    instructor: {
        name: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            default: ''
        },
        specialty: {
            type: String,
            enum: ['Yoga', 'Pilates', 'Cardio', 'Strength Training', 'Dance', 'HIIT', 'Cycling', 'Other'],
            default: 'Other'
        },
        
        photo: {
            type: String,
            default: ''
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: null
        },

        totalRatings: {
            type: Number,
            default: 0
        }
    },

    // CRITICAL: Add the bookedStudents field for population
    
bookedStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' // This tells Mongoose to look up in the 'Student' collection
}],

// Helper fields to track current booking status (as seen in your controller logic)
booked: { 
    type: Number, 
    default: 0 
},
spaceLeft: { 
    type: Number, 
    default: 0 
},
status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
},


    //schedule details
    schedule: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        }],
        type: {
            type: String,
            enum: ['In-Person', 'Virtual', 'Hybrid'],
            required: true
        },
        frequency: {
            type: String,
            enum: ['Once', 'Weekly', 'Bi-Weekly', 'Monthly'],
            required: true
        },
        time: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //in minutes
            required: true
        }
    }


    
    });
    // Add a pre-save hook to automatically update booked/spaceLeft counts
    /*
classSchema.pre('save', function(next) {
    // Ensure bookedStudents is an array before checking length
    const bookedCount = Array.isArray(this.bookedStudents) ? this.bookedStudents.length : 0;
    
    // Update the 'booked' and 'spaceLeft' properties
    this.booked = bookedCount;
    this.spaceLeft = this.capacity - bookedCount;
    
    next();
    
});
*/
    

    


    module.exports = mongoose.models.Class || mongoose.model('Class', classSchema); // Create Class model
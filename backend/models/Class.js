const mongoose = require('mongoose');
const { campusData }  = require('../data/campusData');


//extract campus names/ID for validation
const validCampusIds = campusData.campuses.map(campus => campus.id); 

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

    campus: {
        type: String,
        required:true,
        enum: validCampusIds
    },

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

    module.exports = mongoose.models.Class || mongoose.model('Class', classSchema); // Create Class model
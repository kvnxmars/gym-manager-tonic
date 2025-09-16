const mongoose = require('mongoose');
const { create, updateMany } = require('./Student');

// WorkoutTemplate schema
// Represents a workout template containing multiple exercises
const WorkoutTemplateSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    exercises: 
        [exerciseSchema],
    createdAt: 
    { 
        type: Date, default: Date.now 
    },
    updateAt: 
    { 
        type: Date, 
        default: Date.now 
    
    }
});

module.exports = mongoose.model('WorkoutTemplate', workoutTemplateSchema);
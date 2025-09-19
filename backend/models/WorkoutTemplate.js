const mongoose = require('mongoose');
// Make sure this is the schema, not the model!
const exerciseSchema = require('./Exercise'); // Should export a schema

// WorkoutTemplate schema
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
    exercises: [exerciseSchema], // This must be a schema, not a model
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updateAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Fix export name to match schema variable
module.exports = mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);
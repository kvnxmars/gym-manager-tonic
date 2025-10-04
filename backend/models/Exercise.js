const mongoose = require('mongoose');


//set subschema
const setSchema = new mongoose.Schema({
    setId: {
        type: String,
        unique: true
    },
    weight: {
        type: Number,
        default: 0
    },
    reps: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    restTime: {
        type: Number,
        required: false,
        default: 0
    }

});
// Exercise subdocument schema
// Represents a single exercise within a workout
const ExerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: String,
        //required: true,
        //unique: true, 
        trim: true
    },
    exerciseName: {
        type: String,
        required: [true, 'Exercise name is required'],
        trim: true,
        minlength: [2, 'Exercise name must be at least 2 characters'],
        maxlength: [50, 'Exercise name cannot exceed 50 characters']
    },

    description: {
        type: String,
        required: false,
        trim: true,
        maxLength: 1000
    },

    instructions: {
    type: [String],
    required: true,
    trim: true
  },
    sets: [setSchema],
    noSets: {
        type: Number
    }
});
module.exports = ExerciseSchema;
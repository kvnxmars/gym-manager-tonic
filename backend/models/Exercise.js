const mongoose = require('mongoose');

// Exercise subdocument schema
// Represents a single exercise within a workout
const ExerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: [true, 'Exercise name is required'],
        trim: true,
        minlength: [2, 'Exercise name must be at least 2 characters'],
        maxlength: [50, 'Exercise name cannot exceed 50 characters']
    },
    muscleGroup: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Muscle group must be at least 2 characters'],
        maxlength: [50, 'Muscle group cannot exceed 50 characters']
    },
    set: {
        type: Number,
        required: [true, 'Set number is required'],
        min: [1, 'Set must be at least 1']
    },
    weight: {
        previous: {
            type: Number,
            min: [0, 'Previous weight cannot be negative'],
            default: 0
        },
         current: {
            type: Number,
            min: [0, 'Current weight cannot be negative'],
            default: 0
        }
    },
    reps: {
        type: Number,
        required: [true, 'Reps are required'],
        min: [1, 'Reps must be at least 1']
    }
});
   module.exports = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
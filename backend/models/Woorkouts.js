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

// Workout schema
// Represents a workout session containing multiple exercises
const WorkoutSchema = new mongoose.Schema({
    workoutType: {
        type: String,
        required: [true, 'Workout type is required'],
        trim: true,
        minlength: [2, 'Workout type must be at least 2 characters'],
        maxlength: [50, 'Workout type cannot exceed 50 characters']
    },
    sets: {
        type: Number,
        required: [true, 'Number of sets is required'],
        min: [1, 'Sets must be at least 1']
    },
    muscleGroup: {
        type: String,
        required: [true, 'Muscle group is required'],
        trim: true,
        minlength: [2, 'Muscle group must be at least 2 characters'],
        maxlength: [50, 'Muscle group cannot exceed 50 characters']
    },
    exercises: {
        type: [ExerciseSchema], // Array of exercise subdocuments
        validate: [arr => arr.length > 0, 'At least one exercise is required']
    }
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
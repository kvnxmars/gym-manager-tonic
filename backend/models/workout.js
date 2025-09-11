const mongoose = require('mongoose');
const { ExerciseSchema } = require('./Exercise'); //import Exercise schema


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
     WorkoutName: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true,
        minlength: [2, 'Workout name must be at least 2 characters'],
        maxlength: [50, 'Workout name cannot exceed 50 characters']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    exercises: {
        type: [ExerciseSchema], // Array of exercise subdocuments
        validate: [arr => arr.length > 0, 'At least one exercise is required']
    }
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
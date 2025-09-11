const mongoose = require('mongoose');


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
     WorkouteName: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true,
        minlength: [2, 'Workout name must be at least 2 characters'],
        maxlength: [50, 'Workout name cannot exceed 50 characters']
    },
    sets: {
        type: Number,
        required: [true, 'Number of sets is required'],
        min: [1, 'Sets must be at least 1']
    },
    
    exercises: {
        type: [ExerciseSchema], // Array of exercise subdocuments
        validate: [arr => arr.length > 0, 'At least one exercise is required']
    }
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
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

    description: {
        type: String,
        required: false,
        trim: true,
        maxLength: 1000
    },

    instructions: [{
    type: String,
    required: true,
    trim: true
  }],

    sets: {
        type: Number,
        required: [true, 'Set number is required'],
        min: [1, 'Set must be at least 1']
    },

    reps: {
        type: Number,
        required: [true, 'Reps are required'],
        min: [1, 'Reps must be at least 1']
    },

    weight: {
        previous: {
            type: Number,
            min: [0, 'Previous weight cannot be negative'],
            default: 0
        },

        duration: {
            type: Number,
            required: false,
            min: 0
        },

        distance: {
            type: Number, //in km or meters
            required: false,
            min: 0
        },
        
        restTime: {
            type: Number, //in seconds
            required: false,
            min: 0
        },

        primaryMuscleGroups: [{
            type: String,
            required: true,
            enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body']
        }],
        secondaryMuscleGroups: [{
        type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'glutes', 'quadriceps', 'hamstrings', 'calves']
    }],
    equipment: [{
        type: String,
        enum: ['barbell', 'dumbbell', 'kettlebell', 'resistance-band', 'cable-machine', 'bodyweight', 'bench', 'pull-up-bar', 'treadmill', 'bike', 'rowing-machine', 'smith-machine', 'leg-press', 'lat-pulldown', 'none']
  }],
    
    
    notes: {
        type: String,
        required: false,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 200 characters']
    },
    
    exerciseType: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'plyometric'],
    default: 'strength'
  }

            
    }
    
    
});
   module.exports = ExerciseSchema;
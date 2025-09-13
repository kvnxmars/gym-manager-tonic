const mongoose = require('mongoose');
const { ExerciseSchema } = require('./Exercise'); //import Exercise schema


// Workout schema
// Represents a workout session containing multiple exercises
const WorkoutSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    WorkoutName: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true,
        minlength: [2, 'Workout name must be at least 2 characters'],
        maxlength: [50, 'Workout name cannot exceed 50 characters']
    },

    description: {
        type: String,
        trim: true,
        maxLength: 500
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    exercises: {
        type: [ExerciseSchema], // Array of exercise subdocuments
        validate: [arr => arr.length > 0, 'At least one exercise is required']
    },

    isTemplate: {
        type: Boolean,
        default: true // True if it's a workout template, false if it's a completed workout
    },

    actualDuration: {
        type: Number, //in minutes
        required: false,
        min: 0
    },

    // Workout categorization
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'mixed', 'bodybuilding', 'powerlifting', 'crossfit'],
    default: 'mixed'
  },
  targetMuscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body']
  }],
  
  // Completion tracking (for when template is used)
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Rating and feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Tags for easy searching
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Estimated time for template
  estimatedDuration: {
    type: Number, // in minutes
    default: 45
},

},
 {
  timestamps: true
});


module.exports = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
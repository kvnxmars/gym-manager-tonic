const mongoose = require('mongoose');

const completeSetSchema = new mongoose.Schema ({
    reps: 
    {
        type: Number,
        required: true
    },

    weight: 
    {
        type: Number,
        default: null
    },

    completedAt: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String,
        default: ''
    }
});

const exerciseSessionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  targetSets: { 
    type: Number, 
    required: true 
},
  targetReps: { 
    type: Number, 
    required: true 
},
  targetWeight: { 
    type: Number, 
    default: null 
},
  restTime: { 
    type: Number, 
    default: 60 
},
  notes: { 
    type: String, 
    default: '' 
},
  completedSets: [completeSetSchema]
});

const workoutSessionSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
},
  templateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WorkoutTemplate', 
    default: null 
},
  workoutName: { 
    type: String, 
    required: true 
},
  exercises: [exerciseSessionSchema],
  startTime: { 
    type: Date, 
    required: true 
},
  endTime: { 
    type: Date, 
    default: null 
},
  duration: { 
    type: Number, 
    default: null 
}, // in minutes
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
},
  notes: { 
    type: String, 
    default: '' 
}
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
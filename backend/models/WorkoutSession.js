const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExerciseSchema = require('./Exercise');


// Define the WorkoutSession schema
const workoutSessionSchema = new Schema(
  {
    // Session Information
    
    sessionId: {
      type: String,//Schema.Types.ObjectId,
      //ref: "Student",
      //required: true,
      description: "Reference to the user who performed the workout",
    },
    studentNumber: {
      type: String,
      required: true,
      trim: true,
      description: "Denormalized for quick user identification",
    },
    templateId: {
      type: String,
      ref: "WorkoutTemplate",
      default: null,
      description: "Reference to workout_templates, null for ad-hoc workouts",
    },
    templateName: {
      type: String,
      trim: true,
      description: "Denormalized for UI display and historical accuracy",
    },

    // Session Timing
    timing: {
      startedAt: {
        type: Date,
        required: true,
        description: "When the workout started",
      },
      finishedAt: {
        type: Date,
        description: "When the workout ended",
      },
      duration: {
        type: Number,
        min: 0,
        description: "Calculated duration in minutes",
      },
      pausedTime: {
        type: Number,
        default: 0,
        min: 0,
        description: "Total minutes paused",
      },
      activeTime: {
        type: Number,
        min: 0,
        description: "Actual workout time in minutes",
      },
    },

    // Session Status
    status: {
      type: String,
      required: true,
      enum: ["in_progress", "paused", "completed", "abandoned"],
      default: "in_progress",
      description: "Current status of the workout session",
    },

    // Workout Data
    exercises: [ExerciseSchema],
        notes: {
          type: String,
          trim: true,
          description: "User notes for the exercise",
        },
        personalRecord: {
          isNewPR: {
            type: Boolean,
            default: false,
            description: "Whether a new personal record was set",
          },
          previousBest: {
            type: String,
            description: "Previous best performance (e.g., 135x8)",
          },
          currentBest: {
            type: String,
            description: "Current best performance (e.g., 135x10)",
          },
        },
      
  

    // Session Summary
    summary: {
      totalSets: {
        type: Number,
        min: 0,
        description: "Total sets in the session",
      },
      completedSets: {
        type: Number,
        min: 0,
        description: "Number of completed sets",
      },
      skippedSets: {
        type: Number,
        min: 0,
        description: "Number of skipped sets",
      },
      totalVolume: {
        type: Number,
        min: 0,
        description: "Total weight x reps",
      },
      totalExercises: {
        type: Number,
        min: 0,
        description: "Total different exercises performed",
      },
      muscleGroupsWorked: {
        type: [String],
        description: "Muscle groups targeted in the session",
      },
    },

    // Session Location and Environment
    location: {
      campus: {
        type: String,
        trim: true,
        description: "Campus where the workout took place",
      }
    },

    // User Notes and Ratings
    userFeedback: {
      overallRating: {
        type: Number,
        min: 1,
        max: 5,
        description: "User rating for the session (1-5)",
      },
      difficultyRating: {
        type: Number,
        min: 1,
        max: 5,
        description: "Perceived difficulty (1-5)",
      },
      notes: {
        type: String,
        trim: true,
        description: "User notes for the session",
      },
      mood: {
        type: String,
        enum: ["poor", "ok", "good", "excellent"],
        description: "User's mood post-workout",
      },
    },

    // System Fields
    createdAt: {
      type: Date,
      //required: true,
      default: Date.now,
      description: "When the session was created",
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
      description: "When the session was last updated",
    },
  },
  {
    timestamps: true,
    strict: "throw",
    description: "Schema for workout sessions with hybrid denormalization",
  }
);

// Define indexes
//workoutSessionSchema.index({ userId: 1, "timing.startedAt": -1 });
workoutSessionSchema.index({ studentNumber: 1 });
workoutSessionSchema.index({ templateId: 1 });
workoutSessionSchema.index({ status: 1 });
workoutSessionSchema.index({ "timing.startedAt": -1 });

// Middleware to update updatedAt
workoutSessionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the model
module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  exercise: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number },
  duration: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workout", workoutSchema);

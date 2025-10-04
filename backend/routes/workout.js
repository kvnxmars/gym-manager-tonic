const express = require("express");
const router = express.Router();
const Workout = require("../models/WorkoutSession");
const workoutController = require("../controllers/workoutController");

// POST /api/workouts → log a workout

router.post("/", async (req, res) => {
  try {
    const workout = new Workout(req.body);
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//router.post("/", workoutController.saveSession);

// GET /api/workouts/:userId → get all workouts for a student
router.get("/:studentNumber", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define a GET route for fetching workout statistics for a specific student
router.get('/stats/:studentNumber', workoutController.getWorkoutStats);

router.get("/:studentNumber", workoutController.getPastSessions);

module.exports = router;

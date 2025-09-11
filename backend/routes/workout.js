const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

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


// GET /api/workouts/:studentNumber → get all workouts for a student
router.get("/:studentNumber", async (req, res) => {
  try {
    const workouts = await Workout.find({ studentNumber: req.params.studentNumber }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

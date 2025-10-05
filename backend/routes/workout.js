const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

// POST /api/workouts → log a workout


router.post("/", workoutController.saveSession);

//router.post("/", workoutController.saveSession);

// GET /api/workouts/:userId → get all workouts for a student
router.get("/:studentNumber", workoutController.getPastSessions);

// Define a GET route for fetching workout statistics for a specific student
router.get('/stats/:studentNumber', workoutController.getWorkoutStats);



module.exports = router;

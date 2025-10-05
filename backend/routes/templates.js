const express = require("express");
const router = express.Router();
const WorkoutTemplate = require("../models/WorkoutTemplate");
const exerciseSchema = require("../models/Exercise");const workoutController = require("../controllers/workoutController");
;


// =========================
// 🔹 CREATE
// =========================


router.post("/create", workoutController.createTemplate);

// POST /api/workout-templates/:id/exercises → add a new exercise
router.post("/:templateId/exercises", workoutController.addExercise);


// POST /api/workout-templates/:id/exercises/:exerciseId/sets → add a set
router.post("/:templateId/:exerciseId/sets", workoutController.addSet);


// =========================
// 🔹 READ
// =========================

// GET /api/workout-templates/:studentNumber → get all templates for a student
router.get("/:studentNumber", workoutController.getAllTemplates);

//default templates
router.get("/default", workoutController.getDefaultTemplates);




// =========================
// 🔹 UPDATE
// =========================

// PUT /api/workout-templates/:id → update template info (e.g., name)
router.put("/:templateId", workoutController.updateTemplate);

// PUT /api/workout-templates/:id/exercises/:exerciseId → update exercise
router.put("/:templateId/:exerciseId", workoutController.updateExercise);


// PUT /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → update a set
router.put("/:templateId/:exerciseId/:setIndex", workoutController.updateSet);


// =========================
// 🔹 DELETE
// =========================

// DELETE /api/workout-templates/:id → delete template
router.delete("/:studentNumber/:templateId", workoutController.deleteTemplate);

// DELETE /api/workout-templates/:id/exercises/:exerciseId → delete exercise
router.delete("/:studentId/:studentNumber/:exerciseId", workoutController.deleteExercise);

// DELETE /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → delete a set
router.delete("/:templateId/:exerciseId/:setIndex", workoutController.deleteSet);
module.exports = router;

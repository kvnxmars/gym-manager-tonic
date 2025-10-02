const express = require("express");
const router = express.Router();
const WorkoutTemplate = require("../models/WorkoutTemplate");
const exerciseSchema = require("../models/Exercise");const workoutController = require("../controllers/workoutController");
;


// =========================
// 🔹 CREATE
// =========================

// POST /api/workout-templates → create a new template
/*
router.post("/create", async (req, res) => {
  try {
    const template = new WorkoutTemplate(req.body);
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});*/
router.post("/create", workoutController.createTemplate);

// POST /api/workout-templates/:id/exercises → add a new exercise
router.post("/:exercises", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    template.exercises.push(req.body);
    template.updatedAt = new Date();
    await template.save();

    res.status(201).json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/workout-templates/:id/exercises/:exerciseId/sets → add a set
router.post("/:exercises/:sets", workoutController.addSet);


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
router.delete("/:templateId", workoutController.deleteTemplate);

// DELETE /api/workout-templates/:id/exercises/:exerciseId → delete exercise
router.delete("/:exerciseId/:exerciseId", workoutController.deleteExercise);

// DELETE /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → delete a set
router.delete("/:templateId/:exerciseId/:setIndex", workoutController.deleteSet);
module.exports = router;

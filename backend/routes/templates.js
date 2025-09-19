const express = require("express");
const router = express.Router();
const WorkoutTemplate = require("../models/WorkoutTemplate");
const exerciseSchema = require("../models/Exercise");;


// =========================
// 🔹 CREATE
// =========================

// POST /api/workout-templates → create a new template
router.post("/create", async (req, res) => {
  try {
    const template = new WorkoutTemplate(req.body);
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
router.post("/:exercises/:sets", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const exercise = template.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    exercise.sets.push(req.body);
    template.updatedAt = new Date();
    await template.save();

    res.status(201).json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =========================
// 🔹 READ
// =========================

// GET /api/workout-templates/:studentNumber → get all templates for a student
router.get("/:studentNumber", async (req, res) => {
  try {
    const templates = await WorkoutTemplate.find({
      studentNumber: req.params.studentNumber,
    }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// 🔹 UPDATE
// =========================

// PUT /api/workout-templates/:id → update template info (e.g., name)
router.put("/:id", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!template) return res.status(404).json({ error: "Template not found" });

    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/workout-templates/:id/exercises/:exerciseId → update exercise
router.put("/:id/exercises/:exerciseId", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const exercise = template.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    exercise.set(req.body); // overwrite with new data
    template.updatedAt = new Date();
    await template.save();

    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → update a set
router.put("/:id/exercises/:exerciseId/sets/:setIndex", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const exercise = template.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const setIndex = req.params.setIndex;
    if (setIndex < 0 || setIndex >= exercise.sets.length) {
      return res.status(404).json({ error: "Set not found" });
    }

    exercise.sets[setIndex] = req.body;
    template.updatedAt = new Date();
    await template.save();

    res.json(exercise.sets[setIndex]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =========================
// 🔹 DELETE
// =========================

// DELETE /api/workout-templates/:id → delete template
router.delete("/:id", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/workout-templates/:id/exercises/:exerciseId → delete exercise
router.delete("/:id/exercises/:exerciseId", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const exercise = template.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    exercise.remove();
    template.updatedAt = new Date();
    await template.save();

    res.json({ message: "Exercise deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → delete a set
router.delete("/:id/exercises/:exerciseId/sets/:setIndex", async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const exercise = template.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const setIndex = req.params.setIndex;
    if (setIndex < 0 || setIndex >= exercise.sets.length) {
      return res.status(404).json({ error: "Set not found" });
    }

    exercise.sets.splice(setIndex, 1);
    template.updatedAt = new Date();
    await template.save();

    res.json({ message: "Set deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

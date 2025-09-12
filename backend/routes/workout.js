const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// Input validation middleware
const validateWorkoutData = (req, res, next) => {
  const { studentNumber, name } = req.body;
  
  if (!studentNumber || !name) {
    return res.status(400).json({ 
      error: "Student number and workout name are required" 
    });
  }
  
  if (typeof studentNumber !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ 
      error: "Student number and name must be strings" 
    });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ 
      error: "Workout name must be at least 2 characters long" 
    });
  }
  
  next();
};

// POST /api/workouts → create a new workout (completed workout log)
router.post("/", validateWorkoutData, async (req, res) => {
  try {
    const workoutData = {
      ...req.body,
      date: req.body.date || new Date(),
      isTemplate: false // This is a completed workout
    };
    
    const workout = new Workout(workoutData);
    const savedWorkout = await workout.save();
    
    res.status(201).json({
      message: "Workout logged successfully",
      workout: savedWorkout
    });
  } catch (err) {
    console.error("Error logging workout:", err);
    res.status(400).json({ 
      error: "Failed to log workout",
      details: err.message 
    });
  }
});

// POST /api/workouts/template → create a workout template
router.post("/template", validateWorkoutData, async (req, res) => {
  try {
    // Check if template with same name already exists for this student
    const existingTemplate = await Workout.findOne({
      studentNumber: req.body.studentNumber,
      name: req.body.name,
      isTemplate: true
    });
    
    if (existingTemplate) {
      return res.status(409).json({ 
        error: "A template with this name already exists" 
      });
    }
    
    const templateData = {
      ...req.body,
      isTemplate: true,
      createdAt: new Date()
    };
    
    const template = new Workout(templateData);
    const savedTemplate = await template.save();
    
    res.status(201).json({
      message: "Workout template created successfully",
      template: savedTemplate
    });
  } catch (err) {
    console.error("Error creating template:", err);
    res.status(400).json({ 
      error: "Failed to create workout template",
      details: err.message 
    });
  }
});

// GET /api/workouts/templates/:studentNumber → get all templates for a student
router.get("/templates/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    
    if (!studentNumber) {
      return res.status(400).json({ error: "Student number is required" });
    }
    
    const templates = await Workout.find({ 
      studentNumber, 
      isTemplate: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      message: "Templates retrieved successfully",
      count: templates.length,
      templates
    });
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ 
      error: "Failed to fetch workout templates",
      details: err.message 
    });
  }
});

// GET /api/workouts/:studentNumber → get all completed workouts for a student
router.get("/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    if (!studentNumber) {
      return res.status(400).json({ error: "Student number is required" });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const workouts = await Workout.find({ 
      studentNumber,
      isTemplate: { $ne: true } // Exclude templates
    })
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .skip(skip);
    
    const totalWorkouts = await Workout.countDocuments({ 
      studentNumber,
      isTemplate: { $ne: true }
    });
    
    res.json({
      message: "Workouts retrieved successfully",
      count: workouts.length,
      total: totalWorkouts,
      page: parseInt(page),
      totalPages: Math.ceil(totalWorkouts / parseInt(limit)),
      workouts
    });
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ 
      error: "Failed to fetch workouts",
      details: err.message 
    });
  }
});

// GET /api/workouts/template/:id → get a specific template by ID
router.get("/template/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Workout.findOne({ 
      _id: id, 
      isTemplate: true 
    });
    
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json({
      message: "Template retrieved successfully",
      template
    });
  } catch (err) {
    console.error("Error fetching template:", err);
    res.status(500).json({ 
      error: "Failed to fetch template",
      details: err.message 
    });
  }
});

// PUT /api/workouts/template/:id → update a workout template
router.put("/template/:id", validateWorkoutData, async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedTemplate = await Workout.findOneAndUpdate(
      { _id: id, isTemplate: true },
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json({
      message: "Template updated successfully",
      template: updatedTemplate
    });
  } catch (err) {
    console.error("Error updating template:", err);
    res.status(400).json({ 
      error: "Failed to update template",
      details: err.message 
    });
  }
});

// DELETE /api/workouts/template/:id → delete a workout template
router.delete("/template/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTemplate = await Workout.findOneAndDelete({ 
      _id: id, 
      isTemplate: true 
    });
    
    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json({
      message: "Template deleted successfully",
      template: deletedTemplate
    });
  } catch (err) {
    console.error("Error deleting template:", err);
    res.status(500).json({ 
      error: "Failed to delete template",
      details: err.message 
    });
  }
});

// GET /api/workouts/stats/:studentNumber → get workout statistics
router.get("/stats/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    
    const totalWorkouts = await Workout.countDocuments({ 
      studentNumber,
      isTemplate: { $ne: true }
    });
    
    const totalTemplates = await Workout.countDocuments({ 
      studentNumber,
      isTemplate: true
    });
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weeklyWorkouts = await Workout.countDocuments({
      studentNumber,
      isTemplate: { $ne: true },
      date: { $gte: thisWeek }
    });
    
    res.json({
      message: "Statistics retrieved successfully",
      stats: {
        totalWorkouts,
        totalTemplates,
        weeklyWorkouts
      }
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ 
      error: "Failed to fetch statistics",
      details: err.message 
    });
  }
});

module.exports = router;
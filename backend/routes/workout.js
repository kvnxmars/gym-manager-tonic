// Create workout template
app.post("/api/workouts", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Workout name required" });
    }

    const workout = new WorkoutTemplate({
      student: req.user.id, // comes from JWT
      name,
      exercises: [],
    });

    await workout.save();
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all workouts for the logged-in student
app.get("/api/workouts", authMiddleware, async (req, res) => {
  try {
    const workouts = await WorkoutTemplate.find({ student: req.user.id });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

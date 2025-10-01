const Workout = require('../models/WorkoutSession'); // Assuming you have this model
const Template = require('../models/WorkoutTemplate'); // Assuming you have this model

class workoutController {

    //======================================================//
    //===================SESSION ROUTES====================//
    //=====================================================//

    //POST -> save a session
    static async saveSession (req, res) {
        try {
            const session = new Workout(req.body);
            const savedSession = await session.save();
            res.status(201).json(savedSession);
        }catch (err) {
            console.error("Error saving workout session: ", err);
            res.status(400).json({ error: err.message });

        }

    }

    //PUT -> edit an exisiting workout session
    //corresponds to :  PUT /api/workouts/:id
    static async editSession (req, res) {
        try {
            const { sessionId } = req.params;
            const updatedSession = await Workout.findOneAndUpdate(
                sessionId,
                { 
                    ...req.body, 
                    updatedAt: new Date() 
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedSession) {
                return res.status(404).json({ error: "Workout session not found."});
            }
            res.json(updatedSession);
        }catch (err) {
            console.error("Error editing workout session: ", err);
            res.status(400).json({ error: err.message});
        }
    }

    //=============================================================//
    //========================TEMPLATE ROUTES======================//
    //=============================================================//

    // POST /api/workout-templates → create a new template
    static async createTemplate (req, res) {
        try {
            const template = new Template(req.body);
            const savedTemplate = await template.save();
            res.status(201).json(savedTemplate);
        } catch (err) {
            console.error("Eror creating workout template: ", err);
            res.status(400).json({ error: err.message });
        }
    }

    // POST /api/workout-templates/:id/exercises → add a new exercise
    static async addExercise (req, res) {
        try {
            const { exerciseId } = req.params;
            const template = await Template.findOne(exerciseId);
            if (!template) 
                return res.status(404).json({ error: "Template not found:"});

            template.exercises.push(req.body);
            template.updatedAt = new Date();
            await template.save();

            res.status(201).json(template);
        }catch (err) {
            console.error("Error adding exercises to template: ", err);
            res.status(400).json({ error: err.message});
        }

    }

    //POST /api/workout-templates/:id/exercises/:exerciseId/sets → add a set
    static async addSet (req, res) {
        try {
            const { setId, exerciseId } = req.params;
            const template = await Template.findOne(setId);
            if (!template) return res.status(404).json({ error: "Template not found" });

            const exercise = template.exercises.id(exerciseId);
            if (!exercise) return res.status(404).json({ error: "Exercise not found" });

            exercise.sets.push(req.body);
            template.updatedAt = new Date();
            await template.save();

            res.status(201).json(exercise);
        } catch (err) {
            console.error("Error adding set to exercise:", err);
            res.status(400).json({ error: err.message });
        }

    }

    // =========================
    // 🔹 READ TEMPLATES
    // =========================

    // GET /api/workout-templates/:studentNumber → get all templates for a student
    static async getAllTemplates (req, res) {
        try {
            const { studentNumber } = req.params;
            const templates = await Template.find({
                studentNumber: studentNumber,
            }).sort({ createdAt: -1 });
            res.json(templates);
        } catch (err) {
            console.error("Error fetching all templates:", err);
            res.status(500).json({ error: err.message });
        }

    }

    //GET -> get default templates
    static async getDefaultTemplates(req, res) {
        try {
            // Fetch templates explicitly marked as default system templates
            const templates = await Template.find({ isDefault: true }).sort({ name: 1 });
            
            // Return templates (could be an empty array if none are found)
            res.status(200).json(templates);
        } catch (err) {
            console.error("Error fetching default templates:", err);
            res.status(500).json({ error: err.message });
        }
    }

    // =========================
    // 🔹 UPDATE TEMPLATES
    // =========================

    // PUT /api/workout-templates/:id → update template info (e.g., name)
    static async updateTemplate(req, res) {
       try {
            const { templateId } = req.params;
            const template = await Template.findOneAndUpdate(
                templateId,
                { ...req.body, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
            if (!template) return res.status(404).json({ error: "Template not found" });

            res.json(template);
        } catch (err) {
            console.error("Error updating template:", err);
            res.status(400).json({ error: err.message });
        } 
    }

    // PUT /api/workout/:id/exercises/:exerciseId → update exercise 
    static async updateExercise (req, res) {
        try {
            const { id, exerciseId } = req.params;
            const template = await Template.findById(id);
            if (!template) return res.status(404).json({ error: "Template not found" });

            const exercise = template.exercises.id(exerciseId);
            if (!exercise) return res.status(404).json({ error: "Exercise not found" });

            // Overwrite the exercise subdocument with new data
            exercise.set(req.body); 
            template.updatedAt = new Date();
            await template.save();

            res.json(exercise);
        } catch (err) {
            console.error("Error updating exercise in template:", err);
            res.status(400).json({ error: err.message });
        }
    }
    
    // PUT /api/workout-templates/:id/exercises/:exerciseId/sets/:setIndex → update a set
    static async updateSet (req, res) {
         try {
            const { id, exerciseId, setIndex } = req.params;
            const template = await Template.findById(id);
            if (!template) return res.status(404).json({ error: "Template not found" });

            const exercise = template.exercises.id(exerciseId);
            if (!exercise) return res.status(404).json({ error: "Exercise not found" });

            const index = parseInt(setIndex, 10);
            if (isNaN(index) || index < 0 || index >= exercise.sets.length) {
                return res.status(404).json({ error: "Set not found" });
            }

            exercise.sets[index] = req.body;
            template.updatedAt = new Date();
            await template.save();

            res.json(exercise.sets[index]);
        } catch (err) {
            console.error("Error updating set in exercise:", err);
            res.status(400).json({ error: err.message });
        }
    }

     // =========================
    // 🔹 DELETE TEMPLATES
    // =========================

    static async deleteTemplate(req, res) {
        try {
            const { templateId } = req.params;
            const template = await Template.findOneAndDelete(templateId);

            if (!template)
                return res.status(404).json({ error: "Template not found."});

            res.json({
                message: "Template deleted"
            });
        }catch (err)
        {
            console.error("Error deleting template: ", err);
            res.status(500).json({
                error: err.message
            });
        }

    }

    static async deleteExercise(req, res) {
        try {
            const { templateId, exerciseId } = req.params;
            const template = await Template.findOne(templateId);
            if (!template) return res.status(404).json({ error: "Template not found" });

            const exercise = template.exercises.id(exerciseId);
            if (!exercise) return res.status(404).json({ error: "Exercise not found" });

            exercise.remove(); // Mongoose subdocument removal
            template.updatedAt = new Date();
            await template.save();

            res.json({ message: "Exercise deleted" });
        } catch (err) {
            console.error("Error deleting exercise from template:", err);
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteSet(req, res) {
        try {
            const { id, exerciseId, setIndex } = req.params;
            const template = await Template.findById(id);
            if (!template) return res.status(404).json({ error: "Template not found" });

            const exercise = template.exercises.id(exerciseId);
            if (!exercise) return res.status(404).json({ error: "Exercise not found" });

            const index = parseInt(setIndex, 10);
            if (isNaN(index) || index < 0 || index >= exercise.sets.length) {
                return res.status(404).json({ error: "Set not found" });
            }

            exercise.sets.splice(index, 1);
            template.updatedAt = new Date();
            await template.save();

            res.json({ message: "Set deleted" });
        } catch (err) {
            console.error("Error deleting set from exercise:", err);
            res.status(500).json({ error: err.message });
        }
    }

    //=============================================================//
    //===========================SUMMARY ROUTES====================//
    //=============================================================//

    //
// This function will calculate and return the student's workout stats
    static async getWorkoutStats(req, res) {
        try {
            const { studentNumber } = req.params;

            // 1. Fetch total workouts
            // Find all workouts for the given student number
            const totalWorkouts = await Workout.countDocuments({ studentNumber: studentNumber });

            // 2. Fetch weekly workouts
            // Calculate the start of the current week (e.g., Sunday 12:00 AM)
            const startOfWeek = new Date();
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Go back to the last Sunday

            const weeklyWorkouts = await Workout.countDocuments({ 
            studentNumber: studentNumber,
            date: { $gte: startOfWeek } // Only count workouts from this week onwards
            });

            // 3. Fetch total templates
            // Count all workout templates created by the student
            const totalTemplates = await Template.countDocuments({ studentNumber: studentNumber });

            // You can add more stats here, like total check-ins from the 'checkin' model.

            // Send back the calculated statistics
            res.status(200).json({ 
                stats: {
                    totalWorkouts,
                    weeklyWorkouts,
                    totalTemplates
                }
            });

         } catch (err) {
            console.error("Error fetching workout stats:", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    };
}

module.exports = workoutController;
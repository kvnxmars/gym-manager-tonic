const Workout = require('../models/Workout'); // Assuming you have this model
const Template = require('../models/WorkoutTemplate'); // Assuming you have this model

// This function will calculate and return the student's workout stats
exports.getWorkoutStats = async (req, res) => {
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
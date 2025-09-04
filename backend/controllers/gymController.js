const CheckIn = require("../models/CheckIns");

// Simple stats (total visits, last 10 check-ins)
exports.getStats = async (req, res) => {
  try {
    const totalVisits = await CheckIn.countDocuments();
    const lastCheckIns = await CheckIn.find()
      .populate("studentId", "studentNumber name")
      .sort({ checkInTime: -1 })
      .limit(10);

    res.json({ totalVisits, lastCheckIns });
  } catch (err) {
    res.status(500).json({ message: "Error fetching gym stats." });
  }
};

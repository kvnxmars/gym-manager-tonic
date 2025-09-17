const express = require("express");
const { createCheckIn } = require("../controllers/checkInController");
const router = express.Router();

// Check-in
router.post("/checkin", async (req, res) => {
  try {
    const { studentNumber } = req.body;
    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const active = await CheckIn.findOne({ studentId: student._id, checkOutTime: null });
    if (active) {
      return res.status(400).json({ message: "Already checked in" });
    }

    const checkIn = new CheckIn({
      studentId: student._id,
      checkInTime: new Date(),
    });
    await checkIn.save();

    res.status(201).json({ message: "Check-in successful", checkIn });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Server error during check-in" });
  }
});

// Check-out
router.post("/checkout", async (req, res) => {
  try {
    const { studentNumber } = req.body;
    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const checkIn = await CheckIn.findOne({
      studentId: student._id,
      checkOutTime: null,
    });
    if (!checkIn) return res.status(404).json({ message: "No active check-in" });

    checkIn.checkOutTime = new Date();
    await checkIn.save();

    const duration = Math.round(
      (checkIn.checkOutTime - checkIn.checkInTime) / (1000 * 60)
    );

    res.json({ message: "Check-out successful", duration });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ message: "Server error during check-out" });
  }
});

//generate qr code data for student
router.get("/qr/:studentNumber", async (req, res) => {
  try {
    const {studentNumber} = req.params; //student number as request parameter
    const student = await Student.findOne({studentNumber}).select('-password'); //find student by student number, do not show password

    if (!student) {
      return res.status(404).json({message: "Student not found"}); //if student not found, return 404
    }
  

  const qrData = JSON.stringify({
    studentNumber: student.studentNumber,
    name: `${student.name?.first} ${student.name?.last}`,
    email: student.email,
    timestamp: Date.now(),
    id: student._id
  });

  res.json({
    message:"QR data generated successfully",
    qrData: qrData,
    student: {
      studentNumber: student.studentNumber,
      name: student.name
    }
  });
} catch (err) {
    console.error("QR generation error:", err);
    res.status(500).json({message: "Server error generating QR data" });
}
  });

module.exports = router;

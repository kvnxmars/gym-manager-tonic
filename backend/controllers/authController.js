const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

exports.loginStudent = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const { studentNumber, password } = req.body;

    if (!studentNumber || !password) {
      return res.status(400).json({ message: "Student number and password are required." });
    }

    const student = await Student.findOne({ studentNumber });
    if (!student) {
      console.log("❌ Student not found:", studentNumber);
      return res.status(401).json({ message: "Invalid student number or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      console.log("❌ Wrong password for:", studentNumber);
      return res.status(401).json({ message: "Invalid student number or password." });
    }

    console.log("✅ Login success:", student.studentNumber);

    res.status(200).json({
      message: "Login successful!",
      student: {
        id: student._id,
        studentNumber: student.studentNumber,
        name: student.name,
        email: student.email,
        membershipStatus: student.membershipStatus,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

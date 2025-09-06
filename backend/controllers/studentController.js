const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const CheckIn = require("../models/CheckIns");

// Signup new student
exports.signup = async (req, res) => {
  try {
    const { studentNumber, firstName, lastName, email, password } = req.body;

    if (!studentNumber || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Student.findOne({ studentNumber });
    if (existing) {
      return res.status(409).json({ message: "Student already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      studentNumber,
      name: { first: firstName, last: lastName },
      email,
      password: hashedPassword,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
};

// Get QR data
exports.getQR = async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const student = await Student.findOne({ studentNumber });

    if (!student) return res.status(404).json({ message: "Student not found." });

    res.json({
      qrData: student.studentNumber,
      student: {
        name: `${student.name.first} ${student.name.last}`,
        studentNumber: student.studentNumber,
        email: student.email,
        membershipStatus: student.membershipStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating QR." });
  }
};

// Get check-ins for a student
exports.getCheckIns = async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const student = await Student.findOne({ studentNumber });

    if (!student) return res.status(404).json({ message: "Student not found." });

    const checkIns = await CheckIn.find({ studentId: student._id })
      .sort({ checkInTime: -1 })
      .limit(50);

    res.json({ student: { studentNumber }, checkIns });
  } catch (err) {
    res.status(500).json({ message: "Error fetching check-ins." });
  }
};

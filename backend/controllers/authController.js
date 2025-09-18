const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
//const Staff = require("../models/Staff");

const JWT_SECRET = process.env.JWT_SECRET || "tonic.key";

// ----------------------
// Student Signup
// ----------------------
exports.signup = async (req, res) => {
  try {
    const { studentNumber, firstName, lastName, email, password } = req.body;

    if (!studentNumber || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await Student.findOne({ studentNumber });
    if (existing) {
      return res.status(409).json({ message: "Student with this number already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      studentNumber,
      name: { first: firstName, last: lastName },
      email,
      password: hashed,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ----------------------
// Student Login
// ----------------------
exports.studentLogin = async (req, res) => {
  try {
    const { studentNumber, password } = req.body;

    if (!studentNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Create JWT
    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful!",
      token,
      student: {
        id: student._id,
        studentNumber: student.studentNumber,
        name: student.name,
        email: student.email,
        membershipStatus: student.membershipStatus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

// ----------------------
// Staff Login
// ----------------------
/*exports.staffLogin = async (req, res) => {
  try {
    const { staffNumber, password } = req.body;

    if (!staffNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const staff = await Staff.findOne({ staffNumber });
    if (!staff) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Create JWT
    const token = jwt.sign({ id: staff._id, role: "staff" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful!",
      token,
      staff: {
        id: staff._id,
        staffNumber: staff.staffNumber,
        name: staff.name,
        email: staff.email,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};*/

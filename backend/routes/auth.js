const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; 

// SIGNUP (works for admin & student)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // role = "admin" or "student"
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (role === "admin") {
      const exists = await Admin.findOne({ username });
      if (exists) return res.status(409).json({ message: "Admin exists" });

      const hashed = await bcrypt.hash(password, 10);
      const admin = new Admin({ username, password: hashed });
      await admin.save();
      return res.status(201).json({ message: "Admin account created", role: "admin" });
    }

    // Default: student signup
    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).json({ message: "Student exists" });

    const hashed = await bcrypt.hash(password, 10);
    const student = new Student({
      name: { first: username, last: "" }, // adjust to match schema
      email,
      password: hashed,
    });

    await student.save();
    res.status(201).json({ message: "Student account created", role: "student" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (detect admin or student)
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Try admin first
    const admin = await Admin.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "Admin login successful", role: "admin", token });
    }

    // Try student
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Student login successful", role: "student", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

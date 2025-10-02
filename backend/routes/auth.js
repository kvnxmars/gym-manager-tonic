const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { studentNumber, firstName, lastName, email, password, role } = req.body;

    // ✅ Always check for email + password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    if (role === "admin") {
      // -------- ADMIN SIGNUP --------
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ email, password: hashedPassword });
      await newAdmin.save();

      return res.status(201).json({ message: "Admin registered successfully", role: "admin" });
    }

    // -------- STUDENT SIGNUP --------
    if (!studentNumber || !firstName || !lastName) {
      return res.status(400).json({ message: "All student fields are required" });
    }

    const existingStudent = await Student.findOne({ studentNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      studentNumber,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });
    await newStudent.save();

    return res.status(201).json({ message: "Student registered successfully", role: "student" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { studentNumber, email, password } = req.body;
    let user = null;
    let role = null;

    // Try admin login first (by email)
    if (email) {
      user = await Admin.findOne({ email });
      if (user) role = "admin";
    }

    // If no admin found, check student
    if (!user && studentNumber) {
      user = await Student.findOne({ studentNumber });
      if (user) role = "student";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      role,
      user: role === "admin"
        ? { email: user.email }
        : { studentNumber: user.studentNumber, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;

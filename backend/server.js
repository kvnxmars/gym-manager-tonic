// Import libraries
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectionstring =
  "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

mongoose
  .connect(connectionstring, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

//models
const Student = require("./models/Student");
const CheckIn = require("./models/CheckIns");

<<<<<<< HEAD
// Routes
const workoutRoutes = require("./routes/workout");
const classRoutes = require("./routes/classBookingRoutes"); // Corrected the import path to match your file name
=======
// ================== ROUTES ================== //
const authRoutes = require("./routes/auth");
const accessRoutes = require("./routes/access");
const studentRoutes = require("./routes/student")
const classRoutes = require("./routes/class"); // Corrected the import path to match your file name
const workoutRoutes = require("./routes/workout");
const occupancyRoute = require("./routes/gym")
const templateRoutes = require("./routes/templates");

app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
>>>>>>> main
app.use("/api/workouts", workoutRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/gym", occupancyRoute);
app.use("/api/templates", templateRoutes);

/*app.post("/api/login", async (req, res) => {
  try {
    const { studentNumber, password } = req.body;

    if (!studentNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

<<<<<<< HEAD
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existing = await Student.findOne({ studentNumber });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Student with this number already exists" });
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
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { studentNumber, password } = req.body;
    
    // Validate input
    if (!studentNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Find student by student number

    if (!studentNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

=======
>>>>>>> main
    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) 
      return res.status(401).json({ message: "Invalid credentials" });

<<<<<<< HEAD
    const role = studentNumber.toLowerCase().startsWith('s') ? 'staff' : 'student';

    // If login is successful, return student info (excluding password)
     return res.status(200).json({
        message: "Student login successful!",
        role,
        student: {
          id: student._id,
          studentNumber: student.studentNumber,
          name: student.name,
          email: student.email,
          membershipStatus: student.membershipStatus
        } });
      

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login." });
        setError(err.message);
    }

});

// Check-in
app.post("/api/checkin", async (req, res) => {
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
=======
    // ✅ Create JWT
    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, {
      expiresIn: "1h",
>>>>>>> main
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
});*/



// Health check
app.get("/", (req, res) => res.json({ message: "Backend is running 🚀" }));


// 404 handler
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

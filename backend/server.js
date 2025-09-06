
// Import libraries
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

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

// ================== ROUTES ================== //

// Health check
app.get("/", (req, res) => res.json({ message: "Backend is running 🚀" }));

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { studentNumber, firstName, lastName, email, password } = req.body;

    if (!studentNumber || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({ 
            message: "Login successful!",
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                name: student.name,
                email: student.email,
                membershipStatus: student.membershipStatus
            }
        });

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
    });
    await checkIn.save();

    res.status(201).json({ message: "Check-in successful", checkIn });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Server error during check-in" });
  }
});

// Check-out
app.post("/api/checkout", async (req, res) => {
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

// Gym occupancy
app.get("/api/gym/occupancy", async (req, res) => {
  try {
    const active = await CheckIn.countDocuments({ checkOutTime: null });
    res.json({ currentOccupancy: active, lastUpdated: new Date() });
  } catch (err) {
    console.error("Occupancy error:", err);
    res.status(500).json({ message: "Server error fetching occupancy" });
  }
});

// Check-in history
app.get("/api/checkins/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });


    const history = await CheckIn.find({ studentId: student._id }).sort({ checkInTime: -1 });
    res.json({ history });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Server error fetching history" });
  }
});

// Logout
app.post("/api/logout", (req, res) => res.json({ message: "Logout successful" }));


// 404 handler
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
// ================== END ================== //
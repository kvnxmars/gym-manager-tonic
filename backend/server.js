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

// ================== ROUTES ================== //
const authRoutes = require("./routes/auth");
const accessRoutes = require("./routes/access");
const studentRoutes = require("./routes/student")
const classRoutes = require("./routes/classRoutes"); // Corrected the import path to match your file name
const workoutRoutes = require("./routes/workout");
const occupancyRoute = require("./routes/gym")
const templateRoutes = require("./routes/templates");
<<<<<<< HEAD
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/gym", occupancyRoute);
app.use("/api/templates", templateRoutes);
app.use("/api/admin", adminRoutes);

/*app.post("/api/login", async (req, res) => {
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
});*/
=======
const bookingRoutes = require("./routes/booking");
const campusRoutes = require("./routes/campus");

// Use routes
>>>>>>> c2df3582eee5afb46b159f56e907173a72217559

app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/access", accessRoutes); // Access control routes
app.use("/api/workouts", workoutRoutes); // Workout routes
app.use("/api/classes", classRoutes); // Class routes
app.use("/api/student", studentRoutes); // student routes
app.use("/api/gym", occupancyRoute); // Gym occupancy routes
app.use("/api/templates", templateRoutes); // Workout template routes
app.use("/api/booking", bookingRoutes); // Booking routes
app.use("/api/campus", campusRoutes); // Campus routes


// Health check
app.get("/", (req, res) => res.json({ message: "Backend is running 🚀" }));


// 404 handler
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

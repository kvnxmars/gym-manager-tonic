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
const classRoutes = require("./routes/class"); // Corrected the import path to match your file name
const workoutRoutes = require("./routes/workout");
const occupancyRoute = require("./routes/gym")
const templateRoutes = require("./routes/templates");

app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/gym", occupancyRoute);
app.use("/api/templates", templateRoutes);


// Health check
app.get("/", (req, res) => res.json({ message: "Backend is running 🚀" }));


// 404 handler
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// Import libraries
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for password hashing
const cors = require("cors"); //to handle cross-origin requests



const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware

// MongoDB connection string
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

// Connect to MongoDB
mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Define the User Schema
const userSchema = new mongoose.Schema({
    studentNumber: { // Using studentNumber as you did in your code
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the User model
const User = mongoose.model("User", userSchema);


// Test route
app.get("/", (req, res) => {
    res.send("Hello FIT@NWU backend is running 🚀");
});

// --- API Routes ---

// Register a new user
app.post("/api/register", async (req, res) => {
    try {
        const { studentNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ studentNumber });
        if (existingUser) {
            return res.status(409).json({ message: "User with this student number already exists." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            studentNumber,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "An error occurred during registration." });
    }
});

// Login a user
app.post("/api/login", async (req, res) => {
    try {
        const { studentNumber, password } = req.body;

        // Find user by student number
        const user = await User.findOne({ studentNumber });
        if (!user) {
            return res.status(401).json({ message: "Invalid student number or password." });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid student number or password." });
        }

        // In a real-world app, you would generate a JWT token here.
        // For now, we'll just send a success message.
        res.status(200).json({ message: "Login successful!" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Logout a user
app.post("/api/logout", (req, res) => {
    // We need to handle token invalidation here,
    // by clearing the session.
    // For now, we'll just send a success message.
    res.status(200).json({ message: "Logout successful!" });
});


// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});





//import libraries
 
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/";
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // fixed typo
const cors = require("cors");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes); // Use auth routes

// api/signup: kevin
app.post('/api/signup', (req, res) => {
    // Set dummy values if not provided
    const studentNumber = req.body.studentNumber || "41503619";
    const password = req.body.password || "123456";

    // Basic validation
    if (!studentNumber || !password) {
        return res.status(400).json({ message: 'StudentNumber and password are required.' });
    }

    // TODO: Add user to database (mocked here)
    res.status(201).json({ message: 'User signed up successfully.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
//api/login/: yoda
//api/logout/: yoda



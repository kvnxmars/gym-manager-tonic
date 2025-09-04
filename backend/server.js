//import libraries
 
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/";
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // fixed typo
const cors = require("cors");
const PORT = 5000;
const dotenv = require('dotenv');//to hide sensitive info
dotenv.config(); //load .env variables

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes); // Use auth routes


// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
//api/login/: yoda
//api/logout/: yoda



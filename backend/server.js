
//import libraries
 
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/";
const express = require("express");
const mongoose = require("mongoose");
const bcryot = require("bcryptjs"); //for password hashing
const cors = require("cors"); //to handle cross-origin requests
const PORT = 5000; //Server port




const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Import routes
import authRoutes from './routes/auth.js';
app.use('/api', authRoutes); // Use auth routes

// Start server

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
//api/signup: kevin
/*app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    //Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    //TODO: Add user to database (mocked here)
    res.status(201).json({ message: 'User signed up successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/


//push changes to github

//api/login/: yoda
//api/logout/: yoda



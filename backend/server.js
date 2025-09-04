//import libraries
 
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // fixed typo
const cors = require("cors");
const PORT = 5000;
const dotenv = require('dotenv');//to hide sensitive info
dotenv.config(); //load .env variables
const jwt = require('jsonwebtoken'); //for token generation
const User = require("./models/User");


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

  //helper function for generating JWT tokens
  const generateToken = (studentNumber) => {
    return jwt.sign({ studentNumber }, process.env.JWT_SECRET, 
        { expiresIn: '1h' });
  }


//@route POST api/signup
//@desc Register a new user
app.post('/signup', async (req, res) => {
    try 
    {
        const {studentNumber, password, name, email } = req.body;
    
        // Basic validation
        if (!studentNumber || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        //check if user exists
        const existingUser = await User.findOne({ studentNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Student already exists"});
        }   

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new student
        const newStudent = new Student({
            studentNumber,
            password: hashedPassword,
            name,
            email
        });

        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully" });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Server error');
    }
});



// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
//api/login/: yoda
//api/logout/: yoda



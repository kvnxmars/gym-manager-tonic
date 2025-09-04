const express = require('express'); //Express framework
const router = express.Router(); //API router instance
const bcrypt = require('bcryptjs'); //For password hashing
const { Student } = require('../models/Students'); //User model

//@route POST api/signup
//@desc Register a new user
router.post('/signup', async (req, res) => {
    try 
    {
        const {studentNumber, password, name, email } = req.body;
    
        // Basic validation
        if (!studentNumber || !password || !name || !name.first || !name.last || !email) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        //check if user exists
        const existingUser = await Student.findOne({ studentNumber });
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

module.exports = router; //Export the router to be used in server.js

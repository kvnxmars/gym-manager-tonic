const express = require('express'); //Express framework
const router = express.Router(); //API router instance

//@route POST api/signup
//@desc Register a new user
router.post('/signup', async (req, res) => {
    const {studentNumber, password} = req.body;
    console.log('Attempting to sign up user:', studentNumber);

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    //save user to database (mocked here)
    // Mock database array
    if (!global.mockUsers) {
        global.mockUsers = [];
    }
    global.mockUsers.push({ studentNumber, password: hashedPassword });

    //mock response
    res.status(201).json({message: 'User signed up successfully.'});
});

module.exports = router; //Export the router to be used in server.js

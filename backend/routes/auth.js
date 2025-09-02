const express = require('express'); //Express framework
const router = express.Router(); //API router instance

//@route POST api/signup
//@desc Register a new user
router.post('/signup', async (req, res) => {
    const {studentNumber, password} = req.body;
    console.log('Attempting to sign up user:', studentNumber);

    //will eventually hash password and store user in database

    //mock response
    res.status(201).json({message: 'User signed up successfully.'});
});

module.exports = router; //Export the router to be used in server.js

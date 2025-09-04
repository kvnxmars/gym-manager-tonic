const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken'); //for token generation
const Admin = require('../models/Admin'); //import Admin model
const { Student } = require('../models/Student'); //import Student model
const bcrypt = require('bcryptjs'); //for password hashing

//Generate web-token
const generateToken = (id) => {
    return jwt.sign({ studentNumber }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');

// Generate Json Web Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token valid for 30 days
    });
};


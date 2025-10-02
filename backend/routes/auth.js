const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
//const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", authController.studentLogin);
router.post("/signup", authController.signup);



module.exports = router;

const express = require("express");
const { signup, studentLogin, staffLogin } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);           // student signup
router.post("/login", studentLogin);     // student login
router.post("/staff/login", staffLogin);  // staff login
router.post("/logout", (req, res) => res.json({ message: "Logout successful" }));

module.exports = router;

// routes/studentProfiles.js
const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");


// READ all profiles
router.get("/info", StudentController.getAllUsers);

// READ profile by student number
router.get("/:studentNumber", StudentController.getStudentInfo);
  

// UPDATE profile
router.put("/:studentNumber", StudentController.updateStudentInfo);
router.put("/password/:studentNumber", StudentController.updatePassword); //update password


// DELETE profile
router.delete("/:studentNumber", StudentController.removeStudent);

module.exports = router;

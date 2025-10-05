// routes/studentProfiles.js
const express = require("express");
const router = express.Router();
const studentCont = require("../controllers/studentController");


// READ all profiles
router.get("/", studentCont.getAllInfo);

// READ profile by student number
router.get("/:studentNumber", studentCont.getStudentInfo);
  

// UPDATE profile
router.put("/:studentNumber", studentCont.updateStudentInfo);
router.put("/password/:studentNumber", studentCont.updatePassword); //update password


// DELETE profile
router.delete("/:studentNumber", studentCont.removeStudent);

module.exports = router;

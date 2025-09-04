const express = require("express");
const { signup, getQR, getCheckIns } = require("../controllers/studentController");
const router = express.Router();

router.post("/signup", signup);
router.get("/qr/:studentNumber", getQR);
router.get("/checkins/:studentNumber", getCheckIns);

module.exports = router;

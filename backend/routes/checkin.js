const express = require("express");
const { createCheckIn } = require("../controllers/checkInController");
const router = express.Router();

router.post("/", createCheckIn);

module.exports = router;

const express = require("express");
const { getStats } = require("../controllers/gymController");
const router = express.Router();

router.get("/stats", getStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");

// create
router.post("/", async (req, res) => {
  try {
    const e = new Equipment(req.body);
    await e.save();
    res.status(201).json(e);
  } catch (err) {
    console.error("Equipment create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// list
router.get("/", async (req, res) => {
  try {
    const list = await Equipment.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    console.error("Equipment list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const e = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return res.status(404).json({ message: "Not found" });
    res.json(e);
  } catch (err) {
    console.error("Equipment update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Equipment delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

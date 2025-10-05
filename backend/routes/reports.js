const express = require("express");
const router = express.Router();
const CheckIn = require("../models/CheckIns");
const Student = require("../models/Student");

// Usage trends (last 30 days)
router.get("/usage-trends", async (req, res) => {
  try {
    const results = await CheckIn.aggregate([
      {
        $match: {
          checkInTime: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" } },
          checkIns: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(results.map(r => ({ date: r._id, checkIns: r.checkIns })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top members
router.get("/top-members", async (req, res) => {
  try {
    const order = req.query.order === "asc" ? 1 : -1;
    const top = await CheckIn.aggregate([
      { $group: { _id: "$studentId", attendanceCount: { $sum: 1 } } },
      { $sort: { attendanceCount: order } },
      { $limit: 10 }
    ]);
    const populated = await Student.populate(top, { path: "_id" });
    res.json(populated.map(t => ({
      _id: t._id._id,
      studentNumber: t._id.studentNumber,
      name: t._id.name,
      attendanceCount: t.attendanceCount
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Least active members
router.get("/least-members", async (req, res) => {
  try {
    const order = req.query.order === "asc" ? 1 : -1;
    const least = await CheckIn.aggregate([
      { $group: { _id: "$studentId", attendanceCount: { $sum: 1 } } },
      { $sort: { attendanceCount: order } },
      { $limit: 10 }
    ]);
    const populated = await Student.populate(least, { path: "_id" });
    res.json(populated.map(l => ({
      _id: l._id._id,
      studentNumber: l._id.studentNumber,
      name: l._id.name,
      attendanceCount: l.attendanceCount
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

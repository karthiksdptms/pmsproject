import express from "express";
import AttendanceModel from "../models/AttendanceModel.js";

const router = express.Router();

// Mark attendance
router.post("/mark-attendance", async (req, res) => {
  const { studentId, batch, scheduleCode, status } = req.body;

  try {
    await AttendanceModel.create({ studentId, batch, scheduleCode, status });

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error marking attendance" });
  }
});

export default router;

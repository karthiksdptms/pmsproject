import express from "express";
import { saveAttendance,getAttendanceReports } from "../controllers/Attendancecontroller.js";
import AttendanceModel from "../models/AttendanceModel.js";

const router = express.Router()
router.post("/save", saveAttendance);
router.get("/attendance-reports", getAttendanceReports);
router.get("/attendance/:scheduleCode/:batchNumber", async (req, res) => {
    try {
      const { scheduleCode, batchNumber } = req.params;
  
    
      const attendanceRecord = await AttendanceModel.findOne(
        { scheduleCode, "batches.batchNumber": batchNumber },
        { "batches.$": 1, scheduleCode: 1, trainingName: 1 }
      );
  
      if (!attendanceRecord) {
        return res.status(404).json({ message: "No attendance found for this batch" });
      }
  
      return res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;

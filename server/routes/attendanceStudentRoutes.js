import express from "express";
import AttendanceStudentModel from "../models/AttendanceStudentModel.js"; // ✅ Correct Import

const router = express.Router();

router.get("/attendance-students", async (req, res) => {
    try {
      let { batch } = req.query;
  
      if (!batch) {
        return res.status(400).json({ error: "Batch parameter is required" });
      }
  
      batch = decodeURIComponent(batch.trim()); // ✅ Fix encoding issues
  
      console.log("Fetching students for batch:", batch); // ✅ Debugging Log
  
      const students = await AttendanceStudentModel.find({ batch });
  
      if (!students.length) {
        return res.status(404).json({ error: `No students found for batch: ${batch}` });
      }
  
      console.log("Students found:", students.length);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Error fetching students", details: error.message });
    }
  });
  

export default router;

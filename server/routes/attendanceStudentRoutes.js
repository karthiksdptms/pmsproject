import express from "express";
import ScheduleModel from "../models/ScheduleModel.js"; 

const router = express.Router();

router.get("/attendance-students", async (req, res) => {
    try {
        const { scheduleCode, batch } = req.query; // Get params from frontend
    
        if (!scheduleCode || !batch) {
          return res.status(400).json({ message: "Missing scheduleCode or batch" });
        }
    
        // Find training session with matching scheduleCode
        const training = await ScheduleModel.findOne({ scheduleCode });
    
        if (!training) {
          return res.status(404).json({ message: "Training schedule not found" });
        }
    
        // Find the specific batch inside the training document
        const selectedBatch = training.batches.find((b) => b.batchNumber === batch);
    
        if (!selectedBatch) {
          return res.status(404).json({ message: "Batch not found in this training" });
        }
    
        // Send the students in that batch
        return res.json({ students: selectedBatch.students });
      } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })



export default router;

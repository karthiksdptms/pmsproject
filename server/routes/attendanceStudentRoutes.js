import express from "express";
import ScheduleModel from "../models/ScheduleModel.js"; 

const router = express.Router();

router.get("/attendance-students", async (req, res) => {
    try {
        let { batch } = req.query;

        if (!batch) {
            return res.status(400).json({ error: "Batch parameter is required" });
        }
        batch = decodeURIComponent(batch.trim());
        const schedule = await ScheduleModel.findOne({ "batches.batchNumber": batch }).lean()

        if (!schedule) {
            console.warn(`[WARN] No schedule found containing batch: ${batch}`);
            return res.status(404).json({ error: `No schedule found for batch: ${batch}` })
        }
        const batchData = schedule.batches.find((b) => b.batchNumber === batch)

        if (!batchData || !batchData.students || batchData.students.length === 0) {
            console.warn(`[WARN] No students found for batch: ${batch}`);
            return res.status(200).json([]); 
        }
        res.json(batchData.students);
    } catch (error) {
        console.error("[ERROR] Error fetching students:", error);
        res.status(500).json({ error: "Error fetching students", details: error.message });
    }
});


export default router;



import express from "express";
import ScheduleModel from "../models/ScheduleModel.js"; // Assuming your schedule collection is named "ScheduleModel"

const router = express.Router();

router.get("/attendance-students", async (req, res) => {
    try {
        let { batch } = req.query;

        if (!batch) {
            return res.status(400).json({ error: "Batch parameter is required" });
        }

        batch = decodeURIComponent(batch.trim());

        console.log(`[INFO] Fetching students for batch: ${batch}`);

        // Find the schedule that contains the batchNumber inside the `batches` array
        const schedule = await ScheduleModel.findOne({ "batches.batchNumber": batch }).lean();

        if (!schedule) {
            console.warn(`[WARN] No schedule found containing batch: ${batch}`);
            return res.status(404).json({ error: `No schedule found for batch: ${batch}` });
        }

        // Extract the batch object that matches the given batch number
        const batchData = schedule.batches.find((b) => b.batchNumber === batch);

        if (!batchData || !batchData.students || batchData.students.length === 0) {
            console.warn(`[WARN] No students found for batch: ${batch}`);
            return res.status(200).json([]); // Return empty array instead of error
        }

        console.log(`[SUCCESS] Students found: ${batchData.students.length}`);
        res.json(batchData.students);
    } catch (error) {
        console.error("[ERROR] Error fetching students:", error);
        res.status(500).json({ error: "Error fetching students", details: error.message });
    }
});




export default router;

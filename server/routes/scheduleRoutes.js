import express from "express";
import ScheduleModel from "../models/ScheduleModel.js";
import { saveTraining, checkScheduleCode } from "../controllers/scheduleController.js";

const router = express.Router();


router.use((req, res, next) => {
   
    next();
});


router.post("/saveTraining", saveTraining);


router.get("/check-schedule-code/:scheduleCode", checkScheduleCode);


router.get("/", async (req, res) => {
  try {
    const schedules = await ScheduleModel.find();
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/schedule-dates", async (req, res) => {
  try {
    const { scheduleCode, batch } = req.query;

    const schedule = await ScheduleModel.findOne({ scheduleCode });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    const selectedBatch = schedule.batches.find((b) => b.batchNumber === batch);

    if (!selectedBatch) {
      return res.status(404).json({ error: "Batch not found in schedule" });
    }

   
    res.json({
      fromDate: selectedBatch.fromdate,
      toDate: selectedBatch.todate,
    });

  } catch (error) {
    console.error("Error fetching schedule dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;

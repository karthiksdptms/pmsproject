import express from "express";
import ScheduleModel from "../models/ScheduleModel.js";
import { saveTraining, checkScheduleCode } from "../controllers/scheduleController.js";

const router = express.Router();

// ✅ Middleware to log API calls for debugging
router.use((req, res, next) => {
    console.log(`API called: ${req.method} ${req.url}`);
    next();
});

// ✅ Route to save a new training schedule
router.post("/saveTraining", saveTraining);

// ✅ Route to check if a schedule code already exists
router.get("/check-schedule-code/:scheduleCode", checkScheduleCode);

// ✅ Route to fetch all training schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await ScheduleModel.find();
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

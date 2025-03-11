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

export default router;

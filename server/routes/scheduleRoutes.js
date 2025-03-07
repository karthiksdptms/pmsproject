import express from "express";
import { saveTraining,checkScheduleCode  } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/saveTraining", saveTraining);
router.get("/check-schedule-code/:scheduleCode", checkScheduleCode);


export default router;

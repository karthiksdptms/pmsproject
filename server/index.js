import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./db/db.js";
import authRouter from "./routes/auth.js";
import studentRouter from "./routes/students.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

import FilterModel from "./models/FilterModel.js";
import QpModel from "./models/QpModel.js";
import attendanceStudentRoutes from "./routes/attendanceStudentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import answerkeyRouter from "./routes/answerkey.js"

dotenv.config();
connectDatabase();

const app = express();

app.use(cors());
app.use(express.static('public/uploads'));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/schedule', scheduleRoutes);
app.use("/api/training", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendancestudent", attendanceStudentRoutes);
app.use("/api/answerkey",answerkeyRouter)


app.get("/getstudents", async (req, res) => {
  try {
    const students = await FilterModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/addqp", async (req, res) => {
  try {
    const qpaper = await QpModel.create(req.body);
    res.json(qpaper);
  } catch (error) {
    res.status(500).json({ message: "Error adding question paper" });
  }
});

app.get("/getqp", async (req, res) => {
  try {
    const qpapers = await QpModel.find({});
    res.json(qpapers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question papers" });
  }
});

app.put('/updateqp/:id', async (req, res) => {
  try {
    const updatedPaper = await QpModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPaper) return res.status(404).json({ message: "Paper not found" });
    res.json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delqp/:id", async (req, res) => {
  try {
    await QpModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record" });
  }
});  





app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

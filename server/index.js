import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./db/db.js";
import authRouter from "./routes/auth.js";
import studentRouter from "./routes/students.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import FilterModel from "./models/FilterModel.js";
import QpModel from "./models/QpModel.js";
import attendanceStudentRoutes from "./routes/attendanceStudentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import answerkeyRouter from "./routes/answerkey.js"
import StudentModel from "./models/StudentModel.js";
import chartRoutes from "./routes/chartRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import filteroutes from "./routes/filters.js"
import AdminRoutes from "./routes/AdminRoutes.js"
import Categories from "./routes/categories.js";

import { autoPostScheduler,autoDeleteScheduler } from "./autoPostScheduler.js";
dotenv.config();
connectDatabase();

const app = express();

app.use(cors());
app.use(express.static('public/uploads'));
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/schedule', scheduleRoutes);
app.use("/api/training", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendancestudent", attendanceStudentRoutes);
app.use("/api/answerkey",answerkeyRouter)
app.use("/api/charts", chartRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/filters", filteroutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/category", Categories);


connectDatabase().then(() => {
  autoPostScheduler();
  autoDeleteScheduler(); 
  console.log("✅ Auto Post and Auto Delete Schedulers are running...");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post("/send-email", async (req, res) => {
  const { studentIds, company, date, venue, requirements, skills } = req.body;

  if (!studentIds || studentIds.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No recipients selected" });
  }

  try {
    
    const students = await StudentModel.find({ _id: { $in: studentIds } });

    if (!students.length) {
      return res.status(404).json({ error: "No students found" });
    }

    console.log(
      `📩 Sending emails to: ${students.map((s) => s.email).join(", ")}`
    );

   
    const announcementData = {
      title: `Placement Announcement - ${company}`,
      description: `You are invited for a placement drive at ${company}.\n\nDate: ${date}\nVenue: ${venue}\nRequirements: ${requirements}\nSkills: ${skills}`,
      postedAt: new Date(),
    };

    
    await Promise.all(
      students.map(async (student) => {
        let mailOptions = {
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: announcementData.title,
          text: `Dear ${student.name},\n\n${announcementData.description}\n\nBest regards,\nPlacement Team`,
        };

      
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log(`✅ Email sent to ${student.email}: ${info.response}`);

        
          await StudentModel.updateOne(
            { _id: student._id },
            {
              $push: { placement_announce: announcementData },
            }
          );

          console.log(`📚 Announcement added for ${student.name}`);
        } catch (err) {
          console.error(`❌ Failed to send email to ${student.email}: ${err.message}`);
        }
      })
    );

    res.status(200).json({ success: true, message: "Emails sent successfully and announcements recorded." });
  } catch (error) {
    console.error("Error sending emails:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
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

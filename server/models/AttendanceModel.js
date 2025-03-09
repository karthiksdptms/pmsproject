import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceStudent", required: true },
  scheduleCode: { type: String, required: true }, // Training Schedule Code
  batch: { type: String, required: true }, // Batch name
  status: { type: String, enum: ["Present", "Absent", "On Duty"], required: true },
  date: { type: Date, default: Date.now },
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
export default AttendanceModel;

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceStudent", required: true },
  scheduleCode: { type: String, required: true }, 
  batch: { type: String, required: true }, 
  status: { type: String, enum: ["Present", "Absent", "On Duty"], required: true },
  date: { type: Date, default: Date.now },
});

const AttendanceModel = mongoose.model("Attendances", AttendanceSchema);
export default AttendanceModel;

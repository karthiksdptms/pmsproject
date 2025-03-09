import mongoose from "mongoose";

const AttendanceStudentSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
});

const AttendanceStudentModel = mongoose.model("AttendanceStudent", AttendanceStudentSchema);

export default AttendanceStudentModel;

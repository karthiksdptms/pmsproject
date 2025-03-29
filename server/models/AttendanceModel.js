import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  scheduleCode: { type: String, required: true, unique: true },
  trainingName: { type: String, required: true },
  trainee:{ type: String, required: true },
 
  batches: [
    {
      batchNumber: { type: String, required: true },
      dates: [
        {
          date: { type: String, required: true },
          students: [
            {
              registerNumber: { type: String, required: true },
              department: { type: String, required: true },
              status: { type: String, enum: ["P", "A", "OD"], required: true },
            },
          ],
        },
      ],
    },
  ],
});

const AttendanceModel = mongoose.model("stdattendances", AttendanceSchema);
export default AttendanceModel;

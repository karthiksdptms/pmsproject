import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  scheduleCode: {
    type: String,
    required: true,
    unique: true,
  },
  trainingName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  trainee: {
    type: String,
    required: true,
  },
  fromdate: {
    type: Date,
    required: true,
  },
  todate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  participated: {
    type: Number,
    required: true,
  },
  batches: {
    type: [
      {
        batchNumber: String,
        students: [
          {
            registerNumber: String,
            name: String,
          },
        ], // Structure for student details
      },
    ],
    required: true,
  },
});

// Ensure the model name matches the import in the controller
const ScheduleModel = mongoose.model("BatchSchedules", scheduleSchema);

export default ScheduleModel;

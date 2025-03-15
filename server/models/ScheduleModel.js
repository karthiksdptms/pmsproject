import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchNumber: String,
  fromdate: String,
  todate: String,
  students: {
    type: Array, 
    default: []
  }
});

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
  batch: {
    type: String,
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
  participated:{
    type:Number,
    required:true
  },
  batches:  [batchSchema],
});

const ScheduleModel = mongoose.model("BatchSchedules", scheduleSchema);

export default ScheduleModel;

import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
 scheduleCode: {
    type: String,
    required: true,
    unique: true
  },
  trainingName: {
    type: String,
    required: true,
  },
  batches: {
    type: Array,
    required: true,
  },
});

const scheduleModel = mongoose.model("Batchschedules", scheduleSchema);

export default scheduleModel;

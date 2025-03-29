
import mongoose from "mongoose";


const chartDataSchema = new mongoose.Schema({
  labels: {
    type: [String], 
    required: true,
  },
  data: {
    type: [Number], 
    required: true,
  },
});

// Create ChartData Model
const ChartData = mongoose.model("ChartDatas", chartDataSchema);

export default ChartData;

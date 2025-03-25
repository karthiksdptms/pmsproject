import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Batchesmodel = mongoose.model("Batchs", batchSchema);
export default Batchesmodel;

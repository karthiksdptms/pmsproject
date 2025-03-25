import mongoose from "mongoose";

const AOISchema = new mongoose.Schema({
  aoiName: { type: String, required: true },
});

const AOIModel = mongoose.model("Areaofintrests", AOISchema);

export default  AOIModel;

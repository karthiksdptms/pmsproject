import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const TextModel = mongoose.model("Text", textSchema);
export default TextModel;

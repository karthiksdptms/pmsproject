import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  registration_number: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  qpcode: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const AnswerModel = mongoose.model("Studentsanswers", AnswerSchema);
export default AnswerModel;

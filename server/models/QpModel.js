import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  marks: { type: Number, required: true },
  options: { type: [String], required: true, validate: v => v.length === 4 }, 
  
});

const finalSchema= new mongoose.Schema({
  title: { type: String, required: true },
  academicYear: { type: String, required: true },
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  semesterType: { type: String, enum: ['Odd', 'Even'], required: true },
  negativeMarking: { type: String, enum: ['Yes', 'No'], required: true },
  instructions: { type: String, required: true },
  questions: { type: [questionSchema], required: true }
}, { timestamps: true });

const QpModel = mongoose.model("qpapers", finalSchema);
export default QpModel;
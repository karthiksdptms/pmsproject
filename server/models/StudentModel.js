import mongoose from "mongoose";
import { Schema } from "mongoose";

const offerSchema = new mongoose.Schema({
  offerno: { type: String },
  company: { type: String },
  package: { type: String },
  designation: { type: String },
});

const examSchema = new mongoose.Schema({
  qpcode: { type: String },
  title: { type: String },
  academicYear: { type: String },
  department: { type: String },
  batch: { type: String },
  negativeMarking: { type: String },
  examDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  semesterType: { type: String },
  questions: [
    {
      question: { type: String },
      options: [String],
      marks: { type: Number },
    },
  ],
});


const resultSchema = new mongoose.Schema({
  registration_number: { type: String, required: true }, 
  batch: { type: String, required: true },
  qpcode: { type: String, required: true }, 
  title: { type: String,  }, 
  score: { type: Number, required: true }, 
  totalscore: { type: Number, required: true }, 
  percentage: { type: String, required: true }, 
  published: { type: Boolean, default: false }, 
  publishedAt: { type: Date, default: null },
});

const studentSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  registration_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email:{type:String,required:true,unique:true},
  department: { type: String, required: true },
  batch: { type: String, required: true },
  sslc: { type: String, required: true },
  hsc: { type: String },
  diploma: { type: String },
  sem1: { type: String },
  sem2: { type: String },
  sem3: { type: String },
  sem4: { type: String },
  sem5: { type: String },
  sem6: { type: String },
  sem7: { type: String },
  sem8: { type: String },
  cgpa: { type: String },
  arrears: Number,
  internships: { type: String },
  certifications: { type: String },
  patentspublications: { type: String },
  achievements: { type: String },
  hoa: { type: String },
  language: { type: String },
  aoi: { type: String },
  address: { type: String },
  phoneno: { type: String },
  resume: { type: String },
  profileImage: { type: String },
  placement: { type: String },
  offers: [offerSchema],
  offerpdf: { type: String },
  exams: [examSchema],
  results: [resultSchema],
});

const StudentModel = mongoose.model("studentaccdatas", studentSchema);
export default StudentModel;

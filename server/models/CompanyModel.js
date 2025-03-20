// models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  COMPANYIMG: {
    type: String,
    required: true,
  },
  COMPANYNAME: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Company = mongoose.model("companys", companySchema);
export default Company;

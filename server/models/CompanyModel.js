import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
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

const Company = mongoose.model("compannies", companySchema);
export default Company;

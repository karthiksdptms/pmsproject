import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Departmentmodel = mongoose.model("Departments", departmentSchema);
export default Departmentmodel;

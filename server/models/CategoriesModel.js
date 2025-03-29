import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  scoreValue: { type: Number, required: true }, 
});

const Categories = mongoose.model("Categories", categorySchema);

export default Categories;

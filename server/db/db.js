import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const connectDatabase = async () => {
    try {
      
      await mongoose.connect(process.env.MONGO_URI); // ✅ Removed deprecated options
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
     
    }
  };
  
  
export default connectDatabase;

import mongoose from "mongoose";

// Offer Schema
const offerSchema = new mongoose.Schema({
  OFFERNO: String,
  COMPDETAIL: String,
  PACKAGE: String,
  DESIGNATION: String,
  OFFER: String, 
});

// Main Student Schema
const filterSchema = new mongoose.Schema({
  REGISTRATION_NUMBER: { type: String, required: true, unique: true },
  NAME: { type: String, required: true },
  DEPARTMENT: String,
  BATCH: String,
  SSLC: String,
  HSC: String,
  SEM1: String,
  SEM2: String,
  SEM3: String,
  SEM4: String,
  SEM5: String,
  SEM6: String,
  SEM7: String,
  SEM8: String,
  CPGA: Number,
  ARREARS: Number,
  INTERNSHIPS: String,
  CERTIFICATIONS: String,
  PATENTSPUBLICATIONS: String,
  ACHEIVEMENTS: String,
  HOA: String,
  LANGUAGE: String,
  AOI: String,
  EMAIL: { type: String, required: true },
  ADDRESS: String,
  PHONENO: String,
  RESUME: String, 
  PLACEMENT: String,
  OFFERS: [offerSchema], // Embedding Offer Schema
});

// Export model with corrected name
const FilterModel = mongoose.model("filtertables", filterSchema);
export default FilterModel;

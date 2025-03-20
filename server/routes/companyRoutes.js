// routes/companyRoutes.js
import express from "express";
import Company from "../models/CompanyModel.js";

const router = express.Router();




router.get("/get-companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching companies" });
  }
});

export default router;

import express from "express";
import multer from "multer";
import path from "path";

import Company from "../models/CompanyModel.js";

const router = express.Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


router.post("/addcompany", upload.single("COMPANYIMG"), async (req, res) => {
  try {
    const { COMPANYNAME, content } = req.body;
    const COMPANYIMG = req.file ? req.file.filename : null;

  
    const newCompany = new Company({
      COMPANYIMG,
      COMPANYNAME,
      content,
    });

   
    await newCompany.save();
    res.status(201).json({ message: "Company added successfully!" });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ error: "Failed to add company" });
  }
});


router.get("/get-companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching companies" });
  }
});



// Delete a company by ID
router.delete("/deletecompany/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: "Company deleted successfully!" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});



export default router;

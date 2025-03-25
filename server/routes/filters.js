import express from "express";
import Departmentmodel from "../models/Departmentmodel.js";
import Batchesmodel from "../models/Batchesmodel.js";
import AOIModel from "../models/AoiModel.js";
const router = express.Router();


router.get("/getdepartments", async (req, res) => {
  try {
    const departments = await Departmentmodel.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments" });
  }
});


router.post("/adddepartments", async (req, res) => {
  try {
    const { name } = req.body;

  
    const existingDept = await Departmentmodel.findOne({ name });
    if (existingDept) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const newDepartment = new Departmentmodel({ name });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: "Error adding department" });
  }
});


router.delete("/deletedepartments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Departmentmodel.findByIdAndDelete(id);
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department" });
  }
});



router.get("/getbatch", async (req, res) => {
  try {
    const batches = await Batchesmodel.find();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches" });
  }
});

  
  
  router.post("/addbatch", async (req, res) => {
    try {
      const { batchName } = req.body;
  
      
      const existingBatch = await Batchesmodel.findOne({ batchName });
      if (existingBatch) {
        return res.status(400).json({ message: "Batch already exists" });
      }
  
      const newBatch = new Batchesmodel({ batchName });
      await newBatch.save();
      res.status(201).json(newBatch);
    } catch (error) {
      res.status(500).json({ message: "Error adding batch" });
    }
  });
  
  
  router.delete("/deletebatch/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Batchesmodel.findByIdAndDelete(id);
      res.json({ message: "Batch deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting batch" });
    }
  });



  router.get("/getaoi", async (req, res) => {
    try {
      const aois = await AOIModel.find();
      res.json(aois);
    } catch (error) {
      res.status(500).send("Error fetching AOI options: " + error.message);
    }
  });
  
 
  router.post("/addaoi", async (req, res) => {
    const { aoiName } = req.body;
    const newAOI = new AOIModel({ aoiName });
    await newAOI.save();
    res.json(newAOI);
  });
  
  
  router.delete("/deleteaoi/:id", async (req, res) => {
    const { id } = req.params;
    await AOIModel.findByIdAndDelete(id);
    res.json({ message: "AOI Deleted Successfully" });
  });
  

export default router;

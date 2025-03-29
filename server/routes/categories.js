import express from "express";
import Categories from "../models/CategoriesModel.js";

const router = express.Router();


router.post("/add-category", async (req, res) => {
  try {
    const { name, scoreValue } = req.body;
    const category = new Categories({ name, scoreValue });
    await category.save();
    res.status(201).json({ success: true, message: "Category added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add category" });
  }
});


router.get("/getcategories", async (req, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
});
router.delete("/delete-category/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Categories.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
export default router;

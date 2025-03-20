// routes/chartRoutes.js
import express from "express";
import ChartData from "../models/ChartModel.js";

const router = express.Router();

// 📊 Get Chart Data
router.get("/getChartData", async (req, res) => {
  try {
    const chartData = await ChartData.findOne({});
    if (!chartData) {
      return res.status(404).json({ message: "No chart data found" });
    }
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chart data", error });
  }
});

// 📊 Save or Update Chart Data
router.post("/saveChartData", async (req, res) => {
  const { labels, data } = req.body;

  try {
    // Check if data exists, update it; otherwise, insert new data
    let chartData = await ChartData.findOne({});
    if (chartData) {
      chartData.labels = labels;
      chartData.data = data;
      await chartData.save();
    } else {
      chartData = new ChartData({ labels, data });
      await chartData.save();
    }
    res.status(200).json({ message: "Chart data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving chart data", error });
  }
});

// ➕ Add a New Datapoint
router.post("/addDatapoint", async (req, res) => {
  const { label, value } = req.body;

  try {
    let chartData = await ChartData.findOne({});
    if (!chartData) {
      return res.status(404).json({ message: "No chart data found" });
    }

    chartData.labels.push(label);
    chartData.data.push(value);
    await chartData.save();
    res.status(200).json({ message: "Datapoint added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding datapoint", error });
  }
});

// ❌ Delete a Datapoint
router.delete("/deleteDatapoint/:index", async (req, res) => {
  const { index } = req.params;

  try {
    let chartData = await ChartData.findOne({});
    if (!chartData) {
      return res.status(404).json({ message: "No chart data found" });
    }

    // Check if index is valid
    if (index < 0 || index >= chartData.labels.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    chartData.labels.splice(index, 1);
    chartData.data.splice(index, 1);
    await chartData.save();
    res.status(200).json({ message: "Datapoint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting datapoint", error });
  }
});

export default router;

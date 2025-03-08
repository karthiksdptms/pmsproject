import ScheduleModel from "../models/ScheduleModel.js";


export const saveTraining = async (req, res) => {
  

  try {
    const { scheduleCode, trainingName, batches } = req.body;

    if (!scheduleCode || !trainingName || !batches || batches.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingSchedule = await ScheduleModel.findOne({ scheduleCode:scheduleCode }); 


    if (existingSchedule) {
      return res.status(400).json({ error: "Schedule Code Already Taken" });
    }

   
    const formattedBatches = batches.map((batch, index) => ({
      batchNumber: `Batch ${index + 1}`,
      students: batch,
    }));

    const newTraining = new ScheduleModel({
      scheduleCode:scheduleCode, 
      trainingName:trainingName,
      batches: formattedBatches,
    });
    

    await newTraining.save();

    
    res.status(201).json(newTraining);
  } catch (error) {
   
    res.status(500).json({ error: "Failed to save training data" });
  }
};


export const checkScheduleCode = async (req, res) => {
  try {
    const { scheduleCode } = req.params;

    const existingSchedule = await ScheduleModel.findOne({ schedulecode: scheduleCode });

    if (existingSchedule) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {

    res.status(500).json({ error: "Failed to check schedule code" });
  }
};



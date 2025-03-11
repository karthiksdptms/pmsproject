import ScheduleModel from "../models/ScheduleModel.js";


export const saveTraining = async (req, res) => {
  try {
    const { 
      scheduleCode, trainingName, type, trainee,batch, duration, department, batches 
    } = req.body;

  
    if (
      !scheduleCode || !trainingName || !type || !trainee ||!batch||
      !duration || !department || !batches || batches.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
    const existingSchedule = await ScheduleModel.findOne({ scheduleCode });
    if (existingSchedule) {
      return res.status(400).json({ error: "Schedule Code Already Taken" });
    }


    const formattedBatches = batches.map((batch, index) => ({
      batchNumber: `Batch ${index + 1}`,
      fromdate: batch.fromdate || "",
      todate: batch.todate || "",
      students: batch.students || [] 
    }));

  
    const participated = formattedBatches.reduce(
      (total, batch) => total + (Array.isArray(batch.students) ? batch.students.length : 0),
      0
    );

    
    const newTraining = new ScheduleModel({
      scheduleCode,
      trainingName,
      type,
      trainee,
      batch,
      duration,
      department,
      participated,
      batches: formattedBatches,
    });

    await newTraining.save();

    res.status(201).json({ message: "Training schedule saved successfully", data: newTraining });
  } catch (error) {
    console.error("Error in saveTraining:", error); 
    res.status(500).json({ error: "Failed to save training data" });
  }
};


export const checkScheduleCode = async (req, res) => {
    try {
        const { scheduleCode } = req.params;
        
        const existingSchedule = await ScheduleModel.findOne({ scheduleCode });

        if (existingSchedule) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking schedule code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



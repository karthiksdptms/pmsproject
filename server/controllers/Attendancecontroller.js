import AttendanceModel from "../models/AttendanceModel.js";

export const saveAttendance = async (req, res) => {
  try {
    const { scheduleCode, trainingName,trainee, batchNumber, date, students } = req.body;

    if (!scheduleCode || !trainingName ||!trainee ||!batchNumber || !date || !students.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let existingAttendance = await AttendanceModel.findOne({ scheduleCode });

    if (existingAttendance) {
      
      let batch = existingAttendance.batches.find(b => b.batchNumber === batchNumber);

      if (batch) {
      
        let dateEntry = batch.dates.find(d => d.date === date);

        if (dateEntry) {
          
          dateEntry.students = students;
        } else {
         
          batch.dates.push({ date, students });
        }
      } else {
   
        existingAttendance.batches.push({ batchNumber, dates: [{ date, students }] });
      }

      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully" });
    } else {
      
      await AttendanceModel.create({
        scheduleCode,
        trainingName,
        trainee,
        batches: [{ batchNumber, dates: [{ date, students }] }],
      });

      return res.status(201).json({ message: "Attendance saved successfully" });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAttendanceReports = async (req, res) => {
  try {
    const attendanceRecords = await AttendanceModel.find({}, "scheduleCode trainingName trainee batches");

    const reports = attendanceRecords.map(record => ({
      scheduleCode: record.scheduleCode,
      trainingName: record.trainingName,
      trainee: record.trainee,
      numberOfBatches: record.batches.length, 
      batches: record.batches 
    }));

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching attendance reports:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



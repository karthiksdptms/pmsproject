import express from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { addstudent, approveaddstudent,approvegetstudent,upload, getstudent, editstudent, deletestudent, uploadCSV,getonestudent
    ,postQuestionPaper,postSpecificQuestionPaper,
    toggleAutoPost,
    approveeditstudent,getallstudents,
    rejectStudent,getTexts,addText,deleteTextById,getStudentsWithScore,
} from '../controllers/studentcontroller.js';
import StudentModel from "../models/StudentModel.js"
import AnswerModel from '../models/AnswerModel.js'
import AnswerKeyModel from "../models/AnswerkeyModel.js";
import ApprovestudentModel from "../models/ApprovestudentModel.js";
import QpModel from "../models/QpModel.js"
import ScheduleModel from "../models/ScheduleModel.js"
import AttendanceModel from "../models/AttendanceModel.js"
import UUser from "../models/UUsers.js";

const router = express.Router();

router.get("/students-with-score", getStudentsWithScore);
router.post('/add', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), addstudent);
router.get('/', authMiddleware, getstudent);
router.get('/approved-students', approvegetstudent);
router.post('/approveadd', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), approveaddstudent);

router.put('/edit/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), editstudent);
router.put('/approveedit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), approveeditstudent);
router.post('/reject',rejectStudent)
router.get('/getstudents', getallstudents);

router.put('/edit/:id',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), editstudent);
router.delete('/delete/:id', authMiddleware, deletestudent);
router.get('/getone/:id',getonestudent);
router.post('/uploadcsv',authMiddleware,upload.single("csvfile"),uploadCSV);


router.post('/autopost/:id', express.json(), toggleAutoPost);



router.post("/postquestionpaper/:qpcode", postQuestionPaper);
router.post("/postspecific", postSpecificQuestionPaper);
router.get("/schedules", async (req, res) => {
    try {
        const { registration_number } = req.query;

        if (!registration_number) {
            return res.status(400).json({ message: "Register number is required" });
        }

   
        const schedules = await ScheduleModel.find({
            "batches.students.registration_number": registration_number,
        });

        
        const filteredSchedules = schedules.map((schedule) => {
            const filteredBatches = schedule.batches.filter((batch) =>
                batch.students.some(
                    (student) => student.registration_number === registration_number
                )
            );

            return {
                ...schedule.toObject(),
                batches: filteredBatches,
            };
        });

        res.json(filteredSchedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error });
    }
});

router.get("/attendance", async (req, res) => {
    try {
        const { registration_number } = req.query;

        if (!registration_number) {
            return res.status(400).json({ message: "Register number is required" });
        }

      
        const attendanceRecords = await AttendanceModel.find({
            "batches.dates": { 
                $elemMatch: { "students.registerNumber": registration_number }
            }
        });

        
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        let totalDays = 0;
        let presentDays = 0;

        attendanceRecords.forEach(record => {
            record.batches.forEach(batch => {
                batch.dates.forEach(dateEntry => {
                    const student = dateEntry.students.find(
                        (s) => s.registerNumber === registration_number
                    );
                    if (student) {
                        totalDays++;
                        if (student.status === "P" || student.status === "OD") {
                            presentDays++;
                        }
                    }
                });
            });
        });

        const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        res.json({ attendanceRecords, attendancePercentage: `${attendancePercentage.toFixed(2)}%` });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
});



router.post("/publish-result", async (req, res) => { 
    try {
        const { registration_number, batch, qpcode, title, score, totalscore } = req.body;

    
        if (!registration_number || !batch || !qpcode || !title || score === undefined || totalscore === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

       
        const percentage = ((score / totalscore) * 100).toFixed(2) + "%";

      
        const student = await StudentModel.findOne({ registration_number });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

       
        const existingResultIndex = student.results.findIndex(result => result.qpcode === qpcode);

        if (existingResultIndex !== -1) {
            return res.status(409).json({ message: "Result already published for this exam." });
        }

        
        student.results.push({
            registration_number,
            batch,
            qpcode,
            title,
            score,
            totalscore,
            percentage,
            published: true, 
            publishedAt: new Date(),
        });

        await student.save();

        res.status(200).json({ message: "Result published successfully!", published: true });
    } catch (error) {
        console.error("Error publishing result:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/publish-multiple-results", async (req, res) => {
    try {
        const { results } = req.body;

        if (!results || results.length === 0) {
            return res.status(400).json({ message: "No results provided" });
        }

        let errorMessages = [];
        let successCount = 0;

        for (const result of results) {
            const { registration_number, batch, qpcode, title, score, totalscore } = result;

          
            if (!registration_number || !batch || !qpcode || !title || score === undefined || totalscore === undefined) {
                errorMessages.push(`Missing required fields for ${registration_number}`);
                continue;
            }

            const percentage = ((score / totalscore) * 100).toFixed(2) + "%";

           
            const student = await StudentModel.findOne({ registration_number });

            if (!student) {
                errorMessages.push(`Student ${registration_number} not found`);
                continue;
            }

       
            const existingResult = student.results.find(r => r.qpcode === qpcode);
            if (existingResult) {
                errorMessages.push(`Result already published for ${registration_number} (QP Code: ${qpcode})`);
                continue;
            }

           
            student.results.push({
                registration_number,
                batch,
                qpcode,
                title,
                score,
                totalscore,
                percentage,
                published: true,
                publishedAt: new Date(),
            });

            await student.save();
            successCount++;
        }

        
        const responseMessage = {
            message: `Results published successfully for ${successCount} students`,
            errors: errorMessages.length > 0 ? errorMessages : null,
        };

        res.status(200).json(responseMessage);
    } catch (error) {
        console.error("Error publishing multiple results:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/delete-multiple-results", async (req, res) => {
    try {
        const { results } = req.body;

        if (!results || results.length === 0) {
            return res.status(400).json({ message: "No records provided for deletion" });
        }

        let notFound = [];
        let deletedCount = 0;
        let answerNotFound = [];
        let deletionErrors = [];

        for (const result of results) {
            const { registration_number, qpcode } = result;

            try {
               
                const student = await StudentModel.findOne({ registration_number });

                if (!student) {
                    notFound.push(registration_number);
                    continue;
                }

              
                student.results = student.results.filter(r => r.qpcode !== qpcode);
                await student.save();
                deletedCount++;

               
                const answerRecord = await AnswerModel.findOne({ registration_number: registration_number, qpcode: qpcode });

                if (!answerRecord) {
                    answerNotFound.push(registration_number);
                } else {
                    await AnswerModel.findOneAndDelete({ registration_number: registration_number, qpcode: qpcode });
                }
            } catch (err) {
                deletionErrors.push(`Error processing ${registration_number} - ${err.message}`);
            }
        }

        return res.status(200).json({
            message: `${deletedCount} records deleted successfully!`,
            studentsNotFound: notFound.length > 0 ? notFound : null,
            answersNotFound: answerNotFound.length > 0 ? answerNotFound : null,
            errors: deletionErrors.length > 0 ? deletionErrors : null
        });
    } catch (error) {
        console.error("Error deleting multiple results:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.get("/training-scores/:id", async (req, res) => {
    try {
      const studentScores = await StudentModel.findOne({ userId: req.params.id }).populate("userId");
      
      if (!studentScores) {
        return res.status(404).json({ message: "Student not found" });
      }
        
       

        res.json({results:studentScores.results});
    } catch (error) {
        console.error("Error fetching student training scores:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


router.get("/training-exams/:id", async (req, res) => {
    try {
        const studentData = await StudentModel.findOne({ userId: req.params.id })
            .populate("userId")
            .select("exams"); // Selecting only the 'exams' field

        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ exams: studentData.exams });
    } catch (error) {
        console.error("Error fetching student training scores:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


router.get("/view-answer-paper", async (req, res) => {
    try {
        const { registration_number, qpcode } = req.query;

      
        const studentAnswerData = await AnswerModel.findOne({ registration_number, qpcode });

        if (!studentAnswerData) {
            return res.status(404).json({ message: "Answer paper not found for this student." });
        }

        
        const answerKeyData = await AnswerKeyModel.findOne({ qpcode });

        if (!answerKeyData || !answerKeyData.answerKey) {
            return res.status(404).json({ message: "Answer key not found for this question paper." });
        }

       
        const questionPaper = await QpModel.findOne({ qpcode });

        if (!questionPaper || !questionPaper.questions) {
            return res.status(404).json({ message: "Question paper not found." });
        }

     
        const comparedAnswers = studentAnswerData.answers.map((item, index) => {
            const correctAnswerObj = answerKeyData.answerKey.find(q => 
                String(q.QuestionNo) === String(item.QuestionNo || item.question)
            );

           
            const questionData = questionPaper.questions[index];  

            return {
                QuestionNo: item.QuestionNo || index + 1,
                question: questionData ? questionData.question : "Question not available",
                options: questionData ? questionData.options : ["Options not available"],
                studentAnswer: item.answer,
                correctAnswer: correctAnswerObj ? correctAnswerObj.Answer : "N/A",
                isCorrect: correctAnswerObj ? item.answer === correctAnswerObj.Answer : false,
                marks: correctAnswerObj ? correctAnswerObj.marks : "0"
            };
        });

       
        res.json({
            registration_number: studentAnswerData.registration_number, 
            qpcode: studentAnswerData.qpcode,
            title: studentAnswerData.title,
            answers: comparedAnswers,
            score: studentAnswerData.score,
            totalscore: studentAnswerData.totalscore
        });

    } catch (error) {
        console.error("Error fetching answer paper:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get("/placements/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const student = await StudentModel.findById(id);
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.status(200).json({ placement_announce: student.placement_announce });
    } catch (error) {
      console.error("Error fetching placement announcements:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  

  router.get("/texts", getTexts);
  router.post("/add-text", addText);
  router.delete("/delete-text/:id", deleteTextById);

  router.post("/placementuploadcsv", async (req, res) => {
    try {
      const csvData = req.body; 
  
    
      for (const row of csvData) {
        const {
          registration_number,
          offerno,
          company,
          package: pkg,
          designation,
          offertype,
        } = row;
  
        
        const student = await StudentModel.findOne({ registration_number });
  
        if (student) {
          
          const newOffer = {
            offerno,
            company,
            package: pkg,
            designation,
            offertype,
          };
  
          
          student.offers.push(newOffer);
  
         
          await student.save();
        }
      }
  
      res.status(200).json({ message: "Placement details updated successfully!" });
    } catch (error) {
      console.error("Error updating offers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;

import express from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { addstudent, approveaddstudent,approvegetstudent,upload, getstudent, editstudent, deletestudent, uploadCSV,getonestudent
    ,postQuestionPaper,postSpecificQuestionPaper,
    toggleAutoPost,
    approveeditstudent,
    rejectStudent
} from '../controllers/studentcontroller.js';
import StudentModel from "../models/StudentModel.js"
import AnswerModel from '../models/AnswerModel.js'
import AnswerKeyModel from "../models/AnswerkeyModel.js";
import ApprovestudentModel from "../models/ApprovestudentModel.js";
import QpModel from "../models/QpModel.js";
import UUser from "../models/UUsers.js";

const router = express.Router();

router.post('/add', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), addstudent);
router.get('/', authMiddleware, getstudent);
router.get('/approved-students', approvegetstudent);
router.post('/approveadd', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), approveaddstudent);

router.put('/edit/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), editstudent);
router.put('/approveedit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), approveeditstudent);
router.post('/reject',rejectStudent)
router.get('/getstudents', getallstudents);
router.delete('/delete/:id', authMiddleware, deletestudent);
router.get('/getone/:id',getonestudent);
router.post('/uploadcsv',authMiddleware,upload.single("csvfile"),uploadCSV);


router.post('/autopost/:id', express.json(), toggleAutoPost);



router.post("/postquestionpaper/:qpcode", postQuestionPaper);
router.post("/postspecific", postSpecificQuestionPaper);




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

export default router;

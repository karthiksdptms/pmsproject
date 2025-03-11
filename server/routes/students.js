import express from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { addstudent, upload, getstudent, editstudent, deletestudent, uploadCSV,getonestudent
    ,postQuestionPaper,postSpecificQuestionPaper,
    toggleAutoPost,getallstudents
} from '../controllers/studentcontroller.js';
import StudentModel from "../models/StudentModel.js"
import AnswerModel from '../models/AnswerModel.js'

const router = express.Router();

router.post('/add', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), addstudent);
router.get('/', authMiddleware, getstudent);
router.get('/getstudents', getallstudents);

router.put('/edit/:id',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), editstudent);
router.delete('/delete/:id', authMiddleware, deletestudent);
router.get('/getone/:id',getonestudent);
router.post('/uploadcsv',authMiddleware,upload.single("csvfile"),uploadCSV);


router.post('/autopost/:id', express.json(), toggleAutoPost);



router.post("/postquestionpaper/:qpcode", postQuestionPaper);
router.post("/postspecific", postSpecificQuestionPaper);


router.post("/publish-result", async (req, res) => { 
    try {
        const { registration_number, batch, qpcode,title, score, totalscore } = req.body;

       
        if (!registration_number || !batch || !qpcode ||!title|| score === undefined || totalscore === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const percentage = ((score / totalscore) * 100).toFixed(2) + "%";

        const student = await StudentModel.findOne({ registration_number });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

       
        const existingResult = student.results.find(result => result.qpcode === qpcode);

        if (existingResult) {
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
            publishedAt: new Date(),
        });

        await student.save();

        res.status(200).json({ message: "Result published successfully!" });
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

        for (const result of results) {
            const { registration_number, batch, qpcode,title, score, totalscore } = result;

           
            if (!registration_number || !batch || !qpcode||!title || score === undefined || totalscore === undefined) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const percentage = ((score / totalscore) * 100).toFixed(2) + "%";

            const student = await StudentModel.findOne({ registration_number });

            if (!student) {
                return res.status(404).json({ message: `Student ${registration_number} not found` });
            }

           
            const existingResult = student.results.find(r => r.qpcode === qpcode);
            if (existingResult) {
                return res.status(409).json({ message: `Result already published for ${registration_number} (QP Code: ${qpcode})` });
            }

            student.results.push({
                registration_number,
                batch,
                qpcode,
                title,
                score,
                totalscore,
                percentage,
                publishedAt: new Date(),
            });

            await student.save();
        }

        res.status(200).json({ message: "Results published successfully!" });
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







  
export default router;

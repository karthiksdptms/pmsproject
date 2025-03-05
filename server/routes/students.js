import express from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { addstudent, upload, getstudent, editstudent, deletestudent, uploadCSV,getonestudent
    ,postQuestionPaper,postSpecificQuestionPaper,
    toggleAutoPost
} from '../controllers/studentcontroller.js';

const router = express.Router();

router.post('/add', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), addstudent);
router.get('/', authMiddleware, getstudent);
router.put('/edit/:id',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'offerpdf', maxCount: 1 }]), editstudent);
router.delete('/delete/:id', authMiddleware, deletestudent);
router.get('/getone/:id', authMiddleware,getonestudent);
router.post('/uploadcsv',authMiddleware,upload.single("csvfile"),uploadCSV);


router.post('/autopost/:id', express.json(), toggleAutoPost);



router.post("/postquestionpaper/:qpcode", postQuestionPaper);
router.post("/postspecific", postSpecificQuestionPaper);




  
export default router;

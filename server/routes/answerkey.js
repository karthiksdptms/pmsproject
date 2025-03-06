import express from 'express'
import { uploadanswerkey } from '../controllers/answerkeycontroller.js';
import AnswerKeyModel from '../models/AnswerkeyModel.js';
import QpModel from '../models/QpModel.js';
import { submitAnswers } from '../controllers/answerkeycontroller.js';

const router = express.Router()

router.post('/uploadanswerkey/:qpcode',uploadanswerkey)

router.post("/submitans", submitAnswers);


router.get("/getuploadedanswerkeys", async (req, res) => {
    try {
      const uploadedKeys = await AnswerKeyModel.find({}, "qpcode");
      res.status(200).json(uploadedKeys);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });


router.get("/check-qpcode/:qpcode", async (req, res) => {
  try {
    const { qpcode } = req.params;
    const existingQp = await QpModel.findOne({ qpcode });
    if (existingQp) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
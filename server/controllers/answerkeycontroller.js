import AnswerKeyModel from '../models/AnswerkeyModel.js';
import QpaperModel from '../models/QpModel.js';

import AnswerModel from "../models/AnswerModel.js";
import StudentModel from "../models/StudentModel.js";


const uploadanswerkey = async (req, res) => {
  const { answerKey } = req.body;
  const { qpcode } = req.params;

  try {
   
    const existingKey = await AnswerKeyModel.findOne({ qpcode });

    if (existingKey) {
      return res.status(400).json({ message: "Answer key already uploaded for this question paper." });
    }

   
    const questionPaper = await QpaperModel.findOne({ qpcode });

    if (!questionPaper) {
      return res.status(404).json({ message: "Question Paper Not Found" });
    }

 
    const mappedAnswerKey = answerKey.map((key) => {
      const question = questionPaper.questions.find((q, index) => index + 1 === parseInt(key.QUESTIONS));

      return {
        QuestionNo: parseInt(key.QUESTIONS),
        Answer: key.ANSWERS,
        marks: question ? question.marks : 0,
      };
    });

   
    const totalScore = mappedAnswerKey.reduce((acc, item) => acc + item.marks, 0);

    
    const newAnswerKey = new AnswerKeyModel({
      qpcode: qpcode,
      answerKey: mappedAnswerKey,
      score: totalScore,
    });

    await newAnswerKey.save();

    res.status(200).json({
      message: "Answer Key Uploaded Successfully",
      data: newAnswerKey,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const submitAnswers = async (req, res) => {
  const { userId, qpcode, title, answers } = req.body;

  try {
    if (!userId || !qpcode || !answers || !title) {
      return res.status(400).json({ message: "Invalid Data" });
    }

   
    const [student, answerKey, questionPaper] = await Promise.all([
      StudentModel.findOne({ userId }),
      AnswerKeyModel.findOne({ qpcode }),
      QpaperModel.findOne({ qpcode }),
    ]);

    if (!student) return res.status(404).json({ message: "Student Not Found" });
    if (!answerKey) return res.status(404).json({ message: "Answer Key Not Found" });
    if (!questionPaper) return res.status(404).json({ message: "Question Paper Not Found" });

  
    const existingAnswer = await AnswerModel.findOne({
      registration_number: student.registration_number,
      qpcode: qpcode,
    });

    if (existingAnswer) {
      return res.status(409).json({ message: "Answers already submitted for this exam" });
    }

    const negativeMarking = questionPaper.negativeMarking === "Yes";

    let score = 0;
    let totalScore = 0;

    const questionMarksMap = new Map();
    answerKey.answerKey.forEach((key) => {
      questionMarksMap.set(key.QuestionNo, parseInt(key.marks) || 1); 
      totalScore += parseInt(key.marks) || 1;
    });

    answers.forEach((answer) => {
      const correctAnswer = answerKey.answerKey.find((key) => key.QuestionNo === answer.question);

      if (correctAnswer) {
        const marks = questionMarksMap.get(answer.question) || 1; 
        if (correctAnswer.Answer === answer.answer) {
          score += marks;
        } else if (negativeMarking) {
          score -= 1;
        }
      }
    });

    score = Math.max(0, score); 

    const newAnswer = new AnswerModel({
      registration_number: student.registration_number,
      batch: student.batch,
      department: student.department,
      qpcode,
      title,
      answers,
      score,
      totalscore: totalScore,
    });

   
    student.exams = student.exams.filter((exam) => exam.qpcode !== qpcode);
    await Promise.all([student.save(), newAnswer.save()]);

    res.status(200).json({ message: "Answers Submitted Successfully" });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getscores = async (req, res) => {
  try {
    const answers = await AnswerModel.find(); 
    res.status(200).json(answers); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers", error });
  }
}

export { uploadanswerkey };

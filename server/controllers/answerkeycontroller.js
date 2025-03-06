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
  const { userId, qpcode, answers } = req.body;


  try {
    if (!userId || !qpcode || !answers) {
     
      return res.status(400).json({ message: "Invalid Data" });
    }

    const student = await StudentModel.findOne({ userId: userId });
   

    if (!student) {
      
      return res.status(404).json({ message: "Student Not Found" });
    }

    const answerKey = await AnswerKeyModel.findOne({ qpcode });
    

    if (!answerKey) {
    
      return res.status(404).json({ message: "Answer Key Not Found" });
    }

    let score = 0;

    answers.forEach((answer) => {
      

      const correctAnswer = answerKey.answerKey.find(
        (key) => key.QuestionNo === answer.question
      );

      

      if (correctAnswer && correctAnswer.Answer === answer.answer) {
        score += parseInt(answer.marks);
        
      }
    });

    

    const newAnswer = new AnswerModel({
      registration_number: student.registration_number,
      batch: student.batch,
      department: student.department,
      qpcode: qpcode,
      answers: answers,
      score: score,
    });

    student.exams = student.exams.filter((exam) => exam.qpcode !== qpcode);
    await student.save();

    await newAnswer.save();

    res.status(200).json({
      message: "Answers Submitted Successfully",
      score: score,
    });
  } catch (err) {
    console.error("Server Error ❌:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export { uploadanswerkey };

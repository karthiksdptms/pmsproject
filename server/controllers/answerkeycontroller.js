import AnswerKeyModel from '../models/AnswerkeyModel.js';
import QpaperModel from '../models/QpModel.js';

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

    // Save Answer Key
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

export { uploadanswerkey };

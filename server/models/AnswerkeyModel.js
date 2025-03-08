import mongoose from 'mongoose';

const AnswerKeySchema = new mongoose.Schema({
  qpcode: {
    type: String,
    required: true, 
  },
  answerKey: [
    {
      QuestionNo: {
        type: Number,
        required: true, 
      },
      Answer: {
        type: String,
        required: true,
      },
      marks: {
        type: String,
        required: true,
      }
    },
   
  ],
  score: {
    type: Number,
    required: true, 
  },
});

const AnswerKeyModel = mongoose.model("QpaperAnswerKeys", AnswerKeySchema);

export default AnswerKeyModel

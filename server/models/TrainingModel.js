import mongoose from "mongoose"
const trSchema=new mongoose.Schema({
    trtype: String,
    trainee: String,
    fromdate: {type: Date,default:Date.now},
    todate:  {type: Date, default:Date.now},
    duration: String,
    batch: String,
    department: String,
    participated: Number,
})

const TrainingModel = mongoose.model("trainingdatatables", trSchema);
export default TrainingModel;
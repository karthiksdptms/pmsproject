import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js"
import dotenv from "dotenv";
dotenv.config();
import connectDatabase from "./db/db.js";
import FilterModel from "./models/FilterModel.js";
import QpModel from "./models/QpModel.js";
import TrainingModel from './models/TrainingModel.js'
import mongoose from "mongoose";


connectDatabase();

const app = express();
app.use(cors(
  {
    origin:["https://pmsproject-pm.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
  }
));
app.options("*", cors());

app.use(express.json());
app.use('/api/auth',authRouter);

//filtertable
app.get("/getstudents", async (req, res) => {
  try {
    const students = await FilterModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//aptitudeqpaper
app.put('/updateqp/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updatedPaper = await QpModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedPaper) {
          return res.status(404).json({ message: "Paper not found" });
      }
      res.json(updatedPaper);
  } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addqp", (req, res) => {
  QpModel.create(req.body)
  .then(qpapers =>res.json(qpapers) )
  .catch(err => res.json(err));
})

app.get("/getqp",(req,res)=>{
  QpModel.find({})
  .then(qpapers => res.json(qpapers))
  .catch(err => res.json(err));

})


app.delete("/delqp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await QpModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting record" });
  }
});

//training

app.get('/',(req,res) =>{
  TrainingModel.find({})
  .then(trainingdatatables => res.json(trainingdatatables))
  .catch(err => res.json(err));
})


app.post("/createUser", (req, res) => {
  TrainingModel.create(req.body)
      .then(trainingdatatables => res.json(trainingdatatables))
      .catch(err => res.json(err));
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TrainingModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting record" });
  }
});


app.put("/updateUser/:id", async (req, res) => {
try {
  const updatedTraining = await TrainingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTraining);
} catch (error) {
  res.status(500).json({ error: "Update failed" });
}
});




app.listen(process.env.PORT, () => {
  console.log("server is running ");
});

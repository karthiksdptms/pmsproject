import StudentModel from "../models/StudentModel.js";
import User from "../models/User.js";
import QpModel from "../models/QpModel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import csv from 'csv-parser';
import fs from 'fs';
import ApprovestudentModel from "../models/ApprovestudentModel.js";
import UUser from "../models/UUsers.js";
import mongoose from "mongoose";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addstudent = async (req, res) => {
  try {
    const {
      registration_number,
      name,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      email,
      password,
      role,
      address,
      phoneno,
      placement,
      offers,
     
    } = req.body;

   
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered in database" });
    }

   
    const hashpassword = await bcrypt.hash(password, 10);

    const resume = req.files?.resume ? req.files.resume[0].filename : null;
    const offerpdf = req.files?.offerpdf ? req.files.offerpdf[0].filename : null;

  
    const finalOffers = Array.isArray(offers) ? offers : [];
    
    const profileImage = req.files?.image ? req.files.image[0].filename : null;

    const newuser = new User({
      name,
      email,
      password: hashpassword,
      role,
      profileImage
      
    });

    const savedUser =await newuser.save();

    
    const student = new StudentModel({
        userId:savedUser._id.toString(),
      registration_number,
      name:savedUser.name,
      email:savedUser.email,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      email,
      address,
      phoneno,
      resume,
      profileImage,
      placement,
      offers: finalOffers,
      offerpdf
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error  , Failed to Add Student",
    });
  }
};
export const approveaddstudent = async (req, res) => {
  try {
    const {
      registration_number,
      name,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      email,
      password,
      role,
      address,
      phoneno,
      placement,
      offers,
      expassword,
     
    } = req.body;

   
    const user = await UUser.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered in database" });
    }

   
    const hashpassword = await bcrypt.hash(password, 10);

    const resume = req.files && req.files["resume"] ? req.files["resume"][0].filename : null;
const offerpdf = req.files && req.files["offerpdf"] ? req.files["offerpdf"][0].filename : null;
const profileImage = req.files && req.files["image"] ? req.files["image"][0].filename : null;


  
    const finalOffers = Array.isArray(offers) ? offers : [];

    const newuser = new UUser({
      name,
      email,
      password: hashpassword,
      role,
      profileImage
      
    });

    const savedUser =await newuser.save();

    
    const student = new ApprovestudentModel({
        userId:savedUser._id.toString(),
      registration_number,
      name:savedUser.name,
      email:savedUser.email,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      email,
      address,
      phoneno,
      resume,
      profileImage,
      placement,
      offers: finalOffers,
      offerpdf,
      expassword:password,
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error  , Failed to Add Student",
    });
  }
};

export const getallstudents = async (req, res) => {
  try {
      const students = await StudentModel.find(); 
      res.status(200).json({ students });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

const getstudent =async (req, res) => {
  try{
    const students=await StudentModel.find().populate('userId')
    res.status(200).json({success:true,students})

  }catch(error){
    return res.status(500).json({success: false,error:"get students server error"})
  }
}
export const approvegetstudent =async (req, res) => {
    try {
      const students = await ApprovestudentModel.find().populate('userId')
      res.status(200).json({success:true,students})
    } catch (error) {
      res.status(500).json({ message: "Error fetching approved students", error });
    }
  };
  const getonestudent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received ID:", id); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        let student = await StudentModel.findById(id).populate("userId", "-password");

        if (!student) {
            student = await StudentModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).populate("userId", "-password");
        }

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, student });
    } catch (error) {
        console.error("Get Student Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



const editstudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      registration_number,
      name,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      email,
      address,
      phoneno,
      placement,
      offers,
      role,
      password
    } = req.body;

   
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    
    const profileImage = req.files?.image ? req.files.image[0].filename : student.profileImage;
    const resume = req.files?.resume ? req.files.resume[0].filename : student.resume;
    const offerpdf = req.files?.offerpdf ? req.files.offerpdf[0].filename : student.offerpdf;

    const finalOffers = offers ? (typeof offers === "string" ? JSON.parse(offers) : offers) : student.offers;

   
    let hashpassword = student.password; 
    if (password) {
      hashpassword = await bcrypt.hash(password, 10);
    }

  
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      {
        registration_number,
        name,
        department,
        batch,
        sslc,
        hsc,
        diploma,
        sem1,
        sem2,
        sem3,
        sem4,
        sem5,
        sem6,
        sem7,
        sem8,
        cgpa,
        arrears,
        hoa,
        internships,
        certifications,
        patentspublications,
        achievements,
        language,
        aoi,
        email,
        address,
        phoneno,
        placement,
        offers: finalOffers,
        profileImage,
        resume,
        offerpdf,
      },
      { new: true }
    );

    
    await User.findByIdAndUpdate(
      student.userId,
      {
        name,
        ...(password && { password: hashpassword }), 
        role,
        profileImage,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error("Edit Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, Failed to Edit Student",
    });
  }
};
export const approveeditstudent = async (req, res) => {
  try {
    const { email, registration_number } = req.body;

    const {
      name,
      department,
      batch,
      sslc,
      hsc,
      diploma,
      sem1,
      sem2,
      sem3,
      sem4,
      sem5,
      sem6,
      sem7,
      sem8,
      cgpa,
      arrears,
      hoa,
      internships,
      certifications,
      patentspublications,
      achievements,
      language,
      aoi,
      address,
      phoneno,
      placement,
      offers,
      role,
      password,
    } = req.body;

  
    const student = await StudentModel.findOne({ registration_number });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

  
    const pendingStudent = await ApprovestudentModel.findOne({ registration_number });
    console.log("Pending Student Data from ApprovestudentModel:", pendingStudent);

  
    const profileImage = 
      req.files?.image && req.files.image.length > 0
        ? req.files.image[0].filename  
        : pendingStudent?.profileImage 
        ? pendingStudent.profileImage
        : student.profileImage; 

    
    const resume = 
      req.files?.resume && req.files.resume.length > 0
        ? req.files.resume[0].filename
        : pendingStudent?.resume
        ? pendingStudent.resume
        : student.resume;

    const offerpdf = 
      req.files?.offerpdf && req.files.offerpdf.length > 0
        ? req.files.offerpdf[0].filename
        : pendingStudent?.offerpdf
        ? pendingStudent.offerpdf
        : student.offerpdf;

    const finalOffers = offers
      ? typeof offers === "string"
        ? JSON.parse(offers)
        : offers
      : student.offers;

    
    const updatedStudent = await StudentModel.findOneAndUpdate(
      { registration_number },
      {
        name,
        department,
        batch,
        sslc,
        hsc,
        diploma,
        sem1,
        sem2,
        sem3,
        sem4,
        sem5,
        sem6,
        sem7,
        sem8,
        cgpa,
        arrears,
        hoa,
        internships,
        certifications,
        patentspublications,
        achievements,
        language,
        aoi,
        address,
        phoneno,
        placement,
        offers: finalOffers,
        profileImage, 
        resume,
        offerpdf,
      },
      { new: true }
    );

    console.log("Updated Student Data in StudentModel:", updatedStudent);

   
    const hashpassword = password ? await bcrypt.hash(password, 10) : student.password;

   
    await User.findOneAndUpdate(
      { email },
      {
        name: name,
        password: hashpassword,
        role: role,
        profileImage: profileImage,
      },
      { new: true }
    );

    
    await ApprovestudentModel.findOneAndDelete({ registration_number });
    await UUser.findOneAndDelete({ email });

   
    res.status(200).json({
      success: true,
      message: "Student and User updated successfully, and record deleted from approval data",
      updatedStudent,
    });
  } catch (error) {
    console.error("Edit Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, Failed to Edit Student",
    });
  }
};






export const deletestudent = async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

   
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { email, profileImage, resume, offerpdf } = student;

   
    const deleteFile = (fileName) => {
      if (fileName) {
        const filePath = path.join("uploads", fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    };

    deleteFile(profileImage);
    deleteFile(resume);
    deleteFile(offerpdf);

   
    await StudentModel.findByIdAndDelete(id);

   
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      console.warn(`User with email ${email} not found in User collection`);
    }

    res.status(200).json({ message: "Student and associated user deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }

};



export const rejectStudent = async (req, res) => {
  try {
    const { email } = req.body;

    
    const deletedStudent = await ApprovestudentModel.findOneAndDelete({ email })&& await UUser.findOneAndDelete({email})

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found in approval data" });
    }

    res.status(200).json({
      success: true,
      message: "Student successfully rejected and removed from approval data",
    });
  } catch (error) {
    console.error("Reject Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, Failed to Reject Student",
    });
  }
};



const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No CSV file uploaded" });
    }

    const results = [];
    const csvFilePath = req.file.path;

   
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          for (const row of results) {
            const {
              registration_number,
              name,
              department,
              batch,
              sslc,
              hsc,
              diploma,
              sem1,
              sem2,
              sem3,
              sem4,
              sem5,
              sem6,
              sem7,
              sem8,
              cgpa,
              arrears,
              hoa,
              internships,
              certifications,
              patentspublications,
              achievements,
              language,
              aoi,
              email,
              address,
              phoneno,
              placement,
              offers,
              role,
              password
          
            } = row;

           
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              console.log(`User ${email} already exists`);
              continue; 
            }

         
            const hashedPassword = await bcrypt.hash(password, 10);

           
            const newUser = new User({
              name,
              email,
              password: hashedPassword,
              role,
              profileImage:""
            });

            const savedUser = await newUser.save();
            const finalOffers = offers ? (typeof offers === "string" ? JSON.parse(offers) : offers) : student.offers;

          
            const student = new StudentModel({
              userId: savedUser._id.toString(),
              registration_number,
              name:savedUser.name,
              email:savedUser.email,
              department,
              batch,
              sslc,
              hsc,
              diploma,
              sem1,
              sem2,
              sem3,
              sem4,
              sem5,
              sem6,
              sem7,
              sem8,
              cgpa,
              arrears,
              phoneno,
              address,
              hoa,
              internships,
              certifications,
              patentspublications,
              achievements,
              language,
              aoi,
             
              address,
              phoneno,
              placement,
              offers: finalOffers,
            });

            await student.save();
          }

          res.status(200).json({
            success: true,
            message: "CSV Data Uploaded Successfully",
          });
        } catch (err) {
          console.error("CSV Upload Error:", err);
          res.status(500).json({
            success: false,
            message: "Server Error, Failed to Upload CSV",
          });
        }
      });
  } catch (error) {
    console.error("CSV Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

export const toggleAutoPost = async (req, res) => {
  const { id } = req.params; 
  const { autoPost } = req.body; 

  console.log("Auto Post Request - QP Code:", id, "New Status:", autoPost);

  try {
    const questionPaper = await QpModel.findOne({ qpcode: id });

    if (!questionPaper) {
      console.log("Question Paper not found:", id);
      return res.status(404).json({ message: "Question Paper not found" });
    }

    questionPaper.autoPost = autoPost;

    await questionPaper.save({ validateBeforeSave: false });

    console.log("Auto Post Updated Successfully:", autoPost);
    res.status(200).json({ message: `Auto Post ${autoPost ? "Enabled" : "Disabled"} Successfully` });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const postQuestionPaper = async (req, res) => {
  const { qpcode } = req.params;

  try {
    const questionPaper = await QpModel.findOne({ qpcode });
    if (!questionPaper) {
      return res.status(404).json({ message: "Question Paper Not Found" });
    }

    const { department, batch } = questionPaper;

    const students = await StudentModel.find({ department: department, batch: batch });

    if (students.length === 0) {
      return res.status(404).json({ message: "No Students Found for this Department and Batch" });
    }

    for (const student of students) {
      student.exams = student.exams || [];

     
      const isDuplicate = student.exams.some((exam) => exam.qpcode === questionPaper.qpcode);

      if (!isDuplicate) {
        student.exams.push({
          qpcode: questionPaper.qpcode,
          title: questionPaper.title,
          academicYear: questionPaper.academicYear,
          department: questionPaper.department,
          batch: questionPaper.batch,
          negativeMarking:questionPaper.negativeMarking,
          examDate: questionPaper.examDate,
          startTime: questionPaper.startTime,
          endTime: questionPaper.endTime,
          semesterType: questionPaper.semesterType,
          questions: questionPaper.questions.map(({ question, options, marks }) => ({
            question,
            options,
            marks,
          })),
        });
        await student.save(); 
      }
    }

    res.status(200).json({ message: "Question Paper Posted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const postSpecificQuestionPaper = async (req, res) => {
  const { registerNumbers, qpcode } = req.body;

  try {
    const questionPaper = await QpModel.findOne({ qpcode });

    if (!questionPaper) {
      return res.status(404).json({ message: "Question Paper Not Found" });
    }

    const { department, batch } = questionPaper;

    console.log("Input Register Numbers:", registerNumbers);
    console.log("Converted Numbers:", registerNumbers.map((reg) => String(reg)));

    const students = await StudentModel.find({
      registration_number: { $in: registerNumbers.map((reg) => String(reg)) },
      department,
      batch,
    });

    console.log("Students Found:", students);

    if (students.length === 0) {
      return res.status(404).json({ message: "No Students Found with Given Register Numbers" });
    }

    for (const student of students) {
      student.exams = student.exams || [];

     
      const alreadyPosted = student.exams.some((exam) => exam.qpcode === qpcode);

      if (!alreadyPosted) {
        student.exams.push({
          qpcode: questionPaper.qpcode,
          title: questionPaper.title,
          academicYear: questionPaper.academicYear,
          department: questionPaper.department,
          batch: questionPaper.batch,
          negativeMarking:questionPaper.negativeMarking,
          examDate: questionPaper.examDate,
          startTime: questionPaper.startTime,
          endTime: questionPaper.endTime,
          semesterType: questionPaper.semesterType,
          questions: questionPaper.questions.map(({ question, options, marks }) => ({
            question,
            options,
            marks,
          })),
        });

        await student.save();
        console.log(`Posted to: ${student.registration_number}`);
      } else {
        console.log(`Already Posted to: ${student.registration_number}`);
      }
    }

    res.status(200).json({ message: "Question Paper Posted to Specific Students Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { addstudent, upload ,getstudent,editstudent,uploadCSV,getonestudent,postSpecificQuestionPaper};

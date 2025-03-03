import StudentModel from "../models/StudentModel.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import csv from 'csv-parser';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
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

const getstudent =async (req, res) => {
  try{
    const students=await StudentModel.find().populate('userId')
    res.status(200).json({success:true,students})

  }catch(error){
    return res.status(500).json({success: false,error:"get students server error"})
  }
}
const getonestudent = async (req, res) => {
  try {
    const { id } = req.params; 
    const student = await StudentModel.findOne({ userId: id }).populate("userId");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });

  } catch (error) {
    console.error("Get Student Error:", error);
    return res.status(500).json({ success: false, error: "Get student server error" });
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
      role,password
    } = req.body;

    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

   
    const profileImage = req.files?.image ? req.files.image[0].filename : student.profileImage;

    
    const resume = req.files?.resume ? req.files.resume[0].filename : student.resume;

    const offerpdf = req.files?.offerpdf ? req.files.offerpdf[0].filename : student.offerpdf;
    const finalOffers = offers ? (typeof offers === "string" ? JSON.parse(offers) : offers) : student.offers;


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
 
    const hashpassword = await bcrypt.hash(password, 10);
  
    await User.findByIdAndUpdate(
      student.userId,
      {
        name: name,
        password:hashpassword,
        role:role,
        profileImage: req.files?.image ? req.files.image[0].filename : student.profileImage // This will update the image properly
      },
      { new: true }
    )
    
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      updatedStudent,
    })
  } catch (error) {
    console.error("Edit Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, Failed to Edit Student",
    })
  }
}

export const deletestudent = async (req, res) => {
  try {
    const student = await StudentModel.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}



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


export { addstudent, upload ,getstudent,editstudent,uploadCSV,getonestudent};

import express from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});


router.get("/get-admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin users" });
  }
});

const upload = multer({ storage });

router.post(
  "/add-admin",
  upload.single("profileImage"), 
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

     
      const hashpassword = await bcrypt.hash(password, 10);

      
      const profileImage = req.file ? req.file.filename : null;

    
      const newUser = new User({
        name,
        email,
        password: hashpassword,
        role,
        profileImage, 
      });

     
      await newUser.save();
      res.status(201).json({ message: "User added successfully" });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ message: "Error adding user", error });
    }
  }
);


router.delete("/delete-admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;

  
    const deletedAdmin = await User.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }


    if (deletedAdmin.profileImage) {
      const fs = await import("fs"); 
      const imagePath = `./public/uploads/${deletedAdmin.profileImage}`;

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); 
      }
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Error deleting admin", error });
  }
});


router.put(
  "/edit-admin/:id",
  upload.single("profileImage"), 
  async (req, res) => {
    try {
      const adminId = req.params.id;
      const { name, email, role, password } = req.body;

     
      let profileImage = req.file ? req.file.filename : null;

    
      const existingAdmin = await User.findById(adminId);
      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

     
      if (profileImage && existingAdmin.profileImage) {
        const fs = await import("fs");
        const imagePath = `./public/uploads/${existingAdmin.profileImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      
      if (!profileImage) {
        profileImage = existingAdmin.profileImage;
      }

      let hashedPassword = existingAdmin.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      
      const updatedAdmin = await User.findByIdAndUpdate(
        adminId,
        {
          name,
          email,
          role,
          password: hashedPassword,
          profileImage,
        },
        { new: true }
      );

      res.status(200).json({ message: "Admin updated successfully", updatedAdmin });
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ message: "Error updating admin", error });
    }
  }
);

export default router;

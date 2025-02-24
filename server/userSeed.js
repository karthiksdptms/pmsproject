import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectDatabase from './db/db.js'

const userRegister = async () =>{
    connectDatabase()
    try{
        const hashPassword =await bcrypt.hash("Admin@123",10)
        const newUser=new User({
            name:"Admin",
            email:"Admin@gmail.com",
            password: hashPassword,
            role:"admin"
        })
        await newUser.save()
    }catch(error){
console.log(error)
    }
}


userRegister();
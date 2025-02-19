const Student = require('../../../models/StudentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const Course =require('../../../models/CourseModel');


module.exports.loginStudent = async (req,res)=>{
    try{
        let checkMail = await Student.findOne({email : req.body.email});
        if(checkMail){
            let checkPass =  await bcrypt.compare(req.body.password , checkMail.password);
            if(checkPass){
                checkMail = checkMail.toObject();
                delete checkMail.password;
                let studentToken  = jwt.sign({studentToken : checkMail},'SRNW',{expiresIn:'1h'});
                return res.status(200).json({ msg: "Login Successfully", Token: studentToken });
            }
            else{
                return res.status(400).json({ msg: "Invalid Password" });
            }
        }
        else{
            return res.status(400).json({ msg: "Email not exist"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.studentProfile = async (req,res)=>{
    try {
        return res.status(200).json({ msg: "Student Profile Found Successfully", FacultyData: req.user });
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.editStudentProfile = async (req,res)=>{
    try{
        console.log(req.body);
        console.log(req.params.id);
        let checkStudent = await Student.findById(req.params.id);
        if(checkStudent){
            let updateStudent = await Student.findByIdAndUpdate(req.params.id,req.body);
            if(updateStudent){
                let updatedStudentData = await Student.findById(req.params.id);
                return res.status(200).json({ msg: "Student Found And Updated" , data : updatedStudentData });
            }
            else{
                return res.status(400).json({ msg: "Student not Found" });
            }
        }
        else{
            return res.status(400).json({ msg: "Student not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.changeStudentPassword = async (req,res)=>{
    try{
        let checkCurrentPass = await bcrypt.compare(req.body.oldPass , req.user.password);
        if(checkCurrentPass){
            if(req.body.oldPass != req.body.newPass){
                if(req.body.newPass == req.body.ConfirmPass){
                    req.body.password = await bcrypt.hash(req.body.newPass , 10);
                    let updatePass = await Student.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePass){
                        return res.status(200).json({ msg: "Password Updated",data : updatePass});
                    }
                    else{
                        return res.status(400).json({ msg: "Password not Updated"});
                    }
                }
                else{
                    return res.status(400).json({ msg: "Your New Password and Confirm password are not same"});
                }
            }
            else{
                return res.status(400).json({ msg: "Your New Password and Old password are Same"});
            }
        }
        else{
            return res.status(400).json({ msg: "Your password and Old password does not match"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.sendMail = async (req,res)=>{
    try{
        let checkMail = await Student.findOne({email : req.body.email});
        if(checkMail){

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "divupatel22199@gmail.com",
                  pass: "lapz vfgb vpqm lflg",
                },
                tls : {
                    rejectUnauthorized : false
                }
              });

              const otp = Math.round(Math.random()*10000);

              const info = await transporter.sendMail({
                from: 'divupatel22199@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Forget password otp", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Your Otp is :</b> <p>${otp}</p> `, // html body
              });

              const data = {
                email : req.body.email,
                otp : otp
              }

              if(info){
                  return res.status(200).json({msg : "Check your mail",data : data});
              }
              else{
                  return res.status(400).json({msg : "Something wrong to send mail"});
              }
        }
        else{
            return res.status(400).json({msg : "Email not exists"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.updateStudentPassword = async (req,res)=>{
    try{
        let checkMail = await Student.findOne({email : req.query.email});
        if(checkMail){
            if(req.body.newPass == req.body.confirmPass){
                req.body.password = await bcrypt.hash(req.body.newPass,10);
                let updatePass = await Student.findByIdAndUpdate(checkMail._id,req.body);
                if(updatePass){
                    return res.status(200).json({ msg: "Password Updated " ,data:updatePass});
                } 
                else{
                    return res.status(400).json({ msg: "Password not Updated"});
                }
            }
            else{
                return res.status(400).json({ msg: "New password and Confirm password not match"});
            }
        }
        else{
            return res.status(400).json({ msg: "Email is not exists"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.viewCourse = async (req,res)=>{
    try{
        let AllCourse = await Course.find();
        if(AllCourse){
            return res.status(200).json({ msg: "Course Data found",data:AllCourse});
        }
        else{
            return res.status(400).json({ msg: "Course Data not found"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}
const Faculty = require('../../../models/FacultyModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const Student = require('../../../models/StudentModel');
const Course = require('../../../models/CourseModel');

module.exports.facultyLogin = async (req, res) => {
    try {
        let checkMail = await Faculty.findOne({ email: req.body.email });
        if (checkMail) {
            let checkPass = await bcrypt.compare(req.body.password, checkMail.password);
            if (checkPass) {
                checkMail = checkMail.toObject();
                delete checkMail.password;
                let facultyToken = jwt.sign({ facultyToken: checkMail }, 'FRNW', { expiresIn: '1h' });
                return res.status(200).json({ msg: "Login Successfully", Token: facultyToken });
            }
            else {
                return res.status(400).json({ msg: "Invalid Password" });
            }
        }
        else {
            return res.status(400).json({ msg: "Invalid Email" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.facultyProfile = async (req, res) => {
    try {
        return res.status(200).json({ msg: "Faculty Profile Found Successfully", FacultyData: req.user });
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.editfacultyProfile = async (req, res) => {
    try {
        let checkfaculty = await Faculty.findById(req.params.id);
        if (checkfaculty) {
            let updateFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body);
            if (updateFaculty) {
                let updatedFacultyData = await Faculty.findById(req.params.id);
                if (updatedFacultyData) {
                    return res.status(400).json({ msg: "Faculty updated data found", data: updatedFacultyData });
                }
                else {
                    return res.status(400).json({ msg: "Faculty updated data not found" });
                }
            }
            else {
                return res.status(400).json({ msg: "Faculty not updated" });
            }
        }
        else {
            return res.status(400).json({ msg: "Faculty not found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.changeFacultyPass = async (req, res) => {
    try {
        let checkCurrentFacultyPass = await bcrypt.compare(req.body.oldPassword, req.user.password);
        if (checkCurrentFacultyPass) {
            if (req.body.oldPassword != req.body.newPassword) {
                if (req.body.newPassword == req.body.ConfirmPassword) {
                    req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                    let updatePass = await Faculty.findByIdAndUpdate(req.user._id, req.body);
                    if (updatePass) {
                        return res.status(200).json({ msg: "Password updated successfully" });
                    }
                    else {
                        return res.status(400).json({ msg: "Password not updated" });
                    }
                }
                else {
                    return res.status(400).json({ msg: "New Password and Confirm Password not Matches" });
                }
            }
            else {
                return res.status(400).json({ msg: "Old Password and New Password Matches" });
            }
        }
        else {
            return res.status(400).json({ msg: "Current Password and Old Password not Matches" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.sendMail = async (req, res) => {
    try {
        let checkEmail = await Faculty.findOne({ email: req.body.email });
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "divupatel22199@gmail.com",
                    pass: "gtma soun wcbc oatn",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let otp = Math.round(Math.random() * 10000);

            const info = await transporter.sendMail({
                from: 'divupatel22199@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "otp verification", // Subject line
                text: "Hello world?", // plain text body
                html: `Your Otp is : ${otp}`, // html body
            });

            const data = {
                email: req.body.email,
                otp: otp
            }

            if (info) {
                return res.status(200).json({
                    msg: "Mail send successfully",
                    data: data
                })
            }
            else {
                return res.status(200).json({
                    msg: "Something wrong to send mail"
                })
            }

        }
        else {
            return res.status(400).json({ msg: "Email not found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.updatePassword = async (req,res)=>{
    try{
        let checkMail = await Faculty.findOne({email:req.query.email});
        if(checkMail){
            if(req.body.newPass == req.body.confirmPass){
                req.body.password = await bcrypt.hash(req.body.newPass,10);
                let updatePass = await Faculty.findByIdAndUpdate(checkMail._id,req.body);
                if(updatePass){
                    return res.status(200).json({ msg: "Password Updated successfully",data : updatePass });
                }
                else{
                    return res.status(400).json({ msg: "Password not Updated" });
                }
            }
            else{
                return res.status(400).json({ msg: "New Password and Confirm Password not matches" });
            }
        }
        else{
            return res.status(400).json({ msg: "Email not found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.registerStudent = async (req,res)=>{
    try{
        let checkEmail = await Student.findOne({email : req.body.email});
        if(!checkEmail){
            var gpass = generatePassword();
            var link = 'http://localhost:8000/api/studentRegister';

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "divupatel22199@gmail.com",
                    pass: "gtma soun wcbc oatn",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: 'divupatel22199@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "your login detais", // Subject line
                text: "Hello world?", // plain text body
                html: `<h1>You are registerd successfully</h1> 
                <p>Here is your login details :</p>
                <p>your email : ${req.body.email}</p>
                <p>your username : ${req.body.username}</p>
                <p>your password :${gpass}</p>
                <p>your link to login :${link}</p>`, // html body
            });

            const data = {
                email: req.body.email,
                password: gpass,
                username: req.body.username
            }

            if (info) {
                let encGpass = await bcrypt.hash(gpass, 10);
                let AddStudent = await Student.create({ email: req.body.email, password: encGpass, username: req.body.username })
                if (AddStudent) {
                    return res.status(200).json({
                        msg: "Faculty register successfully ... check your mail",
                        data: data
                    })
                }
                else {
                    return res.status(200).json({
                        msg: "Mail not send and faculty not register",
                    })
                }
            }
            else {
                return res.status(200).json({
                    msg: "Something wrong to send mail"
                })
            }
           
        }
        else{
            return res.status(200).json({
                msg: "Email already exist"
            })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

function generatePassword() {
    var length = 5,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


module.exports.viewAllStudents = async (req,res)=>{
    try{
        let studentData = await Student.find();
        if(studentData){
            return res.status(200).json({ msg: "Student Data Found",data : studentData });
        }
        else{
            return res.status(200).json({ msg: "Student Data not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.addCourse = async (req,res) =>{
    try{
        console.log(req.body);
        let addCourse = await Course.create(req.body);
        if(addCourse){
            return res.status(200).json({ msg: "Course added",data:addCourse});
        }
        else{
            return res.status(400).json({ msg: "Course can not add"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.editCourse = async (req,res)=>{
    try{
        console.log(req.body);
        console.log(req.params.id);
        let findData = await Course.findByIdAndUpdate(req.params.id,req.body);
        if(findData){
            let updateData = await Course.findById(req.params.id);
            return res.status(200).json({msg : "Data Updated Successfully",data : updateData});
        }
        else{
            return res.status(400).json({ msg: "Something is wrong,Data not Updated"});
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}


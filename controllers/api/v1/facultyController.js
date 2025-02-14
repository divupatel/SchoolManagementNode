const Faculty = require('../../../models/FacultyModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


module.exports.facultyLogin = async (req, res) => {
    try {
        let checkMail = await Faculty.findOne({ email: req.body.email });
        console.log(checkMail)
        if (checkMail) {
            let checkPass = await bcrypt.compare(req.body.password, checkMail.password);
            if (checkPass) {
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
        console.log(req.body)
        console.log(req.params.id);
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
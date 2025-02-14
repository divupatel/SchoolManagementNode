const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../../models/AdminModel');
const nodemailer = require("nodemailer");
const Faculty = require('../../../models/FacultyModel');

module.exports.adminRegister = async (req, res) => {
    try {
        let adminEmailExist = await Admin.findOne({ email: req.body.email });
        if (!adminEmailExist) {
            if (req.body.password == req.body.confirmPassword) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let addAdmin = await Admin.create(req.body);
                if (addAdmin) {
                    return res.status(200).json({ msg: "Admin Data addedd Successfully", data: addAdmin });
                }
                else {
                    return res.status(400).json({ msg: "Can not add Data" });
                }
            }
            else {
                return res.status(400).json({ msg: "password and confirm password are not same" });
            }
        }
        else {
            return res.status(400).json({ msg: "Email already Exists" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.adminLogin = async (req, res) => {
    try {
        let checkAdmin = await Admin.findOne({ email: req.body.email });
        if (checkAdmin) {
            let checkPass = await bcrypt.compare(req.body.password, checkAdmin.password);
            if (checkPass) {
                checkAdmin = checkAdmin.toObject();
                delete checkAdmin.password;
                console.log(checkAdmin, "delete")
                let adminToken = await jwt.sign({ adminData: checkAdmin }, 'Divu', { expiresIn: '1d' });
                return res.status(200).json({ msg: "Logged in Successfully", Token: adminToken });
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

module.exports.adminProfile = async (req, res) => {
    try {
        return res.status(200).json({
            msg: 'User Profile Found',
            data: req.user
        })
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}


module.exports.editAdmin = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById(req.params.id);
        if (checkAdmin) {
            let updateAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body);
            if (updateAdmin) {
                let updatedAdminProfile = await Admin.findById(req.params.id);
                if (updatedAdminProfile) {
                    return res.status(200).json({ msg: "Updated Admin Found", AdminData: updatedAdminProfile });
                }
                else {
                    return res.status(401).json({ msg: "Updated Admin Not Found" });
                }
            }
            else {
                return res.status(401).json({ msg: "Admin Not Updated" });
            }
        }
        else {
            return res.status(401).json({ msg: "Admin Not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.changeAdminPass = async (req, res) => {
    try {
        console.log(req.user);
        console.log(req.body);
        let checkCurrentPass = await bcrypt.compare(req.body.oldPass, req.user.password);
        if (checkCurrentPass) {
            if (req.body.oldPass != req.body.newPass) {
                if (req.body.newPass == req.body.ConfirmPass) {
                    req.body.password = await bcrypt.hash(req.body.newPass, 10);
                    let updatedAdminPassword = await Admin.findByIdAndUpdate(req.user._id, req.body);
                    if (updatedAdminPassword) {
                        return res.status(200).json({
                            msg: "Admin password changed successfully",
                            data: updatedAdminPassword
                        });
                    }
                    else {
                        return res.status(401).json({ msg: "Admin password not changed" });
                    }
                }
                else {
                    return res.status(401).json({ msg: "New Password and Confirm Password not Matches" });
                }
            }
            else {
                return res.status(401).json({ msg: "Old Password and New Password not Matches" });
            }
        }
        else {
            return res.status(401).json({ msg: "Current Password and Old Password not Matches" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.sendMail = async (req, res) => {
    try {
        let checkMail = await Admin.findOne({ email: req.body.email });
        if (checkMail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "divupatel22199@gmail.com",
                    pass: "yxbt fayd fsnb nwjq",
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
            return res.status(400).json({ msg: "Email not exist" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

module.exports.updatePassword = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.query.email });
        if (checkEmail) {
            if (req.body.newPassword == req.body.confirmPassword) {
                req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                let updatePassword = await Admin.findByIdAndUpdate(checkEmail._id, req.body);
                if (updatePassword) {
                    return res.status(200).json({ msg: " Password updated successfully", data: updatePassword });
                }
                else {
                    return res.status(400).json({ msg: " Password not updated" });
                }
            }
            else {
                return res.status(400).json({ msg: " newPassword and confirmPassword are not same" });
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

module.exports.registerFaculty = async (req, res) => {
    try {
        let checkMail = await Faculty.findOne({ email: req.body.email });
        if (!checkMail) {

            var gpass = generatePassword();
            var link = 'http://localhost:8000/api/facultyRegister';

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "divupatel22199@gmail.com",
                    pass: "yxbt fayd fsnb nwjq",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: 'divupatel22199@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "otp verification", // Subject line
                text: "Hello world?", // plain text body
                html: `<h1>You are registerd successfully</h1> 
                <p>Here is your login details :</p>
                <p>your email : ${req.body.email}</p>
                <p>your username : ${req.body.username}</p>
                <p>your password :${gpass}</p>
                <p>your link to login :${link}</p>`, // html body
            });

            const data = {
                email : req.body.email,
                password:gpass,
                username:req.body.username
            }

            if (info) {
                let encGpass = await bcrypt.hash(gpass,10);
                let AddFaculty = await Faculty.create({email : req.body.email,password:encGpass,username:req.body.username})
                if(AddFaculty){
                    return res.status(200).json({
                        msg: "Faculty register successfully ... check your mail",
                        data: data
                    })
                }
                else{
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
        else {
            return res.status(400).json({ msg: "Email already exists....!" });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something is wrong", errors: err });
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

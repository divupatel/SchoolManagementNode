const Faculty = require('../../../models/FacultyModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.facultyLogin = async (req,res)=>{
    try{
        let checkMail = await Faculty.findOne({email : req.body.email});
        console.log(checkMail)
        if(checkMail){
            let checkPass = await bcrypt.compare(req.body.password , checkMail.password);
            if(checkPass){
                let facultyToken = jwt.sign({facultyToken : checkMail},'FRNW',{expiresIn : '1h'});
                return res.status(200).json({msg : "Login Successfully",Token:facultyToken});
            }
            else{
                return res.status(400).json({msg : "Invalid Password"});
            }
        }
        else{
            return res.status(400).json({msg : "Invalid Email"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
}

module.exports.facultyProfile = async (req,res)=>{
    try{
        return res.status(200).json({msg : "Faculty Profile Found Successfully",FacultyData : req.user});
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
}

module.exports.editfacultyProfile = async (req,res)=>{
    try{
        console.log(req.body)
        console.log(req.params.id);
        let checkfaculty = await Faculty.findById(req.params.id);
        if(checkfaculty){
            let updateFaculty = await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if(updateFaculty){
                let updatedFacultyData = await Faculty.findById(req.params.id);
                if(updatedFacultyData){
                    return res.status(400).json({msg : "Faculty updated data found",data : updatedFacultyData});
                }
                else{
                    return res.status(400).json({msg : "Faculty updated data not found"});
                }
            }
            else{
                return res.status(400).json({msg : "Faculty not updated"});
            }
        }
        else{
            return res.status(400).json({msg : "Faculty not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
}

module.exports.changeFacultyPass = async (req,res)=>{
    try{
        let checkCurrentFacultyPass = await bcrypt.compare(req.body.oldPassword , req.user.password);
        if(checkCurrentFacultyPass){
            if(req.body.oldPassword != req.body.newPassword){
                if (req.body.newPassword == req.body.ConfirmPassword){
                    req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                    let updatePass = await Faculty.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePass){
                        return res.status(200).json({msg : "Password updated successfully"});
                    }
                    else{
                        return res.status(400).json({msg : "Password not updated"});
                    }
                }
                else{
                    return res.status(400).json({msg : "New Password and Confirm Password not Matches"});
                }
            }
            else{
                return res.status(400).json({msg : "Old Password and New Password Matches"});
            }
        }
        else{
            return res.status(400).json({msg : "Current Password and Old Password not Matches"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
}
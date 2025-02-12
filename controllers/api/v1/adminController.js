const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../../models/AdminModel');


module.exports.adminRegister = async (req,res)=>{
    try{
        let adminEmailExist = await Admin.findOne({email:req.body.email});
        if(!adminEmailExist){
            if(req.body.password == req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let addAdmin = await Admin.create(req.body);
                if(addAdmin){
                    return res.status(200).json({msg:"Admin Data addedd Successfully",data:addAdmin});
                }
                else{
                    return res.status(400).json({msg:"Can not add Data"});
                }
            }
            else{
                return res.status(400).json({msg:"password and confirm password are not same"});
            }
        }
        else{
            return res.status(400).json({msg:"Email already Exists"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
}

module.exports.adminLogin = async (req,res)=>{
    try{
     let checkAdmin = await Admin.findOne({email : req.body.email});
     if(checkAdmin){
        let checkPass = await bcrypt.compare(req.body.password,checkAdmin.password);
        if(checkPass){
            checkAdmin = checkAdmin.toObject();
            delete checkAdmin.password;
            console.log(checkAdmin,"delete")
            let adminToken = await jwt.sign({adminData : checkAdmin},'Divu',{expiresIn:'1d'});
            return res.status(200).json({msg:"Logged in Successfully",Token : adminToken});
        }
        else{
            return res.status(400).json({msg:"Invalid Password"});
        }
     }
     else{
         return res.status(400).json({msg:"Invalid Email"});
     }
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
}

module.exports.adminProfile = async (req,res)=>{
    try{
        return res.status(200).json({
            msg : 'User Profile Found',
            data : req.user
        })
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
}


module.exports.editAdmin = async (req,res)=>{
    try{
       console.log(req.params.id);
       console.log(req.body);
       let checkAdmin = await Admin.findById(req.params.id);
       if(checkAdmin){
        let updateAdmin = await Admin.findByIdAndUpdate(req.params.id,req.body);
        if(updateAdmin){
            let updatedAdminProfile = await Admin.findById(req.params.id);
            if(updatedAdminProfile){
                return res.status(200).json({msg:"Updated Admin Found",AdminData : updatedAdminProfile});
            }
            else{
                return res.status(401).json({msg:"Updated Admin Not Found"});
            }
        }
        else{
            return res.status(401).json({msg:"Admin Not Updated"});
        }
       }
       else{
           return res.status(401).json({msg:"Admin Not Found"});
       }
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
}

module.exports.changeAdminPass = async (req,res)=>{
    try{
        console.log(req.user);
        console.log(req.body);
        let checkCurrentPass = await bcrypt.compare(req.body.oldPass, req.user.password);
        if(checkCurrentPass){
            if(req.body.oldPass != req.body.newPass){
                if(req.body.newPass == req.body.ConfirmPass){
                    req.body.password = await bcrypt.hash(req.body.newPass,10);
                    let updatedAdminPassword = await Admin.findByIdAndUpdate(req.user._id,req.body);
                    if(updatedAdminPassword){
                        return res.status(200).json({
                            msg:"Admin password changed successfully",
                            data : updatedAdminPassword
                        });
                    }
                    else{
                        return res.status(401).json({msg:"Admin password not changed"});
                    }
                }
                else{
                    return res.status(401).json({msg:"New Password and Confirm Password not Matches"});
                }
            }
            else{
                return res.status(401).json({msg:"Old Password and New Password not Matches"});
            }
        }
        else{
            return res.status(401).json({msg:"Current Password and Old Password not Matches"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
}
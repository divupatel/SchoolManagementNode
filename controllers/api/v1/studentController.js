const Student = require('../../../models/StudentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
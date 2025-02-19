const express = require('express');

const routes = express.Router();

const StudentCtl = require('../../../../controllers/api/v1/studentController');
const passport = require('passport');
 
routes.post('/loginStudent',StudentCtl.loginStudent);
routes.get('/studentProfile',passport.authenticate('student',{failureRedirect:'/api/student/failStudent'}),StudentCtl.studentProfile);

routes.get('/failStudent', (req,res)=>{
    try{
        return res.status(200).json({msg : "Invalid Token"});
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
})

routes.put('/editStudentProfile/:id',passport.authenticate('student',{failureRedirect:'/api/student/failStudent'}),StudentCtl.editStudentProfile);
routes.post('/changeStudentPassword',passport.authenticate('student',{failureRedirect:'/api/student/failStudent'}),StudentCtl.changeStudentPassword);
routes.post('/sendMail',StudentCtl.sendMail);
routes.post('/updateStudentPassword',StudentCtl.updateStudentPassword);

routes.get('/studentLogout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(400).json({
                msg : "Student can not logout"
            })
        }
        else{
            return res.status(400).json({
                msg : "Go to Student Login Page"
            })
        }
    })
})

routes.get('/viewCourse',passport.authenticate('student',{failureRedirect:'/api/student/failStudent'}),StudentCtl.viewCourse);

module.exports = routes;
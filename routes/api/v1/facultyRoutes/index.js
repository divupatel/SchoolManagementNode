const express = require('express');

const routes = express.Router();

const FacultyCtl = require('../../../../controllers/api/v1/facultyController');
const passport = require('passport');
 
routes.post('/facultyLogin',FacultyCtl.facultyLogin);
routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFaculty'}),FacultyCtl.facultyProfile);
routes.get('/failFaculty', (req,res)=>{
    try{
        return res.status(200).json({msg : "Invalid Token"});
    }
    catch(err){
        return res.status(400).json({msg : "Something is wrong",errors:err});
    }
})

routes.put('/editfacultyProfile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFaculty'}),FacultyCtl.editfacultyProfile);
routes.post('/changeFacultyPass',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFaculty'}),FacultyCtl.changeFacultyPass);
routes.post('/sendMail',FacultyCtl.sendMail);
routes.post('/updatePassword',FacultyCtl.updatePassword);
routes.get('/facultyLogout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(400).json({
                msg : "Faculty can not logout"
            })
        }
        else{
            return res.status(400).json({
                msg : "Go to Faculty Login Page"
            })
        }
    })
})

routes.post('/registerStudent',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFaculty'}),FacultyCtl.registerStudent)

module.exports = routes;
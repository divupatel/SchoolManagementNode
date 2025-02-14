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
module.exports = routes;
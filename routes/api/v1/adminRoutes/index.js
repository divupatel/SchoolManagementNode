const express = require('express');

const routes = express.Router();

const AdminCtl = require('../../../../controllers/api/v1/adminController');
const passport = require('passport');

routes.post('/adminRegister',AdminCtl.adminRegister);

routes.post('/adminLogin',AdminCtl.adminLogin);

routes.get('/adminProfile',passport.authenticate('jwt',{failureRedirect : '/api/adminFailLogin'}),AdminCtl.adminProfile);

routes.get('/adminFailLogin', async (req,res)=>{
    try{
        return res.status(401).json({
            msg : 'Invalid Token',
        })
    }
    catch(err){
        return res.status(400).json({msg:"Something is wrong",errors:err});
    }
})

routes.put('/editAdmin/:id',passport.authenticate('jwt',{failureRedirect : '/api/adminFailLogin'}),AdminCtl.editAdmin);

routes.get('/adminLogout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(400).json({
                msg : "Something is wrong"
            })
        }
        else{
            return res.status(200).json({
                msg : "Go to Admin Login Page"
            })
        }
    })
})

routes.post('/changeAdminPass',passport.authenticate('jwt',{failureRedirect : '/api/adminFailLogin'}),AdminCtl.changeAdminPass);



module.exports = routes;
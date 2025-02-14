const passport = require('passport');

const jwtStratagy = require('passport-jwt').Strategy;

const ExtractStratagy = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest : ExtractStratagy.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'Divu'
}

const Admin = require('../models/AdminModel');

passport.use(new jwtStratagy (opts,async function (payload,done){
    let checkAdminData = await Admin.findOne({email : payload.adminData.email})
    if(checkAdminData){
        return done(null,checkAdminData)
    }
    else{
        return done(null,false)
    }
}))

const Facultyopts = {
    jwtFromRequest : ExtractStratagy.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'FRNW'
}

const Faculty = require('../models/FacultyModel');

passport.use('faculty',new jwtStratagy (Facultyopts,async function (payload,done){
    let checkFacultyData = await Faculty.findOne({email : payload.facultyToken.email})
    if(checkFacultyData){
        return done(null,checkFacultyData)
    }
    else{
        return done(null,false)
    }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser( async (id,done)=>{
    let adminData = await Admin.findById(id);
    if(adminData){
        return done (null,adminData)
    }
    else{
        return done(null,false)
    }
})

module.exports = passport;
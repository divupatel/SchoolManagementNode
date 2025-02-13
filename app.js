const express = require('express');
const port = 8000;

const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://divupatel22199:HBMI3ZdRIeUHUe4z@cluster0.zhu7k.mongodb.net/SchoolManagement').then(console.log("Db is connected")).catch((err)=>{
    console.log("Db not connected");
});

// const db = require('./config/db')

const jwtStrategy = require('./config/passport_jwt-Strtagy');
const session = require('express-session');
const passport = require('passport');

app.use(express.urlencoded());

app.use(session({
    name : 'ApiRNW',
    secret : 'SchoolRnw',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000 * 60 * 60
    },
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/api',require('./routes/api/v1/adminRoutes'));

app.listen(port , (err)=>{
    if(err){
        console.log("Something is wrong")
        return false;
    }
    console.log("Server is running on the port :",port);
})
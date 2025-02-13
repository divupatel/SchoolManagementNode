const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default : true
    }
},
    {
        timestamps : true
    }
);

const Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin;
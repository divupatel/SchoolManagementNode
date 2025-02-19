const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    CourseName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    StartDate : {
        type : String,
        required : true
    },
    EndDate : {
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

const Course = mongoose.model('Course',CourseSchema);
module.exports = Course;
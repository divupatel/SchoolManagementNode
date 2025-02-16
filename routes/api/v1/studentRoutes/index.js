const express = require('express');

const routes = express.Router();

const StudentCtl = require('../../../../controllers/api/v1/studentController');
const passport = require('passport');
 
routes.post('/loginStudent',StudentCtl.loginStudent);

module.exports = routes;
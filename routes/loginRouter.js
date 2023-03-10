const express = require("express");
const loginRouter = express.Router();

//Required controllers for user and admin login
const authControllerVar = require("../controllers/auth");

loginRouter
.post("/adminlogin", authControllerVar.adminLogin)
.post("/userlogin", authControllerVar.userLogin)

module.exports = loginRouter;

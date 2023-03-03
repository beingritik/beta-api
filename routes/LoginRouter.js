const express = require("express");
const loginRouter = express.Router();

//Required controllers for user
const authControllerVar = require("../controllers/auth");

loginRouter
.post("/adminlogin", authControllerVar.adminLogin)
.post("/userlogin", authControllerVar.userLogin)

module.exports = loginRouter;

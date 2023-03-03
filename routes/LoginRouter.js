const express = require("express");
const adminRouter = express.Router();

//Required controllers for user
const authControllerVar = require("../controllers/auth");

adminRouter
.post("/adminlogin", authControllerVar.adminLogin)
.post("/userlogin", authControllerVar.userLogin)

module.exports = adminRouter;

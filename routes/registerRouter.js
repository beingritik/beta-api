const express = require("express");
const registerRouter = express.Router();

//Required controllers for user and admin login
const authControllerVar = require("../controllers/auth");

registerRouter
.post("/register", authControllerVar.userRegister)

module.exports = registerRouter;

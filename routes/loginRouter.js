const express = require("express");
const loginRouter = express.Router();

//Required controllers for user login
const authControllerVar = require("../controllers/auth");

loginRouter
.post("/login", authControllerVar.userLogin);

module.exports = loginRouter;

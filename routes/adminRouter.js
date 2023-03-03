const express = require("express");
const adminRouter = express.Router();

//Required controllers for admin
const adminControllerVar = require("../controllers/admin");
const feedbackControllerVar = require("../controllers/feedback");

adminRouter

  .post("/createuser", adminControllerVar.createUser)
  .post("/createstudent/:id", adminControllerVar.createStudent)
  .get("/deleteuser/:id", adminControllerVar.deleteUser)
  .get("/deletestudent/:id", adminControllerVar.deleteStudent)
  .get("/getallusers", adminControllerVar.getAllUsers)
  .get("/getallstudents", adminControllerVar.getAllStudents)
  .post("/updateuser/:id", adminControllerVar.updateUser)
  .post("/updatestudent/:id", adminControllerVar.updateStudent)
  .get("/getallfeedback", feedbackControllerVar.getAllFeedback)
  .get("/deletefeedback/:id", feedbackControllerVar.deleteFeedback)

module.exports =  adminRouter;
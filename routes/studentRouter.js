const express = require("express");
const studentRouter = express.Router();

//Required controllers for student
const studentControllerVar= require("../controllers/student");
const feedbackController= require("../controllers/feedback");

studentRouter
  //for ID card
  .get("/getstudent/:id", studentControllerVar.getStudent)
  .post("/updateinfo/:id", studentControllerVar.updateInfo)
  .post("/createfeedback/:id", feedbackController.createFeedback)

module.exports =  studentRouter;
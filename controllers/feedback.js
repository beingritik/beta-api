const User = require("../models/user");
const Student = require("../models/student");
const Feedback = require("../models/feedback");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, customApiError } = require("../errors");
const mongoose = require("mongoose");
const databaseVar = require("../db/database");

//get all feedbacks
const getAllFeedback = async function (req, res) {
  try {
    const message = "No Feedbacks to fetch.";
    await databaseVar.database_connection();
    const feedbacks = await Feedback.find({})
      .sort("createdAt")
      .populate("userId", [
        "-__v",
        "-password",
        "-username",
        "-updatedAt",
        "-createdAt",
      ]);
    console.log("Feedbacks are=", feedbacks.length);
    let count = feedbacks.length;
    if (count > 0) {
      res
        .status(StatusCodes.OK)
        .json({ feedbacks, feedbacksCount: { totalFeedbacks: count } });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: message, feedbacksCount: { totalFeedbacks: count } });
    }
    databaseVar.database_disconnect();
  } catch (err) {
    console.log("Err in the get all feedback is=", err.message);
    throw err;
  }
};

//create feedback
const createFeedback = async function (req, res) {
  try {
    console.log("creation of feedback entered with ");
    const {
      params: { id: userId },
    } = req;
    const validuserId = mongoose.Types.ObjectId.isValid(userId);
    if (validuserId) {
      await databaseVar.database_connection();
      const validUser = await User.findOne({ _id: userId })
        .then((result) => {
          console.log("User found with id =", userId);
          return result;
        })
        .catch((err) => {
          throw err;
        });
      if (validUser !== null) {
        const studentIsVerified = await Student.findOne({
          userId: validUser._id,
        })
          .then((result) => {
            console.log("student is ", result.status);
            return result;
          })
          .catch((err) => {
            console.log("error in creating feedback=", err.message);
            return null;
          });
        if (studentIsVerified) {
          if (studentIsVerified.status == "Verified") {
            console.log("creation of feedback starts");
            const createfeedback = await Feedback.create({
              userId: userId,
              ...req.body,
            });
            if (createfeedback) {
              res.set("Content-Type", "application/json");
              res.status(StatusCodes.OK).json(createfeedback);
            }
          } else {
            throw new BadRequestError(
              "Student details not verified . Unable to create feedback."
            );
          }
        } else {
          throw new BadRequestError(
            `No student exist with the given user id : ${userId}.`
          );
        }
      } else {
        throw new BadRequestError(
          `No student exist with studentId in the params: ${userId}`
        );
      }
      await databaseVar.database_disconnect();
    } else {
      throw new BadRequestError(`Invalid ID : ${userId} . `);
    }
  } catch (err) {
    console.log("Error in creating feedback is - ", err.message);
    throw err;
  }
};

//delete feedback
const deleteFeedback = async function (req, res) {
  try {
    const {
      params: { id: feedbackId },
    } = req;
    let message = "Successfully deleted";
    const validFeedback = mongoose.Types.ObjectId.isValid(feedbackId);
    if (validFeedback) {
      await databaseVar.database_connection();
      const deletedFeedback = await Feedback.findOneAndDelete({
        _id: feedbackId,
      })
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
      console.log("Deleted Feedback--", deletedFeedback);
      if (deletedFeedback === null) {
        throw new BadRequestError(
          `No student with this feedbackId: ${feedbackId}`
        );
      } else
        res
          .status(StatusCodes.OK)
          .json({ deletedFeedback, message: { message } });
    } else {
      throw new BadRequestError(
        `Invalid ID passed in the params ${feedbackId}`
      );
    }
    databaseVar.database_disconnect();
  } catch (err) {
    console.log("Error in the deletefeedback function is=", err.message);
    throw err;
  }
};


module.exports = {
  getAllFeedback,
  createFeedback,
  deleteFeedback,
};

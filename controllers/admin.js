const User = require("../models/user");
const Student = require("../models/student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, customApiError } = require("../errors");
const mongoose = require("mongoose");
const databaseVar = require("../db/database");

//Create new user
const createUser = async function (req, res) {
  try {
    // console.log("registered student entered with");
    await databaseVar.database_connection();
    const savedUser = await User.create({
      ...req.body,
    });
    if (savedUser) {
      res.set("Content-Type", "application/json");
      res.status(200).json(savedUser);
      //closing the connection
      databaseVar.database_disconnect();
    }
  } catch (err) {
    console.log("error in creating user in createuser is = ", err.message);
    throw err;
  }
};

//create student thru UserId
const createStudent = async function (req, res) {
  try {
    // console.log("creation of student entered with = ", req.params.id);
    const {
      params: { id: userId },
    } = req;
    const validuserId = mongoose.Types.ObjectId.isValid(userId);
    if (validuserId) {
      await databaseVar.database_connection();
      const validUser = await User.findOne({ _id: userId }).then((result) => {
        console.log("result in user table=", result);
        return result;
      });
      console.log("valid=", validUser);

      if (validUser !== null) {
        if (validUser.status == "active") {
          console.log("creation of student starts");
          const createStudent = await Student.create({
            userId: userId,
            ...req.body,
          });
          if (createStudent) {
            res.set("Content-Type", "application/json");
            res.status(StatusCodes.OK).json(createStudent);
            await databaseVar.database_disconnect();
          }
        }
        else{
          databaseVar.database_disconnect();
          throw new BadRequestError("This user is Inactive.")
        }
      } else {
        databaseVar.database_disconnect();
        throw new BadRequestError(
          `No user exist with the given id ${userId} in the params.`
        );
      }
    } else {
      throw new BadRequestError(`Invalid ID : ${userId} in the params. `);
    }
  } catch (err) {
    console.log("Error in creating student is - ", err.message);
    throw err;
  }
};

//get all Users
const getAllUsers = async function (req, res) {
  try {
    // console.log("getall called");
    const message = "No users to fetch. Please create users to be displayed.";
    await databaseVar.database_connection();
    const users = await User.find({}).sort("createdAt");
    console.log("users are", users.length);
    let count = users.length;
    if (count > 0) {
      res
        .status(StatusCodes.OK)
        .json({ users, usersCount: { totalUsers: count } });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: message, usersCount: { totalUsers: count } });
    }
    databaseVar.database_disconnect();
  } catch (err) {
    console.log("Error in fetching users in  are:", err.message);
    throw err;
  }
};

// delete single user
const deleteUser = async function (req, res) {
  // console.log("deleteUser called", userId);
  const {
    params: { id: userId },
  } = req;
  const validUser = mongoose.Types.ObjectId.isValid(userId);
  if (validUser) {
    await databaseVar.database_connection();
    const deletedUser = await User.findOneAndDelete({ _id: userId }).then(
      (result) => {
        return result;
      }
    );
    // console.log("Deleted User--", deletedUser);
    if (deletedUser === null) {
      throw new BadRequestError(`No user with this userId: ${userId}`);
    } else {
      let message =
        "Successfully deleted , no Student associated with it yet till deletion.";
      const deleteAssociatedStudent = await Student.findOneAndDelete({
        userId: userId,
      }).then((result) => {
        return result;
      });
      if (deleteAssociatedStudent === null) {
        res.status(StatusCodes.OK).json({ deletedUser, message: { message } });
      } else {
        let message =
          "Successfully deleted the user and the student associated with it.";
        res.status(StatusCodes.OK).json({ deletedUser, message: { message } });
      }
      databaseVar.database_disconnect();
    }
  } else {
    throw new BadRequestError(`Invalid ID passed in the params ${userId}`);
  }
};

//get all students
const getAllStudents = async function (req, res) {
  try {
    // console.log("getallstudents called");
    const message =
      "No Students to fetch. Please create Students to be displayed.";
    await databaseVar.database_connection();
    const students = await Student.find({})
      .sort("createdAt")
      .populate("userId", ["-password", "-__v", "-createdAt", "-updatedAt"]);
    console.log("students are", students.length);
    let count = students.length;
    if (count > 0) {
      res
        .status(StatusCodes.OK)
        .json({ students, studentsCount: { totalStudents: count } });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: message, studentsCount: { totalStudents: count } });
    }
    databaseVar.database_disconnect();
  } catch (err) {
    console.log("Error in fetching students in  are:", err.message);
    throw err;
  }
};

//delete single student
const deleteStudent = async function (req, res) {
  // console.log("deleteStudent called", req.params.id);
  const {
    params: { id: studentId },
  } = req;
  let message = "Successfully deleted";
  const validStudent = mongoose.Types.ObjectId.isValid(studentId);
  if (validStudent) {
    await databaseVar.database_connection();
    const deletedStudent = await Student.findOneAndDelete({
      _id: studentId,
    }).then((result) => {
      return result;
    });
    console.log("Deleted User--", deletedStudent);
    if (deletedStudent === null) {
      throw new BadRequestError(`No student with this studentId: ${studentId}`);
    } else
      res.status(StatusCodes.OK).json({ deletedStudent, message: { message } });
  } else {
    throw new BadRequestError(`Invalid ID passed in the params ${studentId}`);
  }
  databaseVar.database_disconnect();
};

//update single user
const updateUser = async function (req, res) {
  // console.log("update user called ");
  let message = "Successfully Updated";
  const {
    params: { id: userId },
  } = req;

  if (mongoose.Types.ObjectId.isValid(userId)) {
    await databaseVar.database_connection();
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      req.body,
      { new: true, runValidators: true }
    ).then((result) => {
      // console.log("result in updation =",result);
      return result;
    });
    if (updatedUser === null) {
      throw new BadRequestError(
        `No User with this id in the params :${userId}`
      );
    } else {
      res.status(StatusCodes.OK).json({ updatedUser, message: { message } });
    }
    databaseVar.database_disconnect();
  } else {
    throw new BadRequestError(`Invalid userId in the params:${userId}`);
  }
};

//update single student (with passing the student Id in the params)
const updateStudent = async function (req, res) {
  // console.log("update Student called ");
  const {
    params: { id: studentId },
  } = req;
  let message = "Successfully Updated";
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    await databaseVar.database_connection();
    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: studentId },
      req.body,
      { new: true, runValidators: true }
    ).then((result) => {
      // console.log("result in updation =",result);
      return result;
    });
    if (updatedStudent === null) {
      throw new BadRequestError(
        `No Student with this id in the params :${studentId}`
      );
    } else {
      res.status(StatusCodes.OK).json({ updatedStudent, message: { message } });
    }
    databaseVar.database_disconnect();
  } else {
    throw new BadRequestError(`Invalid studentId in the params:${studentId}`);
  }
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
};

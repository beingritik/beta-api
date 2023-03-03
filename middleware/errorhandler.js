// const { customApiError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const databaseVar = require("../db/database");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("............................");
  console.log("error in middleware is=", err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong.try again",
  };

  if (err.name === "MongoParseError") {
    customError.msg =
      "Database connection string (Mongo_URI) invalid, must have start with 'mongodb://' or 'mongodb+srv://'";
    customError.statusCode = StatusCodes.BAD_GATEWAY;
  }
  
  if (err.name === "MongooseServerSelectionError") {
    customError.msg =
      "The hostname you have provided for your MongoDB deployment cannot be resolved by the client, check the URI.";
    customError.statusCode = StatusCodes.BAD_GATEWAY;
  }


  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    (customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )}, please choose another valid value.`),
      (customError.statusCode = 400);
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with : ${err.value}`;
    customError.statusCode = 404;
  }

  // if (Object.values(err.errors)[0]=== "CastError") {
  //   customError.msg = `Cast to ObjectId failed for value : ${err.value}`;
  //   customError.statusCode = 404;
  // }

  //closing the connection if established , if any error came
  if (mongoose.connection.readyState == 1){
    console.log("---------------------------------------------------------------")
    mongoose.connection.close(function () {
      console.log(
        "Error came here, in errorhandler, connection closed with readystate =",
        mongoose.connection.readyState
      );
    });
  }
  if (mongoose.connection.readyState == 1) {
    databaseVar.database_disconnect();
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = { errorHandlerMiddleware };

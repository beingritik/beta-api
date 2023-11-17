//Required dependencies
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const mongodatabaseVar = require("../db/database");

/*MIddleware function defined for the error in different conditons in connecting
  databases and server modifications , along with their status codes*/

const errorHandlerMiddleware = (err, req, res, next) => {

  //Defined custom errors and some errors in given conditions , it will send the errors responses
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

  if (err.errno == "1062") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 401;
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

  //closing the connection if established , if any error came
  if (mongoose.connection.readyState == 1){
    mongoose.connection.close(function () {
      console.log(
        "Error came here, in errorhandler, connection closed with readystate =",
        mongoose.connection.readyState
      );
    });
  }
  if (mongoose.connection.readyState == 1) {
    mongodatabaseVar.mongo_database_disconnect();
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = { errorHandlerMiddleware };

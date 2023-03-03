const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, customApiError } = require("../errors");
const mongoose = require("mongoose");
const databaseVar = require("../db/database");

//login of User
const userLogin = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Email and password shouldnt be empty.");
    }
    await databaseVar.database_connection();
    const user = await User.findOne({ email });
    if (!user) {
      // throw new BadRequestError("Please provide email ");
      throw new BadRequestError("incorrect email ");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    // console.log("ispassword=", isPasswordCorrect);
    if (!isPasswordCorrect) {
      // throw new UnauthenticatedError("Invalid Credentials");
      throw new BadRequestError("Invalid password");
    }
    if (user.status === "active") {
      await user.createJWT().then((token) => {
        // console.log("token is in =", token);
        res.status(StatusCodes.OK).json({
          loggedInUser: {
            name: user.name,
            username: user.username,
            email: user.email,
          },
          token,
        });
      })
      .catch((err)=>{
        throw err;
      })
    }
    else{
      throw new BadRequestError("User is inactive. Contact Admin for activation.")
    }
    databaseVar.database_disconnect();
  } catch (err) {
    console.log("error in adminLogin function is=", err.message);
    throw err;
  }
};

///login of Admin  (neeche maine define kiya hai)
const adminLogin = async function (req, res) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      throw new BadRequestError("Email and password shouldnt be empty.");
    }
    if (name === "admin" && password === process.env.HASHED) {
      const user = new User();
      user.createJWT().then((token) => {
        res.status(StatusCodes.OK).json({
          loggedInadmin: {
            adminName: "admin",
          },
          token,
        });
      });
    } else {
      throw new BadRequestError("Invalid admin credentials.");
    }
  } catch (err) {
    console.log("error in adminLogin function is=", err.message);
    throw err;
  }
};

module.exports = {
  adminLogin,
  userLogin,
};

///login of Admin
// const adminLogin = async function (req, res) {
//   try {
//     // await start_function();
//     const { name, password } = req.body;
//     if (!name || !password) {
//       throw new BadRequestError("Email and password shouldnt be empty.");
//     }
//     if (name === "admin" && password === process.env.HASHED) {
//       const user = new User();
//       user.createJWT().then((token) => {
//         // console.log("token is in =", token);
//         res.status(StatusCodes.OK).json({
//           loggedInadmin: {
//             adminName: "admin",
//           },
//           token,
//         });
//       });
//     } else {
//       throw new BadRequestError("Invalid admin credentials.");
//     }
//     // const user = await User.findOne({ email });
//     // if (!user) {
//     //   // throw new BadRequestError("Please provide email ");
//     //   throw new BadRequestError("incorrect email ");
//     // }
//     // const isPasswordCorrect = await user.comparePassword(password);
//     // // console.log("ispassword=", isPasswordCorrect);
//     // if (!isPasswordCorrect) {
//     //   // throw new UnauthenticatedError("Invalid Credentials");
//     //   throw new BadRequestError("Invalid password");
//     // }

//     // mongoose.connection.close(function () {
//     //   console.log(
//     //     "MongoDb connection closed with readystate =",
//     //     mongoose.connection.readyState
//     //   );
//     // });
//   } catch (err) {
//     console.log("error in adminLogin function is=", err.message);
//     throw err;
//   }
// };

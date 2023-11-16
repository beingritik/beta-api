require("dotenv").config();
const game = require("../models/game");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  AuthError
} = require("../errors");

const mongoDBVar = require("../db/database");
const jwtLibs = require("../libraries/jwt");



/*
For CREATING  the gamedata  for a specific user
passing the id generated in mysql for the user in the params and the token 
header for authorization so that the authorized user can only access the api endpoint 
for creation to that specific user.
*/
const createGame = async function (req, res) {
  let verifiedToken;
  try {
    const {
      params: { id: user_id },
    } = req;
    let autHeader = req.headers.authorization;
    // Extract only the token part (remove "Bearer " prefix)
    if (autHeader && autHeader.startsWith("Bearer ")) {
      autHeader = autHeader.slice(7);
    }
    verifiedToken = await jwtLibs.verifyToken(
      autHeader,
      process.env.JWT_SECRET
    );

    const verifiedTokenlen = Object.keys(verifiedToken).length;
    if (verifiedTokenlen == 4) {
      await mongoDBVar.mongo_database_connection();
      const createGame = await game.create({
        user_email: verifiedToken.useremail,
        user_id: verifiedToken.userId,
        ...req.body,
      });
      if (createGame) {
        res.set("Content-Type", "application/json");
        res.status(StatusCodes.OK).json(createGame);
      }
      await mongoDBVar.mongo_database_disconnect();
    } else {
      throw new AuthError(`Invalid Token or missing`);
    }
  } catch (err) {
    throw err;
  }
};

/*
For getting the gamedata  for a specific user
passing the id generated in mysql for the user in the params and the token header for
authorization so that the authorized user can only access the api endpoint
*/
const getGame = async function (req, res) {
  const {
    params: { id: user_id },
  } = req;
  let verifiedToken;
  let autHeader = req.headers.authorization;

  // Extract only the token part (remove "Bearer " prefix)
  if (autHeader && autHeader.startsWith("Bearer ")) {
    autHeader = autHeader.slice(7);
  }
  verifiedToken = await jwtLibs.verifyToken(autHeader, process.env.JWT_SECRET);

  const verifiedTokenlen = Object.keys(verifiedToken).length;

  if (verifiedTokenlen == 4) {
    await mongoDBVar.mongo_database_connection();
    const userGameData = await game
      .findOne({ user_id: verifiedToken.userId })
      .populate("user_id", ["-createdAt", "-updatedAt", "-__v"])
      .then((result) => {
        return result;
      });
    if (userGameData === null) {
      throw new BadRequestError(
        `No user with this user Id : ${user_id} , yet created.`
      );
    } else res.status(StatusCodes.OK).json({ userGameData: userGameData });
  } else {
    throw new AuthError(`Invalid Token or missing`);
  }
  await mongoDBVar.mongo_database_disconnect();
};

/*
For deleting the gamedata  for a specific user
passing the id generated in mysql for the user in the params and the token header for
authorization so that the authorized user can only access the api endpoint for deletion
*/

const deleteGame = async function (req, res) {
  try {
    let verifiedToken;
    const {
      params: { id: user_id },
    } = req;
    let message = "Successfully deleted the user Game data.";
    let autHeader = req.headers.authorization;

    // Extract only the token part (remove "Bearer " prefix)
    if (autHeader && autHeader.startsWith("Bearer ")) {
      autHeader = autHeader.slice(7);
    }
    verifiedToken = await jwtLibs.verifyToken(
      autHeader,
      process.env.JWT_SECRET
    );
    //getting the length of auth token for validations
    const verifiedTokenlen = Object.keys(verifiedToken).length;

    if (verifiedTokenlen == 4) {
      await mongoDBVar.mongo_database_connection();

      const deletedGameData = await game
        .findOneAndDelete({
          user_id: verifiedToken.userId,
        })
        .then((result) => {
          return result;
        });
      if (deletedGameData === null) {
        throw new BadRequestError(`No user with this user_id: ${user_id}`);
      } else
        res
          .status(StatusCodes.OK)
          .json({ deletedGameData, message: { message } });
    } else {
      throw new AuthError(`Invalid Token or missing`);
    }
    // throw new BadRequestError(`Invalid ID passed in the params ${user_id}`);
    await mongoDBVar.mongo_database_disconnect();
  } catch (err) {
    throw err;
  }
};

/*
For updating  the gamedata  for a specific user
passing the id generated in mysql for the user in the params and the token header for
authorization so that the authorized user can only access the api endpoint for updation
*/
const updateGame = async function (req, res) {
  try {
    let verifiedToken;
    let message = "Successfully Updated";
    const {
      params: { id: user_id },
    } = req;

    let autHeader = req.headers.authorization;
    // Extract only the token part (remove "Bearer " prefix)
    if (autHeader && autHeader.startsWith("Bearer ")) {
      autHeader = autHeader.slice(7);
    }
    verifiedToken = await jwtLibs.verifyToken(
      autHeader,
      process.env.JWT_SECRET
    );
    const verifiedTokenlen = Object.keys(verifiedToken).length;

    if (verifiedTokenlen == 4) {
      await mongoDBVar.mongo_database_connection();
      let body = req.body;
      const updatedUser = await game
        .findOneAndUpdate({ user_id: verifiedToken.userId }, body, {
          new: true,
          runValidators: true,
        })
        .then((result) => {
          return result;
        });
      if (updatedUser === null) {
        throw new BadRequestError(
          `No User with this id in the params :${user_id}`
        );
      } else {
        res.status(StatusCodes.OK).json({ updatedUser, message: { message } });
      }
      await mongoDBVar.mongo_database_disconnect();
    } else {
      throw new AuthError(`Invalid Token or missing`);
      // throw new BadRequestError(`Invalid userId in the params:${user_id}`);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createGame,
  deleteGame,
  getGame,
  updateGame,
};

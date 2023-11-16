const express = require("express");
const gameRouter = express.Router();

//Required controllers for gameData
const gamecontrollerVar = require("../controllers/gameData");

gameRouter
.post("/createGame/:id", gamecontrollerVar.createGame)
.get("/getGame/:id", gamecontrollerVar.getGame)
.get("/deleteGame/:id", gamecontrollerVar.deleteGame)
.post("/updateGame/:id", gamecontrollerVar.updateGame)

module.exports =  gameRouter;
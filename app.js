require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// //Required dependencies 
app.use(express.json());
const bodyParser = require("body-parser")
const notFoundMiddleware = require('./middleware/notFound');
const {errorHandlerMiddleware} = require("./middleware/errorhandler");

// Middleware to parse URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//required dependencies for routes
const loginRouter = require("./routes/loginRouter"); 
const registerRouter = require("./routes/registerRouter"); 
const gameRouter = require("./routes/gameRouter"); 

//Middlewares for the Routes
app.use("", loginRouter);
app.use("", registerRouter);
app.use("/user", gameRouter);

//Midlewares for errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Calling the port 
const port = process.env.PORT || 3001;
app.listen(port,()=>{
  console.log(`Server is listening on ${port}`);
});


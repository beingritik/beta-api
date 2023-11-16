require("dotenv").config();
const mongoose = require("mongoose");
const mysql = require("mysql");

// for for connecting sql db connection
const SQL_DB_CONN= mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password:process.env.PASSWORD,
  database:process.env.DATABASE
});

SQL_DB_CONN.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("MYSQL CONNECTED")
  }
})

//for establishing the mongo db connection
mongoose.set("strictQuery", false);
const connectmongoDb = (url) => {
  return mongoose.connect(url,{});
};

module.exports = {
  connectmongoDb,
  SQL_DB_CONN
};











// const getdb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found";
// };

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// let _db;
// const mongoConnect = (callback) => {
//   MongoClient.connect("mongodb://localhost:27017")
//     .then((client) => {
//       console.log("connected to mongo");
//       _db = client.db();
//       callback(client);
//     })
//     .catch((err) => {
//       console.log("error in connecting database is:", err.message);
//     });
// };

// const getdb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found";
// };

// module.exports = {
//   mongoConnect,
//   getdb,
// };

//     // "mongodb+srv://ritik:9cnEvghnmgIkN7S0@cluster0.dajjjde.mongodb.net/test"

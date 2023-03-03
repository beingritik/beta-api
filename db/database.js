const mongoose = require('mongoose');
const dbConnection = require("./connect");


//for establishing the connection to database
const database_connection = async () => {
  await dbConnection.connectDb(process.env.MONGO_URI).then((result) => {
    console.log(
      "Connected to Mongodb with =",
      result.connections[0]._connectionString
    );
  });
};

//for closing the connection
const database_disconnect = async () => {
  await mongoose.connection.close(function () {
    console.log(
      "MongoDb connection closed with readystate =",
      mongoose.connection.readyState
    );
  });
};

module.exports = {
  database_connection, 
  database_disconnect
};
const bcrypt = require("bcryptjs");
const { SQL_DB_CONN, connectmongoDb } = require("../db/connect");
const { generateToken } = require("../libraries/jwt");
const { BadRequestError } = require("../errors");
const Rabbit = require('../events/rabbit');


// login of registered User
const userLogin = async function (req, res) {
  try {
    const { email, password } = req.body;

    //for regex matching of emial field
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      res.status(400).json({ error: "invalid email" });
    }
    if (!email && !password) {
      throw new BadRequestError("Missing credentials");
    }
    
    const sqlQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const queryplaceholder = [];
    queryplaceholder.push(email);

    SQL_DB_CONN.query(sqlQuery, queryplaceholder, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const user = results[0];

      // Compare the provided password with the hashed password from the database
      bcrypt.compare(
        password,
        user.password_hash,
        (bcryptErr, bcryptResult) => {
          if (bcryptErr || !bcryptResult) {
            return res.status(401).json({ error: "Invalid password" });
          }
          // If the password is correct, generate a JWT token and send it in the response
          let key = process.env.JWT_SECRET;
          const token = generateToken(user, key);
          res.setHeader("Authorization", `Bearer ${token}`);
          res.json({ token: token, message: "Login Successful" });
        }
      );
    });
  } catch (err) {
    throw err;
  }
};

//Registeration of new user
const userRegister = async function (req, res) {
  try {
    const { username, email, password_hash, status } = req.body;

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let isValidEmail = emailRegex.test(email);

    if (!username || !password_hash || !email || !status) {
      res.status(400).json({ error: "missing info" });
    }
    if (!isValidEmail) {
      res.status(400).json({ error: "invalid email" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

    const queryplaceholder = [];
    // Insert user data into the database
    const sqlQuery = `INSERT INTO users (username, email, password_hash,status) VALUES ('${username}','${email}','${hashedPassword}','${status}')`;

    queryplaceholder.push(username);
    queryplaceholder.push(email);
    queryplaceholder.push(hashedPassword);
    queryplaceholder.push(status);

    SQL_DB_CONN.query(sqlQuery, queryplaceholder, async(error, results) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      // Publish registration event to RabbitMQ
      const channel = await Rabbit.setupRabbitMQ();
      channel.sendToQueue(process.env.REGISTER_EVENT_QUEUE, Buffer.from(JSON.stringify({ username, email })));
      Rabbit.setupEventSubscriber();
      
      res.status(200).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
};

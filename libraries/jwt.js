const jwt = require('jsonwebtoken');
require("dotenv").config();

/* for generating the token 
params: api payload , Defined Secret key 
*/
const generateToken = (user,key) => {
  const token = jwt.sign({ userId: user.user_id, useremail:user.email }, key, { expiresIn: process.env.JWT_LIFETIME });
  return token;
};

//For verfiying the token  thru the JWT request
const verifyToken = (token,key) => {
  try {
    const decoded = jwt.verify(token,key);
    // If verification is successful, 'decoded' will contain the payload
    return decoded;
  } catch (error) {
    // If verification fails, an error will be thrown
    console.error('Error verifying token:', error.message);
    return error;
  }
};
module.exports = { generateToken,verifyToken };
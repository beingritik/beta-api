const { StatusCodes  } = require('http-status-codes');
const customApiError = require("./customapi");

class AuthError extends customApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthError;

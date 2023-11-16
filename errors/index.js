const customApiError = require("./customapi");
const notFoundError = require("./notFound");
const BadRequestError = require('./badRequest')
const AuthError = require('./authRequest')

module.exports = {
  customApiError,
  notFoundError,
  BadRequestError,
  AuthError
};

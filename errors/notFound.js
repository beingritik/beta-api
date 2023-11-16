const {StatusCodes} = require('http-status-codes');
const customApiError = require('./customapi')

class notFoundError extends customApiError{
constructor(message){
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND;
}
}

module.exports = notFoundError;
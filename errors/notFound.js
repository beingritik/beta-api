const {StatusCodes} = require('http-status-codes');
const customApiError = require('./customapi')

class notFoundError extends customApiError{
constructor(message){
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND;
}
}

module.exports = notFoundError;






// class Error {
//   constructor(message) {
//     this.message = message;
//     this.name = "Error"; // (different names for different built-in error classes)
//     this.stack = <call stack>; // non-standard, but most environments support it
//   }
// }
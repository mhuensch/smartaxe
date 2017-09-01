// Create a new object, that prototypically inherits from the Error constructor
function AppError (message, redirect) {
  this.name = 'Whoops'
  this.message = message || 'General Error'
  this.redirect = redirect
  this.stack = (new Error()).stack
}

AppError.prototype = Object.create(Error.prototype)

AppError.prototype.constructor = AppError

export default AppError

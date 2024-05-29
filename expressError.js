class ExpressError extends Error {
  constructor(message, status){
    super()
    this.message = message
    this.status = status
    console.error(this.stack)//stack is defined because we extend Error 
  }
}

module.exports = ExpressError
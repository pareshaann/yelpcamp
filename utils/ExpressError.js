class ExpressError extends Error{
    constructor(message, status){                   //defined own custom Error class
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;
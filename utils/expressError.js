class ExpressError extends Error {
    constructor(statuscode=500, message="Something went wrong!") {
        super();
        this.statuscode = statuscode;
        this.message = message;
    }
}

module.exports = ExpressError;
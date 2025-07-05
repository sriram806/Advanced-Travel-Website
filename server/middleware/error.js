import ErrorHandler from "../utils/ErrorHandler.js";

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error!"

    if (err.name === "CastError") {
        const message = 'Resource not found. Invalid ' + err.path;
        err = new ErrorHandler(message, 400);
    }

    // Handle duplicate key error
    if (err.code === 11000) {
        const message = 'Duplicate ' + Object.keys(err.keyValue) + ' entered';
        err = new ErrorHandler(message, 400);
    }

    // Handle wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = 'JSON Web Token is invalid, try again';
        err = new ErrorHandler(message, 401);
    }

    // Handle JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = 'JSON Web Token has expired, try again';
        err = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export default errorHandler;

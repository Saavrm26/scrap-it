const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api"))
    res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      error: err.error,
      message: err.message,
      stack: err.stack,
      ...err,
    });
  else
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
};

const sendErrorProduction = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //Programming or other unknown error
      res.status(500).json({
        status: "error",
        message: "Something went very wrong",
      });
    }
  } else if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: err.title,
      message: err.message,
    });
  } else {
    //Programming or other unknown error
    res.status(500).render("error", {
      title: "Something went wrong",
      msg: "Sorry Please try again",
    });
  }
};

const handleJWTError = () => new AppError("Invalid Token. Please log in", 401);

const handleTokenExpiredError = () =>
  new AppError("Token expired. Login again", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    // duplicate
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProduction(error, req, res);
  }
};

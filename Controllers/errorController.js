import CustomError from "./../utils/CustomError.js";

const devErrors = (res, error) => {
  console.log("dev error called");
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!!! Please try again later",
    });
  }
};

const castErrorHandler = (err) => {
  const msg = `Invalid value ${err.value} for field ${err.path}`;
  return new CustomError(msg, 500);
};

const duplicateKeyErrorHandler = (error) => {
  const name = error.keyValue.name;
  const msg = `There is already a movie with name ${name}. Please use another value`;
  console.log(name);
  return new CustomError(msg, 500);
};

const handleExpiredJWT = (err) => {
  return new CustomError("JWT has expired. Please try again later", 400);
};

const handleJWTError = (err) => {
  return new CustomError("Invalid token please try again", 400);
};

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  console.log("dev error called");
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development;") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };

    if (err.name === "CastError") {
      err = castErrorHandler(err);
    }
    prodErrors(res, error);
  }

  if (error.name == "TokenExpiredError") error = handleExpiredJWT(error);

  if (error.name === "JsonWebTokenError") error = handleJWTError(error);

  next();
};

export default errorHandler;

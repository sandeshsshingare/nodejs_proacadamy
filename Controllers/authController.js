import CustomError from "../utils/CustomError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "./../models/userModal.js";
import jwt from "jsonwebtoken";
import util from "util";
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //   const { email, password } = req.body;
  if (!email || !password) {
    const error = new CustomError(
      "Please provide email ID & Password for login",
      400
    );
    return next(error);
  }
  const user = await User.findOne({ email }).select("+password");
  //check if user exists with given email
  const isMatch = await user.comparePasswordInDb(password, user.password);

  if (!user || !isMatch) {
    const error = new CustomError("Incorrect email or password", 400);
    return next(error);
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  console.log("hello");
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    console.log("hiii");
    token = testToken.split(" ")[1];
  }
  if (!token) {
    next(new CustomError("You are not logged in ", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      "The user with give token dose not exits",
      401
    );
    next(error);
  }

  const isPasswordChange = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChange) {
    const error = new CustomError(
      "The password has been changed recently. Please login again.",
      401
    );
    return next(error);
  }
  req.user = user;

  console.log(decodedToken);
  next();
});

const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "You do not have permission to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const error = new CustomError(
      "We could not find the user with given email",
      404
    );
    next(error);
  }

  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });
});

const resetPassword = (req, res, next) => {};

let object = {
  signup,
  protect,
  login,
  restrict,
  forgotPassword,
  resetPassword,
};
export default object;

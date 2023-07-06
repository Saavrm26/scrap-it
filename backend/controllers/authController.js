const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper functions

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendToken = (status, id, data, res) => {
  const token = signToken(id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  let filteredData;
  if (data) {
    filteredData = Object({ ...data._doc });
    filteredData = {
      ...filteredData,
      password: undefined,
      role: undefined,
      active: undefined,
    };
  }

  res.status(status).json({
    status: 'success',
    token,
    data: filteredData,
  });
};

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return next();

    // verifying token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user exists
    const currentUser = await User.findById(decoded.id).select(
      '+passwordChangedAt'
    );
    if (!currentUser) {
      return next();
    }

    // checking if password was changed after token was regenerated
    if (
      currentUser.changedPasswordAfter(
        currentUser.passwordChangedAt,
        decoded.iat
      )
    ) {
      return next();
    }
    // user is logged in
    res.locals.user = currentUser;
  } catch {
    /* empty */
  }
  next();
};

const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  //checking if token exists
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    throw new AppError('User not logged in', 401);
  }

  // verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exists
  const currentUser = await User.findById(decoded.id).select(
    '+passwordChangedAt'
  );
  if (!currentUser) {
    throw new AppError('The user no longer exists');
  }

  // checking if password was changed after token was regenerated
  if (
    currentUser.changedPasswordAfter(currentUser.passwordChangedAt, decoded.iat)
  ) {
    throw new AppError(
      'Password changed recently. Login again to generate a new token'
    );
  }

  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

// always comes after the protect middleware
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('User does not have permission to perform this action'),
        403
      );
    next();
  };

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  sendToken(201, newUser._id, newUser, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email and password required', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkCorrectPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  sendToken(200, user._id, undefined, res);
});

const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { expires: new Date(Date.now() + 10 * 1000) });
  res.status(200).json({ message: 'success' });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // check if user with provided email exists
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);
  // generating the password reset token from createPasswordToken instance method of a user documnet
  const resetToken = user.createPasswordResetToken();

  //additional info, vlaidating some fields before saving, user.validate({ pathsToSkip: ['password', 'passwordConfirm'] });
  await user.save({ validateBeforeSave: false });

  // send the email to the user

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    res.status(200).json({
      staus: 'success',
      data: {
        resetURL,
      },
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      'There was an error sending the email.Please try again later'
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // create hash for the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // check if the given hash token exists and the token has not expired in our database and get the user to which it belongs
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  // throw error if the token doesn't exists in the database or if it doesn't exists
  if (!user) throw new AppError('Invalid token', 400);
  // change the password and the corresponding fields
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  sendToken(200, user._id, undefined, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // get the user id from the request modified by protect middleware
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  //check if the oldPassword is valid or not
  if (!(await user.checkCorrectPassword(oldPassword, user.password)))
    throw new AppError('Wrong password', 401);

  // set the password, password matching is taken care by a presave validation middleware
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  // save the document
  await user.save();

  // since the passwordChangedAt is caluculated by a presave validation middleware, we just have to send the jwt
  sendToken(200, user._id, undefined, res);
});

module.exports = {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};

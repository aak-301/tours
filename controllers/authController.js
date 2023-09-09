const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and passwod', 400));
  }

  // 2) Check is user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPasswor(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send tken to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check f it exist
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belong to this token does not exist'));
  }

  // 4) Check if user changed password after the token was issued
  if (!currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!. Please login again', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  // roles is an array =. ['admin','lead-guide]
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have the permisson toperform this action', 403)
      );
    }
    next();
  };
};

exports.forgetPasword = catchAsync(async (req, res, next) => {
  //1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  //2) generate the random token
  const resetToken = user.createPaswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send it bck to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPasword/${resetToken}`;

  const mesage = `Forgot your passwod? Submit a PATHC request with your new password and passwordConfirm to: ${resetUrl}.\nIf your don't forget your password, please ignore this email`;

  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 minutes)',
    mesage,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
  next();
});
exports.resetPasword = catchAsync(async (req, res, next) => {});

const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const { promisify } = require("util");
const Email = require("./../utils/email");
const crypto = require("crypto");

const signToken = ({ id }) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
   });
};

const createSendToken = (user, statusCode, res) => {
   const token = signToken({ id: user._id });
   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
   };

   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

   user.password = undefined;

   res.cookie("jwt", token, cookieOptions);

   res.status(statusCode).json({
      status: "success",
      token,
      data: { user },
   });
};

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      // photo: req.body.photo,
      // role: req.body.role,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      // passwordChangedAt: req.body.passwordChangedAt,
   });

   const url = `${req.protocol}://${req.get("host")}/me`;
   console.log("authController.signup: ", url);

   await new Email(newUser, url).sendWelcome();

   createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
   }

   const user = await User.findOne({ email: email }).select("+password");

   if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
   }

   createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
   res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
   });
   res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
   }

   if (req.cookies.jwt) token = req.cookies.jwt;

   if (!token) {
      return next(new AppError(`Your are not logged in! Please log in to get access`, 401));
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
      return next(new AppError("The user of this token no longer exists!", 401));
   }

   if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("User recently changed password. Please log in again", 401));
   }

   req.user = currentUser;
   // 4) ADD THE USER INTO FO THE RES.LOCALS.USER
   /*
      Adding the user object to the response, we'll ge able to get the user information to be used in all of the templates we need.
   */
   res.locals.user = currentUser;
   // 4.1) Now we need to create the getAccount function.
   // goto viewController.js

   next();
});

exports.isLoggedIn = async (req, res, next) => {
   try {
      if (req.cookies.jwt) {
         const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

         const currentUser = await User.findById(decoded.id);
         if (!currentUser) {
            return next();
         }

         if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
         }

         res.locals.user = currentUser;
         return next();
      }
      next();
   } catch (err) {
      return next();
   }
};

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new AppError("You do not have permission to peform this action", 403));
      }

      next();
   };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
   const user = await User.findOne({ email: req.body.email });
   if (!user) {
      return next(new AppError("Ther is no user with this email address", 404));
   }

   const resetToken = user.createPasswordResetToken();

   await user.save({ validateBeforeSave: false });

   try {
      const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
         status: "success",
         message: "Token sent to email!",
      });
   } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("The was an error sending the email. Try again later", 500));
   }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
   const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

   const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpiresAt: { $gte: Date.now() } });

   if (!user) {
      return next(new AppError(`Token is invalid or expired'`, 400));
   }

   user.password = req.body.password;
   user.passwordConfirmation = req.body.passwordConfirmation;
   user.passwordResetToken = undefined;
   user.passwordResetExpiresAt = undefined;

   await user.save();

   createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user.id).select("+password");

   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError("Your current password is wrong", 401));
   }

   user.password = req.body.password;
   user.passwordConfirmation = req.body.passwordConfirmation;
   await user.save();

   createSendToken(user, 200, res);
});

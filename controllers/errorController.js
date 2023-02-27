const AppError = require("./../utils/appError");

const sendErrorDev = (err, req, res) => {
   if (req.originalUrl.startsWith("/api")) {
      if (err.isOperational) {
         return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
      }

      return res.status(err.statusCode).json({
         status: err.status,
         error: err,
         message: err.message,
         stack: err.stack,
      });
   }

   if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
         title: "Something went wrong",
         message: err.message,
      });
   }

   console.log("sendErrorDev (unknown 🔥): ", err);

   return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: err.message,
   });
};

const sendErrorProd = (err, req, res) => {
   if (req.originalUrl.startsWith("/api")) {
      if (err.isOperational) {
         return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
      }

      return res.status(500).json({
         status: "error",
         message: "Something went very wrong!",
      });
   }
   if (err.isOperational) {
      console.log("sendErrorProd (operational 🔥): ", err);
      return res.status(err.statusCode).render("error", {
         status: err.status,
         message: err.message,
      });
   }

   return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: "Please try again later",
   });
};

const handleCastErrorDB = (err) => {
   const message = `Invalid ${err.path}: ${err.value}.`;
   return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
   const value = err.keyValue.name;
   const message = `Duplicated filed value: ${value}. Please enter another `;
   return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
   const fields = Object.keys(err.errors);
   const errors = fields.map((field) => err.errors[field].properties.message);

   const message = `Invalid input data: ${errors.join(". ")}.`;
   return new AppError(message, 400);
};

const handleJWTError = () => {
   return new AppError(`Invalid token. Please log in again!`, 401);
};

const handleJWTExpired = () => {
   return new AppError(`This token has expired. Please log in again!`, 401);
};

module.exports = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || "error";
   if (process.env.NODE_ENV === "development") {
      sendErrorDev(err, req, res);
   } else if (process.env.NODE_ENV === "production") {
      let error = { ...err };
      error.message = err.message;

      if (error.name === "CastError") error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldDB(error);
      if (error._message === "Validation failed" && error.statusCode === 500) error = handleValidationErrorDB(error);
      if (error.name === "JsonWebTokenError") error = handleJWTError();

      if (error.name === "TokenExpiredError") error = handleJWTExpired();

      sendErrorProd(error, req, res);
   }
};

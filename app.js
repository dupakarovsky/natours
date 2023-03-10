const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const AppError = require("./utils/appError");
const compression = require("compression");
const cors = require("cors");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const bookingRouter = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");

const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();

// IMPLMENTING SCREEN MESSAGES
/*
   Finally we'll implement an alert message whenever the user books a new tour. However the alert function is in the javascript frontEnd and not in the server side.
   We'll need to wait until the page reloads to display the message. We'll add a data attribute in the body of the pug. template. Define an ALERT variable for the frontend to pick when the page loads. 
   To make the ALTER variable in the tamplate we'll need to add an 'alert' keyword on the query string and have a middleware to take the alert keyword and put an alerte message on RESPONSE.LOCALS, which will be available as a variable in all templates.
*/

// 1) EDIT THE BASE.PUG TEMPLATE
// goto base.pug and add a termnary operator to check if the 'alert' variable is preset.
// the, goto bookingController.js

app.enable("trust proxy");

if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.use(cors());

app.options("*", cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(
   helmet.contentSecurityPolicy({
      directives: {
         "script-src": ["'self'", "cdnjs.cloudflare.com", "js.stripe.com"],
         "style-src": ["'self'", "fonts.googleapis.com", "unpkg.com"],
         "img-src": ["'self'", "*.openstreetmap.org", "unpkg.com", "data:"],
         "connect-src": ["'self'", "http://127.0.0.1:3000/*"],
         "frame-src": ["'self'", "js.stripe.com"],
      },
   })
);

const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: "Too many request from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.post("/webhook-checkout", express.raw({ type: "application/json" }), bookingController.webhookCheckout);

app.use(
   express.json({
      limit: "10kb",
   })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
   hpp({
      whitelist: ["duration", "ratingsQuantity", "ratingsAvarage", "maxGroupSize", "price", "difficulty"],
   })
);

app.use(compression());

app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings/", bookingRouter);

app.all("*", (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

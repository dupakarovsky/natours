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

//3.1) Require in the bookingController.
const bookingRouter = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");

const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();

// IMPLEMENTING WEBHOOKS IN STRIPE
/*
   In the bookingRoutes, the getCheckoutSession is called to create a new booking. 
   Call for Stripe checkout session and wait for completion. Stripe calls the success_url, which in turn creates a new booking in the database

   Now we'll add a webhook in the Stripe dashboard. Stripe will make a POST request whenever a checkout session is completed. Sends the original session data back. Which is why we need a live website to Stripe can make a POST request

   WE CAN NOT TEST THIS LOCALLY WITH THE STRIPE CLI
*/

//1) IN STIRPE WEBSITE
/*
   In the dash board add create a webhook: https://tired-tuxedo-fox.cyclic.app/webhook-checkout
   When a payment is complete Stripe will make a POST request to this endpoint with the session data.

   Select the Event to Listen To: checkout.session.completed.

   Now we'll need a route for the /webhook-checkout.

*/
// goto app.js above app.use(express.json()).

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

//2) ADD THE ROUTE FOR WEBHOOK-CHECKOUT
/*
   For Stripe will make a POST request to the /webhook-checkout endpoint when a successful checkout event is completed.
*/
// Add a route for listening to POST requests.

// 3) CREATE THE HANDLER FOR THE WEBHOOK-CHECKOUT
/*
   We need to import the bookingController here in the app.js
   We need to use the the EXPRESS.RAW middleware to pass the data into the handler to this route so the Stripe funciton can read the request
   Add in the webhookCheckout as the handler to listen to POST request from STRIPE. I'll need a RAW DATASTREAM
*/
app.post("/webhook-checkout", express.raw({ type: "application/json" }), bookingController.webhookCheckout);
// Now to implement the handler.
// goto bookingController.js

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

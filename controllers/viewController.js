const Tour = require("../model/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../model/userModel");
const Booking = require("../model/bookingModel");

//4) ADD THE ALERTS MIDDLEWARE
// Here si just set to booking. But we could use this middleware to set up different alert messages by simply chaning the queyry string value
exports.alerts = (req, res, next) => {
   //4.1) Get the alert valeu from the query string comming from Stripe succes_url
   const alert = req.query.alert;
   if (alert === "booking") {
      //4.2) Add the alert property to the locals object, which will become avaiable in the template
      res.locals.alert = "Your booking was successful. Please check you email for details.";
   }
   next();
};
// now go to index.js to read the data-alert variable in the html and then display it.
// goto index.js

exports.getOverview = catchAsync(async (req, res, next) => {
   const tours = await Tour.find();

   res.status(200).render("overview", {
      title: "All tours",
      tours: tours,
   });
});

exports.getTour = catchAsync(async (req, res, next) => {
   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: "reviews",
      fields: "review rating user",
   });

   if (!tour) return next(new AppError("There is no tour with that name", 404));

   res.status(200).render("tour", {
      title: `${tour.name} Tour`,
      tour,
   });
});

exports.getLoginForm = (req, res) => {
   res.status(200).render("login", {
      title: `Login to your account`,
   });
};

exports.getAccount = (req, res) => {
   res.status(200).render("account", {
      title: "Your account",
   });
};

exports.getMyTours = catchAsync(async (req, res) => {
   const bookings = await Booking.find({ user: req.user.id });

   const tourIDs = bookings.map((el) => el.tour);

   const tours = await Tour.find({ _id: { $in: tourIDs } });

   res.status(200).render("overview", {
      title: "My Tours",
      tours: tours,
   });
});

exports.updateUserData = catchAsync(async (req, res) => {
   const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
         name: req.body.name,
         email: req.body.email,
      },
      {
         new: true,
         runValidators: true,
      }
   );

   res.status(200).render("account", {
      title: "Your accout",
      user: updatedUser,
   });
});

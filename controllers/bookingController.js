const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   const tour = await Tour.findById(req.params.tourId);

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${
         tour.price
      }`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,

      line_items: [
         {
            price_data: {
               currency: "usd",
               unit_amount: tour.price * 100,
               product_data: {
                  name: `${tour.name} Tour`,
                  description: tour.summary,
                  // images: [`https://picsum.photos/id/128/367/267`],
                  images: [`${getTourImage(tour.imageCover)}`],
               },
            },
            quantity: 1,
         },
      ],
      mode: "payment",
   });

   res.status(200).json({
      status: "success",
      session,
   });
});

exports.createBookingCheckout = async (req, res, next) => {
   try {
      const { tour, user, price } = req.query;

      if (!tour && !user && !price) return next();

      await Booking.create({ tour, user, price });
      const rootUrl = req.originalUrl.split("?")[0];
      console.log("bookingController.createBookingCheckout:", rootUrl);

      res.redirect(rootUrl);
   } catch (err) {
      showAlert("err", err);
      console.log(err);
   }
};

exports.createBooking = factory.createOne(Booking);

exports.getAllBookings = factory.getAll(Booking);

exports.getBooking = factory.getOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);

const getTourImage = (coverImg) => {
   const imagesArray = [
      "https://imgur.com/upumzBj.jpg",
      "https://imgur.com/ZaBAIGm.jpg",
      "https://imgur.com/o78XfKY.jpg",
      "https://imgur.com/arVGWBW.jpg",
      "https://imgur.com/Y88itoH.jpg",
      "https://imgur.com/pPHpZBA.jpg",
      "https://imgur.com/okn4XzQ.jpg",
      "https://imgur.com/wVycomD.jpg",
      "https://imgur.com/2064IBO.jpg",
      "https://imgur.com/HChWcgl.jpg",
   ];
   let img = coverImg.split("-")[1];
   const imgReturned = typeof +img !== "number" ? imagesArray.at(-1) : imagesArray.at(img - 1);
   console.log("bookingController.getTourImage:", img, imgReturned);
   return imgReturned;
};

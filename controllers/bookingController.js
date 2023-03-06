const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel");
const User = require("../model/userModel");

const createWebhookBooking = async (session) => {
   try {
      const tour = session.client_reference_id;
      const user = (await User.findOne({ email: session.customer_email })).id;
      const price = session.amount_total / 100;

      await Booking.create({ tour, user, price });
   } catch (err) {
      console.log(err);
   }
};

// 2) ADD ALERT TO SUCCESS_URL
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   const tour = await Tour.findById(req.params.tourId);

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      //2.1) Add the query string /?alert=booking
      success_url: `${req.protocol}://${req.get("host")}/my-tours/?alert=booking`,
      // now we need a middleware that will run for all requests
      // go to viewRoutes.js

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
                  images: [`${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`],
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

exports.webhookCheckout = (req, res, next) => {
   let event;
   try {
      const signature = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
   } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
   }

   if (event.type === "checkout.session.completed") {
      createWebhookBooking(event.data.object);
      res.status(200).json({ received: true });
   }
};

exports.createBooking = factory.createOne(Booking);

exports.getAllBookings = factory.getAll(Booking);

exports.getBooking = factory.getOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);

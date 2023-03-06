const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel");
const User = require("../model/userModel");

//9) CREATE THE CREATE BOOKING FUNCTION
/*
   The function will create a booking in the database
*/
const createWebhookBooking = async (session) => {
   try {
      // 9.2) Create a variable to hold the tour id
      const tour = session.client_reference_id;
      // 9.3) Create a variable to hold the user. We'll need to query the database to get the user from their email. This will return the entire user object, but we only want the id
      const user = (await User.findOne({ email: session.customer_email })).id;
      // 9.4) Create a variable to store the price. To set in dollars, divide it by 100
      const price = session.amount_total / 100;
      // 9.1) Create a new booking using the user's id, price and tour id. The tour id is stored in the session data, in the client_reference_id variable. The user we can find by their email, which stored in the customer_email variable. The price we'll get from the line_items variable, which will need to be in dollars (not cents)
      console.log(user, tour, price);

      await Booking.create({ tour, user, price });
   } catch (err) {
      console.log(err);
   }
};

// 10 ) COMMIT AND TEST IT OUT

// 7) SET THE SUCCESS_URL BACK TO NORMAL
/*
   The success_url won't have the query parameters anymore, as it won't be createBookingCheckout() which will create the bookings, but the webhookCheckout()
   The success URL should now just be /my-tours
*/
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   const tour = await Tour.findById(req.params.tourId);

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      // 7.1) Success URL is now the /my-tours endpoint.
      success_url: `${req.protocol}://${req.get("host")}/my-tours`,

      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,

      //7.2) Since the website is now live, we can replace the images function with the images from the live website
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

// 5) DISABLE THE FUNCTION
/*
   webhookCheckout will handle the createion of bookings from now on
   exports.createBookingCheckout = async (req, res, next) => {
   try {
      const { tour, user, price } = req.query;

      if (!tour && !user && !price) return next();

      await Booking.create({ tour, user, price });
      const rootUrl = req.originalUrl.split("?")[0];

      res.redirect(rootUrl);
   } catch (err) {
      showAlert("err", err);
      console.log(err);
 };

    also disable it in the viewRoutes.js
*/
// goto viewRoutes.js

// 4) CREATE THE HANDLER FOR THE WEBHOOK ROUTE
// 8) IMPLEMENT THE WEBHOOKCHECKOUT
/*
   This function recevies the request body and creates an event together using the signature and secret. The event will contain the session data. Which will be used to createa a new booking in the database 
*/

exports.webhookCheckout = (req, res, next) => {
   let event;
   try {
      //8.1) Stripe adds a header with a signature to the request body.
      const signature = req.headers["stripe-signature"];

      //8.2) Create stripe Event. Uses the custrucEvent function which needs the RAW data from body. Needs also the signature and secret.
      // Add the secret to the config.env and the Cyclic Environmental Variables.
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
   } catch (err) {
      // 8.3) In case there's an error, send an error message to Stripe
      return res.status(400).send(`Webhook error: ${err.message}`);
   }

   //8.4) Check for the event type.
   if (event.type === "checkout.session.completed") {
      // If it's checkout.session.completed then execute a function to create a booking. This function will need the event data
      console.log("calling createWebhookBooking");

      createWebhookBooking(event.data.object);
      res.status(200).json({ received: true }); // send a response back to Stripe
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
   return imgReturned;
};

const express = require("express");
const viewController = require("../controllers/viewController");
const router = express.Router();
const authController = require("./../controllers/authController");
const bookingController = require("../controllers/bookingController");

//Moved createBookingCheckout to /mytours
router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getAccount);

// moved here
// router.get("/my-tours", bookingController.createBookingCheckout, authController.protect, viewController.getMyTours);

// 6) REMOVE THE CREATEBOOKINGCHECKOUT MIDDELWARE
// Creation of bookings will now be handled by the createWebhookBooking function.
router.get("/my-tours", authController.protect, viewController.getMyTours);
// goto bookingController.js

router.post("/submit-user-data", authController.protect, viewController.updateUserData);

module.exports = router;

const express = require("express");
const viewController = require("../controllers/viewController");
const router = express.Router();
const authController = require("./../controllers/authController");
const bookingController = require("../controllers/bookingController");

// 3) ADD A MIDDLEWARE
// this middleware is called alerts and it'll take the 'alert' query string and put in it  response.locals
// all request comming to the website (the frontend) will go throught this middleware.
router.use(viewController.alerts);
// goto viewController.js

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getAccount);

router.get("/my-tours", authController.protect, viewController.getMyTours);

router.post("/submit-user-data", authController.protect, viewController.updateUserData);

module.exports = router;

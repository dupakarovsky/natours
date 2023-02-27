const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:id/reviews", reviewRouter);

router.route("/tour-stats").get(tourController.getTourStats);

router
   .route("/monthly-plan/:year")
   .get(
      authController.protect,
      authController.restrictTo("admin", "lead-guide", "guide"),
      tourController.getMonthlyPlan
   );

router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router.route("/top-5-tours").get(tourController.alias, tourController.getAllTours);

router
   .route("/")
   .get(tourController.getAllTours)
   .post(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.createTour);

router
   .route("/:id")
   .get(tourController.getTour)
   .patch(
      authController.protect,
      authController.restrictTo("admin", "lead-guide"),
      tourController.uploadTourImages,
      tourController.resizeTourImages,
      tourController.updateTour
   )
   .delete(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.deleteTour);

module.exports = router;

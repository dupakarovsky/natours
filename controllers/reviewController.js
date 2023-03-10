const Review = require("../model/reviewModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.setTourUserIds = (req, res, next) => {
   if (!req.body.tour) req.body.tour = req.params.id;
   if (!req.body.user) req.body.user = req.user.id;

   next();
};
exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

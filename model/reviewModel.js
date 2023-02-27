const mongoose = require("mongoose");
const slufigy = require("slugify");
const Tour = require("./tourModel");

const reviewSchema = mongoose.Schema(
   {
      review: {
         type: String,
         required: [true, "A review must be entered"],
         trim: true,
      },
      rating: {
         type: Number,
         default: 4.5,
         min: [1, "Rating must be equal or above 1"],
         max: [5, "Rating must be equal or below 5"],
      },
      createdAt: { type: Date, default: Date.now(), select: false },
      tour: { type: mongoose.Schema.ObjectId, ref: "Tour", required: [true, "A review must belong to a tour"] },
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: [true, "A review must belong to a user"] },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
   this.populate({
      path: "user",
      select: "name photo",
   });
   next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
   const stats = await this.aggregate([
      {
         $match: { tour: tourId },
      },
      {
         $group: {
            _id: "$tour",
            nRatings: { $sum: 1 },
            avgRating: { $avg: "$rating" },
         },
      },
   ]);

   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: stats[0].nRatings,
         ratingsAverage: stats[0].avgRating,
      });
   } else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: 0,
         ratingsAverage: 4.5,
      });
   }
};

reviewSchema.post("save", function () {
   this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
   this.reviewToUpdate = await this.model.findOne(this.getQuery());
   next();
});

reviewSchema.post(/^findOneAnd/, async function () {
   await this.model.calcAverageRatings(this.reviewToUpdate.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

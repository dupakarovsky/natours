const mongoose = require("mongoose");
const slufigy = require("slugify");

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "A tour must have a name"],
         unique: true,
         trim: true,
         minlength: [10, "A tour name must have less or equal to 10 characters"],
         maxlength: [40, "A tour name must have less or equal to 40 characters"],
      },
      slug: { type: String },
      duration: { type: Number, required: [true, "A tour must have a duration"] },
      maxGroupSize: { type: Number, required: [true, "A tour must have a group size"] },
      difficulty: {
         type: String,
         required: [true, "A tour must have a difficulty"],
         enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulties available are: easy, medium and difficult",
         },
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, "Rating must be equal or above 1"],
         max: [5, "Rating must be equal or below 5"],

         set: function (val) {
            return Math.round(val * 10) / 10;
         },
      },
      ratingsQuantity: { type: Number, default: 0 },
      price: { type: Number, required: [true, "A price must have a value defined"] },
      priceDiscount: {
         type: Number,
         validate: {
            validator: function (val) {
               return val < this.price;
            },
            message: "Discount ({VALUE}) cannot be higher than the price",
         },
      },
      summary: { type: String, trim: true, required: [true, "A tour must have a description"] },
      description: { type: String, trim: true },
      imageCover: { type: String, required: [true, "A tour must have a cover image"] },
      images: [String],
      createdAt: { type: Date, default: Date.now(), select: false },
      startDates: [Date],
      secretTour: {
         type: Boolean,
         default: false,
      },
      startLocation: {
         type: {
            type: String,
            default: "Point",
            enum: ["Point"],
         },
         coordinates: [Number],
         address: String,
         description: String,
      },
      locations: [
         {
            type: {
               type: String,
               default: "Point",
               enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
         },
      ],
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: "User",
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
   return this.duration / 7;
});

tourSchema.virtual("reviews", {
   ref: "Review",
   foreignField: "tour",
   localField: "_id",
});

tourSchema.pre("save", function (next) {
   this.slug = slufigy(this.name, { lower: true });
   next();
});

tourSchema.post("save", function (document, next) {
   console.log(`${document.name} tour was saved to the database.`);
   next();
});

tourSchema.pre(/^find/, function (next) {
   this.startTime = Date.now();
   this.find({ secretTour: { $ne: true } });
   next();
});

tourSchema.pre(/^find/, function (next) {
   this.populate({
      path: "guides",
      select: "-__v -passwordChangedAt",
   });
   next();
});

tourSchema.post(/^find/, function (documents, next) {
   console.log(`Query took ${Date.now() - this.startTime}ms to run`);
   next();
});

tourSchema.pre("aggregate", function (next) {
   if (this.pipeline().at(0).$geoNear) {
      next();
   } else {
      this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
      next();
   }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

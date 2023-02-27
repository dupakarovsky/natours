const Tour = require("../model/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

// const multerStorage = multer.diskStorage({
//    destination: (req, file, cb) => {
//       cb(null, "public/img/users");
//    },
//    filename: (req, file, cb) => {
//       const ext = file.mimetype.split("/")[1];
//       cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//    },
// });

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith("image")) {
      cb(null, true);
   } else {
      cb(new AppError("File is not an image.", 404), false);
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
   { name: "imageCover", maxCount: 1 },
   { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
   if (!req.files.imageCover || !req.files.images) return next();

   const imgCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

   const cover = await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`public/img/tours/${imgCoverFilename}`);

   if (!cover) return next(new AppError("Something went wrong while processing your image :(", 500));

   req.body.imageCover = imgCoverFilename;

   req.body.images = [];

   await Promise.all(
      req.files.images.map(async (file, idx) => {
         const imgFilename = `tour-${req.params.id}-${Date.now()}-${idx + 1}.jpeg`;

         const image = await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(`public/img/tours/${imgFilename}`);

         req.body.images.push(imgFilename);
      })
   );

   next();
});

exports.alias = (req, res, next) => {
   req.query.limit = "5";
   req.query.sort = `-ratingsAvarage,price`;
   req.query.fields = `name,ratingsAvarage,price,summary,difficulty`;
   next();
};

exports.createTour = factory.createOne(Tour);

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
   const stats = await Tour.aggregate([
      {
         $match: { ratingsAvarage: { $gte: 4.0 } },
      },
      {
         $group: {
            _id: "$difficulty",

            avgRating: { $avg: "$ratingsAvarage" },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            numRatings: { $sum: "$ratingsQuantity" },
            numTours: { $sum: 1 },
         },
      },
      {
         $sort: { numTours: 1 },
      },
   ]);

   res.status(200).json({
      status: "success",
      data: { stats },
   });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
   const year = +req.params.year;
   const plan = await Tour.aggregate([
      {
         $unwind: "$startDates",
      },
      {
         $match: {
            startDates: {
               $gte: new Date(`${year}-01-01`),
               $lte: new Date(`${year}-12-31`),
            },
         },
      },
      {
         $group: {
            _id: { $month: "$startDates" },
            numToursStarts: { $count: {} },
            tours: { $push: "$name" },
         },
      },
      {
         $addFields: { month: "$_id" },
      },
      {
         $project: { _id: 0 },
      },
      {
         $sort: { numToursStarts: -1, month: 1 },
         // $sort: { month: 1 },
      },
      {
         $limit: 12,
      },
   ]);

   res.status(200).json({
      status: "success",
      data: { plan },
   });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
   const { distance, latlng, unit } = req.params;

   const [lat, lng] = latlng.split(",");

   if (!lat || !lng) next(new AppError("Please provide longitude and latitude in format: lat,lan", 400));

   const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

   const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
   });

   res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
         data: tours,
      },
   });
});

exports.getDistances = catchAsync(async (req, res, next) => {
   const { latlng, unit } = req.params;
   const [lat, lng] = latlng.split(",");

   if (!lat || !lng) next(new AppError("Please provide longitude and latitude in format: lat,lan", 400));

   const multiplyer = unit === "mi" ? 0.000621371 : 0.001;

   const distances = await Tour.aggregate([
      {
         $geoNear: {
            near: {
               type: "Point",
               coordinates: [lng * 1, lat * 1],
            },

            distanceField: "distance",
            distanceMultiplier: multiplyer,
         },
      },
      {
         $project: {
            distance: 1,
            name: 1,
         },
      },
   ]);

   res.status(200).json({
      status: "success",
      data: {
         data: distances,
      },
   });
});

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (model) => {
   return catchAsync(async (req, res, next) => {
      const document = await model.findByIdAndDelete(req.params.id);

      if (!document) {
         return next(new AppError("Not tour found with that ID", 404));
      }
      res.status(204).json({
         status: "success",
         data: null,
      });
   });
};

exports.updateOne = (model) => {
   return catchAsync(async (req, res, next) => {
      const document = await model.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      if (!document) {
         return next(new AppError("Not document found with that ID", 404));
      }

      res.status(200).json({
         status: "success",
         data: { data: document },
      });
   });
};

exports.createOne = (model) => {
   return catchAsync(async (req, res, next) => {
      const document = await model.create(req.body);

      res.status(201).json({
         status: "success",
         data: {
            data: document,
         },
      });
   });
};

exports.getOne = (model, popOptions) => {
   return catchAsync(async (req, res, next) => {
      let query = model.findById(req.params.id);

      if (popOptions) query = query.populate(popOptions);

      const document = await query;

      if (!document) {
         return next(new AppError("Not tour found with that ID", 404));
      }

      res.status(200).json({
         status: "success",
         data: document,
      });
   });
};

exports.getAll = (model) => {
   return catchAsync(async (req, res, next) => {
      let filter = {};
      if (req.params.id) filter = { tour: req.params.id };

      const features = new APIFeatures(model.find(filter), req.query).filter().sort().limitFileds().paginate();

      const document = await features.query;

      res.status(201).json({
         status: "success",
         results: document.length,
         data: document,
      });
   });
};

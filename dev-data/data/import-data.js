const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../model/tourModel");
const User = require("../../model/userModel");
const Review = require("../../model/reviewModel");

dotenv.config({ path: "./config.env" });
const DB = "mongodb+srv://superdupa:1478963456Atlas@cluster0.esxjoda.mongodb.net/natours";

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, { encoding: "utf-8" }));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, { encoding: "utf-8" }));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, { encoding: "utf-8" }));

mongoose
   .connect(DB)
   .then(() => console.log("Connected to Remote Database"))
   .catch((err) => console.log("Error: ", err));

const saveToMongo = async () => {
   try {
      await Tour.create(tours);
      await User.create(users, { validateBeforeSave: false });
      await Review.create(reviews);
      console.log("Saving tours, users and reviews to database");
   } catch (err) {
      console.log(err);
   } finally {
      console.log("Import completed");
      process.exit();
   }
};

const deleteFromMongo = async () => {
   try {
      await Review.deleteMany();
      await User.deleteMany();
      await Tour.deleteMany();
      console.log("Deleting all tours, users and reviews from database");
   } catch (err) {
      console.log(err);
   }
};

// deleteFromMongo();

saveToMongo();

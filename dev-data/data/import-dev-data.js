const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const Tour = require("../../model/tourModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose
   .connect(DB)
   .then(() => {
      console.log("DB connection successful");
   })
   .catch((err) => {
      console.log("Could not connect:", err);
   });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, { encoding: "utf-8" }));

const importData = async () => {
   try {
      await Tour.create(tours);
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

const deleteData = async () => {
   try {
      await Tour.deleteMany();
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

if (process.argv[2] === "--import") {
   importData();
} else if (process.argv[2] === "--delete") {
   deleteData();
}

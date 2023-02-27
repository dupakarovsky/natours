const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 3000;

process.on("unhandledRejection", (err) => {
   console.log("UNHANDLED REJECTION: 💥 Shutting down server...");
   console.log(err.name, err.message);
   server.close(() => {
      process.exit(1);
   });
});

process.on("uncaughtException", (err) => {
   console.log("UNCHAUGHT EXCEPTION: 💥 Shutting down server...");
   console.log(err.name, err.message);
   server.close(() => {
      process.exit(1);
   });
});

process.on("SIGTERM", () => {
   console.log("🕑 SIGTERM Received. Shutting down application");
   server.close(() => {
      console.log("Process terminated");
   });
});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
   console.log("DB connection successful. Beginning port listening...");
   app.listen(port, () => {
      console.log(`Express set to: ${process.env.NODE_ENV}...`);
      console.log(`Server running on port ${port}...`);
   });
});

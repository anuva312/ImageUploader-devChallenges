const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const imageRouter = require("./routes/imageRoutes");

const PORT = process.env.PORT || 4000;
const app = express();

dotenv.config({ path: "./config.env" });

// Connect to DataBase

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("Connection to DB Successful🤩"));

// Middlewares

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/images", imageRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

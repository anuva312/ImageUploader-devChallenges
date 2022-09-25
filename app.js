const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const imageRouter = require("./routes/imageRoutes");

const app = express();

// Middlewares

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/api/v1/images", imageRouter);

module.exports = app;

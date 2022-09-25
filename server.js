const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 4000;

// Connect to DataBase
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("Connection to DB Successful 🤩"));

// Listen to the client
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

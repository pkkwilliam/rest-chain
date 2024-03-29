const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const { validateRequest } = require("./services/apiRequestValidator");
const RequestRouter = require("./routes/request");
const ChainRequestRouter = require("./routes/chainRequestRoute");
const { init } = require("./services/initService");

const app = express();
app.use(express.json());

// DOT ENV
dotenv.config();
const { MONGO_DB_URL, PORT } = process.env;

// DB
mongoose.connect(MONGO_DB_URL);
const mongo = mongoose.connection;
mongo.on("error", (error) => console.warn("Mongo Connection Error:", error));
mongo.once("open", () => console.log("Connected to MongoDB"));

// Route
app.use(logger);
app.use(
  "/chainRequest",
  async (req, res, next) => {
    try {
      const account = await validateRequest(req, res, next);
      req.body = { ...req.body, account };
      next();
    } catch (applicationException) {
      console.log(applicationException);
      res.status(applicationException.statusCode).json(applicationException);
    }
  },
  ChainRequestRouter
);

function logger(req, res, next) {
  console.log("original url:", req.originalUrl);
  next();
}

app.listen(PORT);

init();

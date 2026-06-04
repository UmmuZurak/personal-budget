const express = require("express");

// create express server
const app = express();

// add middleware for handling cors requests
const cors = require("cors");
app.use(cors());

// add middleware for parsing request bodies
const bodyParser = require("body-parser");
const apiRouter = require("./api");
app.use(bodyParser.json());

// get request to send "Hello World" message to http://localhost:3000/
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// envelopes routes
app.use("/api/envelopes", apiRouter);

module.exports = {
  app,
};

const express = require("express");

// create express server
const app = express();

// add middleware for handling cors requests
const cors = require("cors");
app.use(cors());

// add middleware for parsing request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());

module.exports = {
  app,
};

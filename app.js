const express = require("express");

// create express server
const app = express();

// add middleware for handling cors requests
const cors = require("cors");
app.use(cors());

// add middleware for parsing request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// import routes
const apiRouter = require("./api");
const transactionsRouter = require("./routes/transactions");

// import swagger ui packages 
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");

// get request to send "Hello World" message to http://localhost:3000/
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// envelopes routes
app.use("/api/envelopes", apiRouter);

// transaction routes
app.use("/api/transactions", transactionsRouter);

// swagger api documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = {
  app,
};

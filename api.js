const apiRouter = require("express").Router();

const ENVELOPES = [
  {
    id: 1,
    mount: 2000,
    balance: 2000,
    category: "food",
    amount_spent: 0,
  },
];
const TOTAL_COST = ENVELOPES.reduce((total, item) => (total += item.balance), 0);

const validateInput = (req, res, next) => {
  if (!req.body.amount) {
    return res.status(400).send("Amount is required.");
  }

  if (typeof req.body.amount !== "number" || Number(req.body.amount) <= 0) {
    return res.status(400).send("Amount must be a number and be greater than 0.");
  }

  if (!req.body.category) {
    return res.status(400).send("Catgeory is required.");
  }

  if (typeof req.body.category !== "string") {
    return res.status(400).send("Category must be a string.");
  }

  next();
};

// get request for fetching all envelopes
apiRouter.get("/", (req, res, next) => {
  res.send(ENVELOPES);
});

// create an envelope route
apiRouter.post("/", validateInput, (req, res, next) => {
  const envelope = {
    id: ENVELOPES.length + 1,
    amount: req.body.amount,
    category: req.body.category,
    balance: req.body.amount,
    amount_spent: 0,
  };

  ENVELOPES.push(envelope);

  res.status(201).send(envelope);
});

module.exports = apiRouter;

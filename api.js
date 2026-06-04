const apiRouter = require("express").Router();

const ENVELOPES = [
  {
    id: 1,
    amount: 2000,
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

  if (typeof Number(req.body.amount) !== "number" || Number(req.body.amount) <= 0) {
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

apiRouter.param("envelopeId", (req, res, next, envelopeId) => {
  const envelopeIndex = ENVELOPES.findIndex((envelope) => envelope.id === Number(envelopeId));
  if (envelopeIndex !== -1) {
    req.envelopeId = envelopeId;
    req.envelopeIndex = envelopeIndex;
    req.envelope = ENVELOPES[envelopeIndex];

    next();
  } else {
    res.status(404).send(`Envelope with ID ${envelopeId} not found.`);
  }
});

// get request for fetching all envelopes
apiRouter.get("/", (req, res, next) => {
  res.send(ENVELOPES);
});

// create an envelope route
apiRouter.post("/", validateInput, (req, res, next) => {
  const amount = Number(req.body.amount);
  const envelope = {
    id: ENVELOPES.length + 1,
    amount,
    category: req.body.category,
    balance: amount,
    amount_spent: 0,
  };

  ENVELOPES.push(envelope);

  res.status(201).send(envelope);
});

// get request for total cost
apiRouter.get("/cost", (req, res, next) => {
  const total_cost = ENVELOPES.reduce((total, item) => (total += item.balance), 0);
  res.send({ total_cost });
});

// get single envelope
apiRouter.get("/:envelopeId", (req, res, next) => {
  res.send(req.envelope);
});

// spend from an envelope
apiRouter.put("/:envelopeId/spend", (req, res, next) => {
  const amountSpent = Number(req.body.amount);
  console.log("amountSpent", amountSpent);

  // check if amout is a number
  if (typeof amountSpent !== "number") {
    return res.status(400).send("Amount must be a number.");
  }

  // check if amount is greater than 0
  if (amountSpent <= 0) {
    return res.status(400).send("Amount must be more than 0.");
  }

  //check if amount sent is more than envelope's balance
  if (amountSpent > req.envelope.balance) {
    return res.status(400).send("Amount is more than remaining balance.");
  }

  const updatedAmountSpent = req.envelope.amount_spent + amountSpent;
  const updatedBalance = req.envelope.amount - updatedAmountSpent;
  const updatedEnvelope = {
    ...req.envelope,
    amount_spent: updatedAmountSpent,
    balance: updatedBalance,
  };

  ENVELOPES[req.envelopeIndex] = updatedEnvelope;

  res.send(updatedEnvelope);
});

module.exports = apiRouter;

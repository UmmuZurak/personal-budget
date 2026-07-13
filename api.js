const { getAllEnvelopes, getEnvelopeById, createEnvelope, deleteEnvelope } = require("./queries");
const { validateAmount, updateBalance, validateInput, validateCategory } = require("./utils");

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

apiRouter.param("envelopeId", getEnvelopeById);

// get request for fetching all envelopes
apiRouter.get("/", getAllEnvelopes, (req, res) => {
  res.json(req.envelopes);
});

// create an envelope route
apiRouter.post("/", validateInput, validateCategory, createEnvelope);

// get request for total cost
apiRouter.get("/cost", getAllEnvelopes,  (req, res, next) => {
  const total_cost = req.envelopes.reduce((total, item) => (total += item.balance), 0);
  res.send({ total_cost });
});

// get single envelope
apiRouter.get("/:envelopeId", (req, res, next) => {
  res.json(req.envelope);
});

// spend from an envelope
apiRouter.put("/:envelopeId/spend", validateAmount, (req, res, next) => {
  const updatedEnvelope = updateBalance("decrease", req.envelope, req.body.amount);

  ENVELOPES[req.envelopeIndex] = updatedEnvelope;

  res.send(updatedEnvelope);
});

// delete an envelope
apiRouter.delete("/:envelopeId", deleteEnvelope);

// transfer amount from one envelope to the other
apiRouter.put("/:envelopeId/transfer", validateAmount, (req, res, next) => {
  const tranferToEnvelopeIndex = ENVELOPES.findIndex(
    (envelope) => envelope.id === req.body.transfer_to,
  );

  if (tranferToEnvelopeIndex !== -1) {
    const { amount } = req.body;
    const tranferToEnvelope = ENVELOPES[tranferToEnvelopeIndex];
    const updatedTransferFromEnvelope = updateBalance("decrease", req.envelope, amount);
    const updatedTransferToEnvelope = updateBalance("increase", tranferToEnvelope, amount);

    ENVELOPES[req.envelopeIndex] = updatedTransferFromEnvelope;
    ENVELOPES[tranferToEnvelopeIndex] = updatedTransferToEnvelope;

    res.send({
      transferred_from: updatedTransferFromEnvelope,
      transferred_to: updatedTransferToEnvelope,
    });
  } else {
    return res.status(400).send(`Envelope to transfer to not found`);
  }
});

module.exports = apiRouter;

const { getEnvelopeById } = require("../db/envelopes");
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  getTransactionById,
  deleteTransaction,
} = require("../db/transactions");
const { validateAmount } = require("../utils");

const transactionsRouter = require("express").Router();

transactionsRouter.param("transactionId", async (req, res, next) => {
  const id = req.params.transactionId;
  const transaction = await getTransactionById(id);
  if (transaction) {
    req.transactionId = id;
    req.transaction = transaction;
    next();
  } else {
    res.status(404).json({ message: `Transaction with ID ${id} not found.` });
  }
});

const validateTransactionDetails = async (req, res, next) => {
  // destruct request body
  const { amount, recipient_id, sender_id } = req.body;

  const recipient = await getEnvelopeById(recipient_id);
  if (!recipient) {
    return res.status(404).json({ message: `Recipient with ID ${recipient_id} not found.` });
  }

  const sender = await getEnvelopeById(sender_id);

  if (!sender) {
    return res.status(404).json({ message: `Sender with ID ${sender_id} not found.` });
  }

  if (sender && amount > sender.balance) {
    return res.status(400).json({ message: "Amount is more than sender's balance." });
  }

  next();
};

transactionsRouter.get("/", async (req, res) => {
  const transaction = await getAllTransactions();

  res.json(transaction);
});

transactionsRouter.post("/", validateAmount, validateTransactionDetails, async (req, res) => {
  try {
    const newTransaction = await createTransaction(req.body);

    res.status(201).json({ transaction: newTransaction });
  } catch (error) {
    throw error;
  }
});

transactionsRouter.put(
  "/:transactionId",
  validateAmount,
  validateTransactionDetails,
  async (req, res) => {
    await updateTransaction({
      ...req.body,
      transactionId: req.transactionId,
    });

    res.json({ message: `Transaction with ID ${req.transactionId} updated.` });
  },
);

transactionsRouter.get("/:transactionId", (req, res) => {
  res.json(req.transaction);
});

transactionsRouter.delete("/:transactionId", async (req, res) => {
  await deleteTransaction(req.transactionId);
  res.json({ message: `Transaction with ID ${req.transactionId} deleted.` });
});

module.exports = transactionsRouter;

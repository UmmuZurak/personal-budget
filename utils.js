const { getEnvelopeByCategory } = require("./queries");

const validateAmount = (req, res, next) => {
  const amount = Number(req.body.amount);

  // check if amout is a number
  if (isNaN(amount)) {
    return res.status(400).send("Amount must be a number.");
  }

  // check if amount is greater than 0
  if (amount <= 0) {
    return res.status(400).send("Amount must be more than 0.");
  }

  //check if amount sent is more than envelope's balance
  if (amount > req.envelope.balance) {
    return res.status(400).send("Amount is more than remaining balance.");
  }

  next();
};

const updateBalance = (updateType, envelope, amount) => {
  amount = Number(amount);
  if (updateType === "decrease") {
    const updatedAmountSpent = envelope.amount_spent + amount;
    const updatedBalance = envelope.amount - updatedAmountSpent;
    envelope = {
      ...envelope,
      amount_spent: updatedAmountSpent,
      balance: updatedBalance,
    };

    return envelope;
  }

  if (updateType === "increase") {
    const updatedAmount = envelope.amount + amount;
    const updatedBalance = envelope.balance + amount;
    envelope = {
      ...envelope,
      amount: updatedAmount,
      balance: updatedBalance,
    };

    return envelope;
  }
};

const validateInput = (req, res, next) => {
  const { amount, category } = req.body;
  if (!amount) {
    return res.status(400).send("Amount is required.");
  }

  if (typeof Number(amount) !== "number" || Number(amount) <= 0) {
    return res.status(400).send("Amount must be a number and be greater than 0.");
  }

  if (!category) {
    return res.status(400).send("Catgeory is required.");
  }

  if (typeof category !== "string") {
    return res.status(400).send("Category must be a string.");
  }

  next();
};

const validateCategory = getEnvelopeByCategory;

module.exports = {
  validateAmount,
  updateBalance,
  validateInput,
  validateCategory
};

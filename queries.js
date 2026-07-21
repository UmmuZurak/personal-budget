require("dotenv/config");
const pg = require("pg");
const { updateBalance } = require("./utils");
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const getAllEnvelopes = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM envelopes ORDER BY id");
    req.envelopes = result.rows;
    next();
  } catch (error) {
    throw error;
  }
};

const getEnvelopeById = async (req, res, next) => {
  try {
    const id = req.params.envelopeId;
    const result = await pool.query("SELECT * FROM envelopes WHERE id = $1", [id]);
    const envelope = result.rows[0];
    if (envelope) {
      req.envelopeId = id;
      req.envelope = envelope;
      next();
    } else {
      res.status(404).json({ message: `Enveloped with ID ${id} not found.` });
    }
  } catch (error) {
    throw error;
  }
};

const getEnvelopeByCategory = async (req, res, next) => {
  try {
    const category = req.body.category;
    const result = await pool.query("SELECT * FROM envelopes WHERE category = $1", [category]);
    const envelope = result.rows[0];
    if (envelope) {
      res.status(400).json({ message: `Envelope with category ${category} already exist` });
    } else {
      next();
    }
  } catch (error) {
    throw error;
  }
};

const createEnvelope = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const category = req.body.category;
    const balance = amount;
    const amount_spent = 0;

    const result = await pool.query(
      "INSERT INTO envelopes (amount, category, balance, amount_spent) VALUES ($1, $2, $3, $4) RETURNING *",
      [amount, category, balance, amount_spent],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    throw error;
  }
};

const deleteEnvelope = async (req, res) => {
  try {
    await pool.query("DELETE FROM envelopes WHERE id = $1", [req.envelopeId]);
    res.status(200).json({ message: `Envelope with ID ${req.envelopeId} deleted.` });
  } catch (error) {
    throw error;
  }
};

const getTransferToEnvelopeById = async (req, res, next) => {
  try {
    const id = req.params.transferToId;
    const result = await pool.query("SELECT * FROM envelopes WHERE id = $1", [id]);
    const envelope = result.rows[0];
    if (envelope) {
      req.transferToId = id;
      req.transferToEnvelope = envelope;
      next();
    } else {
      res.status(404).json({ message: `Transfer to envelope with ID ${id} not found.` });
    }
  } catch (error) {
    throw error;
  }
};

const transferTo = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    //check if amount sent is more than envelope's balance
    if (amount > req.envelope.balance) {
      return res.status(400).send("Amount is more than remaining balance.");
    }
    const updatedTransferFromEnvelope = updateBalance("decrease", req.envelope, amount);
    const updatedTransferToEnvelope = updateBalance("increase", req.transferToEnvelope, amount);

    const {
      amount: fromAmount,
      balance: fromBalance,
      amount_spent: fromAmountSpent,
      id: fromId,
    } = updatedTransferFromEnvelope;
    const {
      amount: toAmount,
      balance: toBalance,
      amount_spent: toAmountSpent,
      id: toId,
    } = updatedTransferToEnvelope;
    await pool.query(
      "UPDATE envelopes SET amount = $1, balance = $2, amount_spent = $3 WHERE id = $4",
      [fromAmount, fromBalance, fromAmountSpent, fromId],
    );
    await pool.query(
      "UPDATE envelopes SET amount = $1, balance = $2, amount_spent = $3 WHERE id = $4",
      [toAmount, toBalance, toAmountSpent, toId],
    );

    const result = await pool.query(
      "INSERT INTO transactions (amount, recipient_id, sender_id, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [amount, toId, fromId, new Date()],
    );

    res.json({
      transaction: result.rows[0],
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  getEnvelopeByCategory,
  createEnvelope,
  deleteEnvelope,
  getTransferToEnvelopeById,
  transferTo,
};

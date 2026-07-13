require("dotenv/config");
const pg = require("pg");
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
    const result = await pool.query("SELECT * FROM envelopes");
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

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  getEnvelopeByCategory,
  createEnvelope,
  deleteEnvelope,
};

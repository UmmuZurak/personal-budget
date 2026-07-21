const query = require("./index");

const getAllTransactions = async () => {
  try {
    const result = await query("SELECT * FROM transactions ORDER BY id");

    return result.rows;
  } catch (error) {
    throw error;
  }
};

const createTransaction = async ({ amount, recipient_id, sender_id }) => {
  try {
    const result = await query(
      "INSERT INTO transactions (amount, recipient_id, sender_id, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [amount, recipient_id, sender_id, new Date()],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateTransaction = async ({ amount, recipient_id, sender_id, transactionId }) => {
  try {
    await query(
      "UPDATE transactions SET amount = $1, recipient_id = $2, sender_id = $3 WHERE id = $4",
      [amount, recipient_id, sender_id, transactionId],
    );
  } catch (error) {
    throw error;
  }
};

const getTransactionById = async (transactionId) => {
  try {
    const result = await query("SELECT * FROM transactions WHERE id = $1", [transactionId]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteTransaction = async (transactionId) => {
  try {
    await query("DELETE FROM transactions WHERE id = $1", [transactionId]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  getTransactionById,
  deleteTransaction,
};

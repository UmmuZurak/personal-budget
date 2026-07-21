const query = require(".");

const getEnvelopeById = async (id) => {
  try {
    const result = await query("SELECT * FROM envelopes WHERE id = $1", [id]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getEnvelopeById,
};

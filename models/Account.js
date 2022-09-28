const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  requested: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  requested: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);

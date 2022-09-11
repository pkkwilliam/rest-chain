const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({});

module.exports = mongoose.model("Account", accountSchema);

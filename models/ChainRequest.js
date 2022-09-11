const mongoose = require("mongoose");

const chainRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  requests: {
    type: Array,
    required: true,
  },
  startTime: {
    type: Date,
    required: false,
  },
  endTime: {
    type: Date,
    required: false,
  },
  cronSchedule: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("ChainRequest", chainRequestSchema);

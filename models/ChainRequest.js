const mongoose = require("mongoose");

const chainRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  requests: {
    type: Object,
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

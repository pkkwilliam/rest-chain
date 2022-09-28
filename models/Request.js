const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  dynamicBody: {
    type: Array,
    required: false,
  },
  dynamicHeaders: {
    type: Array,
    required: false,
  },
  dynamicRequestParams: {
    type: Array,
    required: false,
  },
  body: {
    type: Object,
    required: false,
  },
  headers: {
    type: Object,
    required: false,
  },
  options: {
    type: Object,
    required: false,
  },
  requestParams: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("Request", requestSchema);

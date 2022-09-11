const express = require("express");
const ChainRequestStorage = require("../models/ChainRequest");
const RequestStorage = require("../models/Request");
const {
  addChainRequest,
  removeChainRequest,
} = require("../services/jobScheduleService");
const { CHAIN_REQUEST_NOT_EXISTED } = require("../commons/Error");
const { chainOfRequest } = require("../commons/request");
const mongoose = require("mongoose");
const { findByIdAndUpdate } = require("../models/ChainRequest");

const ChainRequestRouter = express.Router();

async function getById(chainRequestId) {
  if (!mongoose.isValidObjectId(chainRequestId)) {
    return null;
  }
  return await ChainRequestStorage.findById(chainRequestId);
}

ChainRequestRouter.route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const response = await getById(id);
    response
      ? res.status(200).json(response)
      : res.status(400).json(CHAIN_REQUEST_NOT_EXISTED);
  })
  .put(async (req, res) => {
    const { id } = req.params;
    let request = await ChainRequestStorage.findByIdAndUpdate(id, {
      _id: id,
      ...req.body,
    });

    return res.status(200).json(request);
    // TODO if not existed
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    await ChainRequestStorage.findByIdAndRemove(id);
    removeChainRequest(id);
    res.status(204).send();
  });

ChainRequestRouter.post("/:id/execute", async (req, res) => {
  const { id } = req.params;
  const response = await ChainRequestStorage.findById(id);
  const requests = await Promise.all(
    response.requests.map(
      async (requestId) => await RequestStorage.findById(requestId)
    )
  );
  await chainOfRequest(requests);
  res.status(200).json(requests);
});

ChainRequestRouter.post("/", async (req, res) => {
  const newChainRequest = new ChainRequestStorage({
    ...req.body,
  });
  const response = await newChainRequest.save();
  addChainRequest(response);
  res.status(200).json(response);
});

module.exports = ChainRequestRouter;

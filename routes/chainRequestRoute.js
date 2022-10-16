const express = require("express");
const ChainRequestStorage = require("../models/ChainRequest");
const RequestStorage = require("../models/Request");
const {
  addScheduledChainRequest,
  removeChainRequest,
  updateChainRequest,
} = require("../services/jobScheduleService");
const {
  generateExceptionResponse,
  CHAIN_REQUEST_NOT_EXISTED,
} = require("../commons/exceptionMessages");
const { chainOfRequest } = require("../services/httpRequestService");
const { executeRequest } = require("../services/executeRequestService");
const mongoose = require("mongoose");
const { findByIdAndUpdate } = require("../models/ChainRequest");
const { getUserApiKey, paginationRequest } = require("./routeUtil");
const {
  validateChainRequest,
} = require("../services/variable/dynamicRequestValidator");

const ChainRequestRouter = express.Router();

async function getById(chainRequestId, req, res) {
  const apiKey = getUserApiKey(req);
  if (!mongoose.isValidObjectId(chainRequestId)) {
    return null;
  }
  const response = await ChainRequestStorage.findOne(
    {
      _id: chainRequestId,
      apiKey,
    },
    ["_id", "name", "startTime", "endTime", "cronSchedule", "requests"]
  );

  return response;
}

ChainRequestRouter.get("/all", async (req, res) => {
  const apiKey = getUserApiKey(req);
  const response = await paginationRequest(
    req,
    res,
    ChainRequestStorage.find({ apiKey })
  );
  res.status(200).json(response);
});

ChainRequestRouter.route("/:id")
  .get(async (req, res) => {
    const apiKey = getUserApiKey(req);
    const { id } = req.params;
    const response = await getById(id, req, res);
    response
      ? res.status(200).json(response)
      : generateExceptionResponse(res, CHAIN_REQUEST_NOT_EXISTED);
  })
  .put(async (req, res) => {
    const { valid, exception } = validateChainRequest(req.body);
    if (!valid) {
      generateExceptionResponse(res, exception);
      return;
    }
    const apiKey = getUserApiKey(req);
    const { body, params } = req;
    const { id } = params;
    let request = await ChainRequestStorage.findOneAndUpdate(
      { _id: id, apiKey },
      body,
      {
        new: true,
      }
    );
    updateChainRequest(request);
    return res.status(200).json(request);
    // TODO if not existed
  })
  .delete(async (req, res) => {
    const apiKey = getUserApiKey(req);
    const { id } = req.params;
    await ChainRequestStorage.findOneAndRemove({ _id: id, apiKey });
    removeChainRequest(id);
    res.status(204).send();
  });

ChainRequestRouter.post("/:id/execute", async (req, res) => {
  const { id } = req.params;
  const response = await getById(id, req, res);
  // const requests = await Promise.all(
  //   response.requests.map(
  //     async (requestId) => await RequestStorage.findById(requestId)
  //   )
  // );
  if (!response) {
    res.status(403).json({ message: "request not existed or not authorized" });
  } else {
    const responses = await executeRequest(response.requests);
    res.status(200).json(responses);
  }
});

ChainRequestRouter.post("/", async (req, res) => {
  const { valid, exception } = validateChainRequest(req.body);
  if (!valid) {
    generateExceptionResponse(res, exception);
    return;
  }
  const newChainRequest = new ChainRequestStorage({
    ...req.body,
  });
  let response = await newChainRequest.save();
  addScheduledChainRequest(response);
  let finalResponse = await getById(response._id, req, res);
  res.status(200).json(finalResponse);
});

module.exports = ChainRequestRouter;

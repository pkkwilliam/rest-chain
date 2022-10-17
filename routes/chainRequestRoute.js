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
const {
  getUserApiKey,
  getUserAccount,
  getUserId,
  paginationRequest,
} = require("./routeUtil");
const {
  validateChainRequest,
} = require("../services/variable/dynamicRequestValidator");

const ChainRequestRouter = express.Router();

async function getById(chainRequestId, req, res) {
  const userId = getUserId(req);
  if (!mongoose.isValidObjectId(chainRequestId)) {
    throw CHAIN_REQUEST_NOT_EXISTED;
  }
  const response = await ChainRequestStorage.findOne(
    {
      _id: chainRequestId,
      userId,
    },
    getResponseContentShouldContain()
  );
  if (!response) {
    throw CHAIN_REQUEST_NOT_EXISTED;
  }
  return response;
}

ChainRequestRouter.get("/all", async (req, res) => {
  const userId = getUserId(req);
  const response = await paginationRequest(
    req,
    res,
    ChainRequestStorage.find({ userId }, getResponseContentShouldContain())
  );
  res.status(200).json(response);
});

ChainRequestRouter.route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const response = await getById(id, req, res);
      res.status(200).json(response);
    } catch (applicationException) {
      processException(applicationException, res);
    }
  })
  .put(async (req, res) => {
    try {
      const { valid, exception } = validateChainRequest(req.body);
      if (!valid) {
        throw exception;
      }
      const userId = getUserId(req);
      const { body, params } = req;
      const { id } = params;
      let request = await ChainRequestStorage.findOneAndUpdate(
        { _id: id, userId },
        body,
        {
          new: true,
        }
      );
      updateChainRequest(request);
      return res.status(200).json(request);
      // TODO if not existed
    } catch (applicationException) {
      processException(applicationException, res);
    }
  })
  .delete(async (req, res) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      await ChainRequestStorage.findOneAndRemove({ _id: id, userId });
      removeChainRequest(id);
      res.status(204).send();
    } catch (applicationException) {
      processException(applicationException, res);
    }
  });

ChainRequestRouter.post("/:id/execute", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getById(id, req, res);
    const responses = await executeRequest(response.requests);
    res.status(200).json(responses);
  } catch (applicationException) {
    processException(applicationException, res);
  }
});

ChainRequestRouter.post("/", async (req, res) => {
  try {
    const { valid, exception } = validateChainRequest(req.body);
    if (!valid) {
      throw exception;
    }
    const userId = getUserId(req);
    const newChainRequest = new ChainRequestStorage({
      ...req.body,
      userId,
    });
    let response = await newChainRequest.save();
    addScheduledChainRequest(response);
    let finalResponse = await getById(response._id, req, res);
    res.status(200).json(finalResponse);
  } catch (applicationException) {
    processException(applicationException, res);
  }
});

function getResponseContentShouldContain() {
  return ["_id", "name", "startTime", "endTime", "cronSchedule", "requests"];
}

function processException(applicationException, res) {
  // invalid application exception, generic exception
  if (!applicationException.error) {
    res.status(500).send();
  } else {
    console.log(applicationException);
    res.status(applicationException.statusCode).json(applicationException);
  }
}

module.exports = ChainRequestRouter;

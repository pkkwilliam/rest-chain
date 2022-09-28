const express = require("express");
const RequestStorage = require("../models/Request");
const { paginationRequest } = require("./routeUtil");

const RequestRouter = express.Router();

RequestRouter.get("/all", async (req, res) => {
  const response = await paginationRequest(req, res, RequestStorage.find());
  res.status(200).json(response);
});

RequestRouter.route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const response = await RequestStorage.findById(id);
    res.status(200).json(response);
  })
  .put(async (req, res) => {
    const { id } = req.params;

    const updatedResponse = await RequestStorage.findByIdAndUpdate(
      id,
      constructRequest(req.body),
      { new: true }
    );
    res.status(200).json(updatedResponse);
  })
  .delete((req, res) => {
    res.status(404).send();
  });

RequestRouter.post("/", async (req, res) => {
  const newRequest = new RequestStorage(constructRequest(req.body));
  const response = await newRequest.save();
  res.status(200).json(response);
});

function constructRequest(request) {
  const {
    body = {},
    dynamicBody,
    dynamicHeaders,
    dynamicRequestParams,
  } = request;
  return {
    ...request,
    dynamicBody: dynamicBody ?? [],
    dynamicHeaders: dynamicHeaders ?? [],
    dynamicRequestParams: dynamicRequestParams ?? [],
  };
}

module.exports = RequestRouter;

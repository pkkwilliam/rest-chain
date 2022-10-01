async function paginationRequest(req, res, queryRequest) {
  const { pageRequest = 0, requestSize = 1 } = req.query;
  const response = await queryRequest
    .limit(requestSize)
    .skip(requestSize * pageRequest);
  return response;
}

function getUserApiKey(req) {
  return req.body.apiKey;
}

function validateChainRequestObject(req, res) {
  const { method, name, url } = req.body;
  if (!method || !name || !url) {
    res.status(400).send({ message: "request body missing vital parts" });
  }
}

module.exports = {
  getUserApiKey,
  paginationRequest,
  validateChainRequestObject,
};

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

module.exports = { getUserApiKey, paginationRequest };

async function paginationRequest(req, res, queryRequest) {
  const { pageRequest = 0, requestSize = 1 } = req.query;
  const response = await queryRequest
    .limit(requestSize)
    .skip(requestSize * pageRequest);
  return response;
}

function getUserAccount(req) {
  return req.body.account;
}

function getUserId(req) {
  return getUserAccount(req)._id;
}

function getUserApiKey(req) {
  return getUserId(req);
}

module.exports = {
  getUserApiKey,
  getUserAccount,
  getUserId,
  paginationRequest,
};

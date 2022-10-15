const { constructRequest } = require("./variable/dynamicRequestGenerator");
const { httpRequest } = require("./httpRequestService");

async function executeRequest(requests) {
  let previousRequestResponses = [];
  for (const request of requests) {
    const readyToExecuteRequest = constructRequest(
      previousRequestResponses,
      request
    );
    const { url, body, headers, method, requestParams } = readyToExecuteRequest;
    const requestResponse = await httpRequest(
      generateRequestParamsUrl(url, requestParams),
      body,
      headers,
      method
    );
    previousRequestResponses.push(requestResponse);
  }
  return previousRequestResponses;
}

function generateRequestParamsUrl(url, dynamicRequestParams) {
  let requestParams = "";
  for (const objectKey in dynamicRequestParams) {
    requestParams += "&" + objectKey + "=" + dynamicRequestParams[objectKey];
  }
  return (
    url +
    (requestParams.length > 0 && !url.includes("?")
      ? "?" + requestParams.substring(1)
      : "")
  );
}

module.exports = {
  executeRequest,
};

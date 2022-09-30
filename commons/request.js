const fetch = require("node-fetch");
const { generateRequestParamsString, setVariableObject } = require("./utils");
const RequestStorage = require("../models/Request");

async function httpRequest(url, body, headers, method, options) {
  console.log("Request url:", url);
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
    method,
    ...options,
  });
  const parsedJson = await response.json();
  return {
    headers: response.headers,
    body: parsedJson,
    statusCode: response.status,
  };
}

async function chainOfRequstByRequestIds(requestIds) {
  let requests = [];
  await Promise.all(
    requestIds.map(async (requestId) => {
      const request = await RequestStorage.findById(requestId);
      requests.push(request);
    })
  );
  await chainOfRequest(requests);
}

async function chainOfRequest(requests) {
  let responses = [];
  for (const request of requests) {
    let {
      url,
      dynamicBody = [],
      dynamicHeaders = [],
      dynamicRequestParams = [],
      headers = {},
      method,
      name,
      options,
      requestParams = {},
      body = method === "GET" ? undefined : {},
    } = request;

    console.info("Request Name:", name);
    // headers = setHeadersValue(responses, headers);
    headers = setVariableObject(responses, headers, dynamicHeaders);
    body = setVariableObject(responses, body, dynamicBody);
    requestParams = generateRequestParamsString(
      responses,
      requestParams,
      dynamicRequestParams
    );
    // console.log("headers:", headers);
    // console.log("requestParams:", requestParams);
    // console.log("body:", body);
    const response = await httpRequest(
      url + requestParams,
      body,
      headers,
      method,
      options
    );
    console.log("Status Code:", response.statusCode);
    responses.push(response);
  }
  return responses;
}

module.exports = {
  chainOfRequest,
  chainOfRequstByRequestIds,
};

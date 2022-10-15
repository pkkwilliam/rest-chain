const fetch = require("node-fetch");
const {
  generateRequestParamsString,
  setVariableObject,
} = require("../commons/utils");
const RequestStorage = require("../models/Request");

async function httpRequest(url, body, headers, method) {
  console.log("Request url:", url);
  console.log("headers", headers);
  console.log("body", body);
  const response = await fetch(url, {
    body: method === "GET" ? null : JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
    method,
  });
  let responseHeaders = await getResponseHeaders(response);
  let parsedJson = await getResponseBody(response);

  return {
    headers: responseHeaders,
    body: parsedJson,
    statusCode: response.status,
  };
}

async function getResponseBody(response) {
  let bodyObject = {};
  try {
    bodyObject = await response.json();
  } catch (ex) {
    console.warn("response body failed to parse");
  }
  return bodyObject;
}

async function getResponseHeaders(response) {
  let headersObject = {};
  response.headers.forEach(function (value, name) {
    headersObject[name] = value;
  });
  return headersObject;
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
  httpRequest,
};

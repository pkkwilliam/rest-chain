const RAPIDAPI_HOST_HEADER_NAME = "x-rapidapi-host";
const RAPIDAPI_PROXY_SERCRET_HEADER_NAME = "x-rapidapi-proxy-secret";
const RAPIDAPI_PROXY_USER_HEADER_NAME = "x-rapidapi-user";

function getRequestHeaderValue(req, headerName) {
  return req.headers[headerName];
}

module.exports = {
  getRequestHeaderValue,
  RAPIDAPI_HOST_HEADER_NAME,
  RAPIDAPI_PROXY_SERCRET_HEADER_NAME,
  RAPIDAPI_PROXY_USER_HEADER_NAME,
};

const dotenv = require("dotenv");
dotenv.config();

const { RAPIDAPI_PROXY_SECRET } = process.env;

async function validateRequest(req, res) {
  const { headers } = req;
  const { host, from } = headers;
  if (headers["x-rapidapi-host"]) {
    return validateRapidApiRequest(req, res);
  } else {
    res.status(401).json({ message: "invalid channel" });
    return false;
  }
}

function validateRapidApiRequest(req, res) {
  const { headers } = req;
  const userApiKey = headers["x-rapidapi-key"];
  const secret = headers["x-rapidapi-proxy-secret"];
  if (secret !== RAPIDAPI_PROXY_SECRET || !userApiKey) {
    res.status(401).json({ message: "bad authentication" });
    return false;
  }
  console.info("authenticated rapid api user:", userApiKey);
  assignApiKeyIntoBody(req, userApiKey);
  return true;
}

function assignApiKeyIntoBody(req, apiKey) {
  req.body = { ...req.body, apiKey: apiKey };
}

module.exports = { validateRequest };

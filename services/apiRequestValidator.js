const { getAccountAndCreateIfEmpty } = require("./account/accountService");
const {
  RAPIDAPI_PROXY_SERCRET_HEADER_NAME,
  RAPIDAPI_HOST_HEADER_NAME,
} = require("../utils/headerUtil");
const { CHANNEL_RAPIDAPI } = require("../commons/models/account/channel");
const dotenv = require("dotenv");
const {
  INVALID_CHANNEL,
  UNAUTHORIZE,
} = require("../commons/exceptionMessages");
dotenv.config();

const { RAPIDAPI_PROXY_SECRET } = process.env;

async function validateRequest(req, res) {
  console.log(req.headers);
  const channel = await getRequestChannel(req, res);
  validateChannelAuthorization(req, channel);
  const userAccount = await getAccountAndCreateIfEmpty(req, channel);
  console.log("user sucessfully validated", userAccount.username);
  return userAccount;
}

async function validateChannelAuthorization(req, channel) {
  switch (channel) {
    case CHANNEL_RAPIDAPI:
      validateRapidApiRequest(req);
  }
}

function validateRapidApiRequest(req) {
  const { headers } = req;
  const secret = headers[RAPIDAPI_PROXY_SERCRET_HEADER_NAME];
  if (secret !== RAPIDAPI_PROXY_SECRET) {
    throw UNAUTHORIZE;
  }
}

async function getRequestChannel(req, res) {
  const { headers } = req;
  if (headers[RAPIDAPI_HOST_HEADER_NAME]) {
    return CHANNEL_RAPIDAPI;
  }
  throw INVALID_CHANNEL;
}

module.exports = { validateRequest };

const AccountStorage = require("../../models/Account");
const { CHANNEL_RAPIDAPI } = require("../../commons/models/account/channel");
const { RAPIDAPI_PROXY_USER_HEADER_NAME } = require("../../utils/headerUtil");
const { MISSING_USERNAME } = require("../../commons/exceptionMessages");

async function getRapidapiAccount(req) {
  const username = getRapidApiUsername(req);
  if (!username) {
    return;
  }
  return await AccountStorage.findOne({ channel: CHANNEL_RAPIDAPI, username });
}

async function createRapidApiAccount(req, defaultAccount) {
  const username = getRapidApiUsername(req);
  const newUseraccount = new AccountStorage({
    ...defaultAccount,
    channel: CHANNEL_RAPIDAPI,
    username,
  });
  console.log("Rapid API user successfully created");
  const response = await newUseraccount.save();
  return response;
}

function getRapidApiUsername(req) {
  const { headers } = req;
  const username = headers[RAPIDAPI_PROXY_USER_HEADER_NAME];
  if (!username) {
    console.warn(
      "rapid api missing username, potential thread to system because host is rapid api and rapid api should send username automatically!"
    );
    throw MISSING_USERNAME;
  } else {
    return username;
  }
}

module.exports = {
  createRapidApiAccount,
  getRapidapiAccount,
};

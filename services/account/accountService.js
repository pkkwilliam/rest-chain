const AccountStorage = require("../../models/Account");
const { CHANNEL_RAPIDAPI } = require("../../commons/models/account/channel");
const {
  createRapidApiAccount,
  getRapidapiAccount,
} = require("./rapidapiAccountService");

/**
 * this method assume the request is been validate as secured
 * @param {*} req
 * @param {*} requestChannel
 */
async function getAccount(req, requestChannel) {
  switch (requestChannel) {
    case CHANNEL_RAPIDAPI:
      return await getRapidapiAccount(req);
  }
}

async function getAccountAndCreateIfEmpty(req, requestChannel) {
  let userAccount = await getAccount(req, requestChannel);
  if (!userAccount) {
    userAccount = await createAccount(req, requestChannel);
  }
  return userAccount;
}

async function createAccount(req, requestChannel) {
  switch (requestChannel) {
    case CHANNEL_RAPIDAPI:
      return await createRapidApiAccount(req, getDefaultAccount());
  }
}

async function updateAccount(account, validate = true) {}

function getDefaultAccount() {
  return {
    balance: 0,
    requested: 0,
  };
}

module.exports = { createAccount, getAccount, getAccountAndCreateIfEmpty };

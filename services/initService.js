const ChainRequestStorage = require("../models/ChainRequest");
const { addChainRequest } = require("../services/jobScheduleService");

async function init() {
  const chainRequests = await getChainRequests();
  console.log("chain request count:", chainRequests.length);
  chainRequests.forEach((chainRequest) => {
    addChainRequest(chainRequest);
  });
}

async function getChainRequests() {
  const currentDate = new Date();
  const chainRequests = await ChainRequestStorage.find({
    endTime: { $gte: currentDate },
  });
  return chainRequests;
}

module.exports = { init };

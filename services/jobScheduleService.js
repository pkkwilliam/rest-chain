const schedule = require("node-schedule");
const { chainOfRequstByRequestIds } = require("../commons/request");

let jobs = {};

function addChainRequest(chainRequest) {
  const { _id, cronSchedule, name, requests } = chainRequest;
  const job = schedule.scheduleJob(cronSchedule, async () => {
    console.log("==========");
    console.log("START");
    console.log("Chain Request Name:", name, "ID:", _id);
    await chainOfRequstByRequestIds(requests);
    console.log("END");
    console.log("==========");
  });
  jobs[_id] = job;
}

function removeChainRequest(chainRequestId) {
  jobs[chainRequestId].cancel();
  delete jobs[chainRequestId];
}

module.exports = { addChainRequest, removeChainRequest };

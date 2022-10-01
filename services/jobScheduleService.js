const schedule = require("node-schedule");
const { chainOfRequest } = require("../commons/request");

let jobs = {};

function addChainRequest(chainRequest) {
  const { _id, cronSchedule, endTime, name, requests, startTime } =
    chainRequest;
  const job = schedule.scheduleJob(cronSchedule, async () => {
    console.log("===== CRON SCHEDULE START =====");
    console.log(
      "Chain Request Name:",
      name,
      "ID:",
      _id,
      "startTime:",
      startTime,
      "endTime:",
      endTime
    );
    await chainOfRequest(requests);
    checkEndTime(chainRequest);
    console.log("===== END =====");
  });
  jobs[_id] = job;
}

function checkEndTime(chainRequest) {
  const date = new Date();
  if (chainRequest?.endTime >= date) {
    console.log("end time reached", chainRequest.endTime);
    removeChainRequest(chainRequest._id);
  }
}

function updateChainRequest(chainRequest) {
  const { _id } = chainRequest;
  removeChainRequest(_id);
  addChainRequest(chainRequest);
}

function removeChainRequest(chainRequestId) {
  try {
    jobs[chainRequestId].cancel();
    delete jobs[chainRequestId];
  } catch (exception) {
    console.warn("Chain Request ID might not existed", chainRequestId);
  }
}

module.exports = { addChainRequest, removeChainRequest, updateChainRequest };

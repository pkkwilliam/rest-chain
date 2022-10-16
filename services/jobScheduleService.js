const schedule = require("node-schedule");
const { chainOfRequest } = require("./httpRequestService");
const {
  addRequestToCache,
  getRequestFromCache,
  removeRequestFromCache,
} = require("./scheduledRequestCache/inMemmoryScheduledRequestCache");

function addScheduledChainRequest(chainRequest) {
  const { _id } = chainRequest;
  const job = createScheduledJob(chainRequest);
  addRequestToCache(_id, job);
}

function createScheduledJob(chainRequest) {
  const { _id, cronSchedule, endTime, name, requests, startTime } =
    chainRequest;
  const job = schedule.scheduleJob(cronSchedule, async () => {
    const currentDate = new Date();
    console.log("===== CRON SCHEDULE START =====");
    console.log("current date", currentDate);
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
    if (startTime < currentDate) {
      console.log("request should not be started yet");
    } else {
      await chainOfRequest(requests);
      checkEndTime(chainRequest, currentDate);
    }
    console.log("===== END =====");
  });
  return job;
}

function checkEndTime(chainRequest, date) {
  if (chainRequest?.endTime >= date) {
    console.log("end time reached", chainRequest.endTime);
    removeChainRequest(chainRequest._id);
  }
}

function updateChainRequest(chainRequest) {
  const { _id } = chainRequest;
  removeChainRequest(_id);
  addScheduledChainRequest(chainRequest);
}

function removeChainRequest(chainRequestId) {
  try {
    getRequestFromCache(chainRequestId).cancel();
    removeRequestFromCache(chainRequestId);
  } catch (exception) {
    console.warn("Chain Request ID might not existed", chainRequestId);
  }
}

module.exports = {
  addScheduledChainRequest,
  removeChainRequest,
  updateChainRequest,
};

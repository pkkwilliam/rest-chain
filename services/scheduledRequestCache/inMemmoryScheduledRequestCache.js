let jobs = {};

function addRequestToCache(scheduledRequestId, scheduledRequest) {
  jobs[scheduledRequestId] = scheduledRequest;
}

function getRequestFromCache(scheduledRequestId) {
  return jobs[scheduledRequestId];
}

function removeRequestFromCache(scheduledRequestId) {
  delete jobs[scheduledRequestId];
}

module.exports = {
  addRequestToCache,
  getRequestFromCache,
  removeRequestFromCache,
};

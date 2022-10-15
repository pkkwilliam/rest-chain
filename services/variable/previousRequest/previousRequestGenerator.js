function generatePreviousRequestVariable(previousRequestResponses, variable) {
  const {
    retrieveFromIndex,
    retrievePosition,
    prefix = "",
    suffix = "",
  } = variable;
  const response = previousRequestResponses[retrieveFromIndex];
  if (!response) {
    // TODO response not existed, might be failed
  }
  let result =
    retrievePosition[0] === "headers" ? response.headers : response.body;
  for (
    let positionIndex = 1;
    positionIndex < retrievePosition.length;
    positionIndex++
  ) {
    result = result[retrievePosition[positionIndex]];
  }
  return prefix + result + suffix;
}

module.exports = {
  generatePreviousRequestVariable,
};

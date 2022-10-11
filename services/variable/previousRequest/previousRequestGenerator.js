function generatePreviousRequestVariable(previousRequestResponses, variable) {
  const { requestIndex, retreivePosition } = variable;
  const response = previousRequestResponses[requestIndex];
  if (!response) {
    // TODO response not existed, might be failed
  }
  // const responseFrom = getRetrieveFrom(response, retrieveFrom);
  // if (!responseFrom) {
  //   // TODO BODY or HEADERS not existed in the response
  // }
  let result = responseFrom;
  for (
    let positionIndex = 0;
    positionIndex < retreivePosition.length;
    positionIndex++
  ) {
    result = result[retreivePosition[positionIndex]];
  }
  return result;
}

module.exports = {
  generatePreviousRequestVariable,
};

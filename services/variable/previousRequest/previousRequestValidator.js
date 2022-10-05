const { enumsContains } = require("../../../commons/enumUtil");
const {
  PREVIOUS_REQUEST_MISSING_REQUEST_INDEX,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_POSITION,
  concatValidorMissingValue,
} = require("../../../commons/exceptionMessages");
const {
  RETRIEVE_FORMS,
} = require("../../../commons/models/previousRequest/retreiveFrom");

const VALID_REQUEST_RESPONSE = { valid: true };

function validatePreviousRequestVariable(variableObject) {
  const { requestIndex, retrieveFrom, retrievePosition } = variableObject;
  if (requestIndex < 0 || !requestIndex) {
    return concatValidorMissingValue(PREVIOUS_REQUEST_MISSING_REQUEST_INDEX);
  }
  if (!retrieveFrom || !enumsContains(RETRIEVE_FORMS, retrieveFrom)) {
    return concatValidorMissingValue(PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM);
  }
  console.log(retrievePosition);
  if (
    !retrievePosition ||
    !Array.isArray(retrievePosition) ||
    retrievePosition.length < 1
  ) {
    return concatValidorMissingValue(
      PREVIOUS_REQUEST_MISSING_RETRIEVE_POSITION
    );
  }
  return VALID_REQUEST_RESPONSE;
}

module.exports = {
  validatePreviousRequestVariable,
};

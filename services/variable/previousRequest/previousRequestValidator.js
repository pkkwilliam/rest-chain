const { enumsContains } = require("../../../commons/enumUtil");
const {
  PREVIOUS_REQUEST_MISSING_REQUEST_INDEX,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_POSITION,
  REQUEST_FROM_INDEX_GREATER_OR_EQUAL_TO_CURRENT_REQUEST,
  concatValidorMissingValue,
} = require("../../../commons/exceptionMessages");
const {
  RETRIEVE_FORMS,
} = require("../../../commons/models/previousRequest/retreiveFrom");

const VALID_REQUEST_RESPONSE = { valid: true };

function validatePreviousRequestVariable(variableObject, requestIndex) {
  const { requestFromIndex, retrieveFrom, retrievePosition } = variableObject;
  if (requestFromIndex < 0 || !requestFromIndex) {
    return concatValidorMissingValue(PREVIOUS_REQUEST_MISSING_REQUEST_INDEX);
  }
  if (requestFromIndex >= requestIndex) {
    return concatValidorMissingValue(
      REQUEST_FROM_INDEX_GREATER_OR_EQUAL_TO_CURRENT_REQUEST
    );
  }
  // if (!retrieveFrom || !enumsContains(RETRIEVE_FORMS, retrieveFrom)) {
  //   return concatValidorMissingValue(PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM);
  // }
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

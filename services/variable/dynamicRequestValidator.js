const {
  GET_METHOD_CONTAINS_BODY,
  REQUEST_MISSING_VITAL_INFORMATION,
  DYNAMIC_VARIABLE_MISSING_POSITION,
  BAD_VAIRABLE_TYPE,
  END_TIME_IS_EARILER_THAN_CURRENT,
  GENERAL_ELEMENT_MISSING_OR_INCORRECT,
  concatValidatorMessageException,
  concatValidtorMessageIndexException,
} = require("../../commons/exceptionMessages");
const {
  VARIABLE_TYPE_DATE,
  VARIABLE_TYPE_PREVIOUS_REQUEST,
} = require("../../commons/models/VariableType");
const { validateDateVariable } = require("./date/dateVariable");
const {
  validatePreviousRequestVariable,
} = require("./previousRequest/previousRequestVariable");

const VALID_REQUEST_RESPONSE = { valid: true };

function validateChainRequest(requestBody) {
  const { name, requests, endTime } = requestBody;
  if (!name || !requests || requests.length == 0 || !endTime) {
    return generateException(REQUEST_MISSING_VITAL_INFORMATION);
  }
  if (new Date(endTime) <= new Date()) {
    return generateException(END_TIME_IS_EARILER_THAN_CURRENT);
  }
  for (let index = 0; index < requests.length; index++) {
    const response = validateRequest(requests[index], index);
    if (!response.valid) {
      return generateRequestException(response.exception, index);
    }
  }
  return VALID_REQUEST_RESPONSE;
}

function validateRequest(request, index) {
  const { url, method, dynamicBody, dynamicHeaders, dynamicRequestParams } =
    request;
  // check basic info
  if (!url || !method) {
    return concatValidatorMessageException(
      { valid: false, exception: GENERAL_ELEMENT_MISSING_OR_INCORRECT },
      ".[method / name / url] "
    );
  }
  if (isGetMethodContainsBody(request)) {
    return concatValidatorMessageException(
      { valid: false, exception: GET_METHOD_CONTAINS_BODY },
      " "
    );
  }
  // TODO validate dynamic headers
  const validDynamicHeaders = validateDynamicObjects(dynamicHeaders);
  if (!validDynamicHeaders.valid) {
    return concatValidatorMessageException(
      validDynamicHeaders,
      "dynamicHeaders"
    );
  }
  // TODO validate dynamic body
  const validDynamicBody = validateDynamicObjects(dynamicBody);
  if (!validDynamicBody.valid) {
    return concatValidatorMessageException(validDynamicBody, "dynamicBody");
  }
  // TODO validate dynamic request params
  const validDynamicRequestParams =
    validateDynamicObjects(dynamicRequestParams);
  if (!validDynamicRequestParams.valid) {
    return concatValidatorMessageException(
      validDynamicRequestParams,
      "dynamicRequestParams"
    );
  }
  return VALID_REQUEST_RESPONSE;
}

function validateDynamicObjects(dynamicObjects) {
  if (!dynamicObjects || dynamicObjects.length === 0) {
    return VALID_REQUEST_RESPONSE;
  }
  for (let index = 0; index < dynamicObjects.length; index++) {
    const validObject = validateDynamicObject(dynamicObjects[index], index);
    if (!validObject.valid) {
      return concatValidtorMessageIndexException(validObject, index);
    }
  }
  return VALID_REQUEST_RESPONSE;
}

function validateDynamicObject(variable, index) {
  const { position } = variable;
  if (!position || position.length < 1) {
    return concatValidatorMessageException(
      { valid: false, exception: DYNAMIC_VARIABLE_MISSING_POSITION },
      "",
      true
    );
  }
  return validateVariable(variable, index);
}

function validateVariable(variable, index) {
  switch (variable.variableType) {
    case VARIABLE_TYPE_DATE:
      return validateDateVariable(variable);
    case VARIABLE_TYPE_PREVIOUS_REQUEST:
      return validatePreviousRequestVariable(variable);
    default:
      return concatValidatorMessageException(
        { exception: BAD_VAIRABLE_TYPE },
        "",
        true
      );
  }
}

function isGetMethodContainsBody(request) {
  const { method, body } = request;
  return method === "GET" && body;
}

function generateRequestException(exception, index) {
  return {
    valid: false,
    exception: {
      ...exception,
      message: `requests[${index}]${exception.message}`,
    },
  };
}

module.exports = {
  validateChainRequest,
  VALID_REQUEST_RESPONSE,
};

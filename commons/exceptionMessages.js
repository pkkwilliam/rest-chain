const CHAIN_REQUEST_NOT_EXISTED = {
  statusCode: 403,
  message: "chain request not existed",
};
const REQUEST_MISSING_VITAL_INFORMATION = {
  statusCode: 400,
  message: "missing vital message",
};
const GET_METHOD_CONTAINS_BODY = {
  statusCode: 400,
  message: "get method should not contains body",
};
const DATE_TYPE_NOT_VALID = {
  statusCode: 400,
  message:
    "dateType incorrect or missing. Must be CURRENT / FIX / FIRST_DATE_OF_CURRENT_MONTH / FIRST_DATE_OF_LAST_MONTH / FIRST_DATE_OF_NEXT_MONTH / LAST_DATE_OF_CURRENT_MONTH / LAST_DATE_OF_LAST_MONTH / LAST_DATE_OF_NEXT_MONTH",
};
const FIX_DATE_MISSING = {
  statusCode: 400,
  message: "date is missing for dateType FIX",
};
const TIME_UNIT_MODIFY_TYPE_INCORRECT = {
  statusCode: 400,
  message: "modifyType missing or incorrect. must be ADD / SUBSTRACT",
};
const DATE_MODIFY_VALUE_INCORRET = {
  statusCode: 400,
  message: "value is missing or incorrect",
};
const DYNAMIC_VARIABLE_MISSING_POSITION = {
  statusCode: 400,
  message: "position is missing or incorrect, must be array of string.",
};
const BAD_VAIRABLE_TYPE = {
  statusCode: 400,
  message: "variableType incorrect or missing, must be DATE / PREVIOUS_REQUEST",
};
const END_TIME_IS_EARILER_THAN_CURRENT = {
  statusCode: 400,
  message: "end time should not be eariler than current",
};
const GENERAL_ELEMENT_MISSING_OR_INCORRECT = {
  statusCode: 400,
  message: "is missing or incorrect.",
};
const FIRST_REQUEST_VARIABLE_TYPE_CANNOT_BE_PREVIOUS_REQUEST = {
  statusCode: 400,
  message:
    "cannot use variableType PREVIOUS_REQUEST, only requests[i > 0] allow to use PREVIOUS_REQUEST",
};
const PREVIOUS_REQUEST_MISSING_REQUEST_INDEX = {
  statusCode: 400,
  message: "reqeustIndex is missing or incorrect, index must be >= 0",
};

const PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM = {
  statusCode: 400,
  message: "retrieveFrom is missing or incorrect, must be BODY / HEADER",
};
const PREVIOUS_REQUEST_MISSING_RETRIEVE_POSITION = {
  statusCode: 400,
  message:
    "retrievePosition is missing or incorrect, must be array of string or number indicate index.",
};

function generateExceptionResponse(
  res,
  exception,
  messagePrefix = "",
  messageSuffix = ""
) {
  const { statusCode, message } = exception;
  res
    .status(statusCode)
    .json({ message: messagePrefix + message + messageSuffix });
}

function concatValidatorMessageException(
  responseObject,
  concatAtFront,
  useSeparator = false,
  valid = false
) {
  return {
    ...responseObject,
    valid,
    exception: {
      ...responseObject.exception,
      message: `${useSeparator ? "." : ""}${concatAtFront}${
        responseObject.exception.message
      }`,
    },
  };
}

function concatValidatorGeneralMessage(exception) {
  return concatValidatorMessageException({ exception }, " ", false);
}

function concatValidorMissingValue(exception) {
  return concatValidatorMessageException({ exception }, "", true);
}

function concatValidatorMessageIndexException(responseObject, index) {
  return concatValidatorMessageException(responseObject, `[${index}]`, false);
}

module.exports = {
  CHAIN_REQUEST_NOT_EXISTED,
  REQUEST_MISSING_VITAL_INFORMATION,
  GET_METHOD_CONTAINS_BODY,
  DATE_TYPE_NOT_VALID,
  FIX_DATE_MISSING,
  TIME_UNIT_MODIFY_TYPE_INCORRECT,
  DYNAMIC_VARIABLE_MISSING_POSITION,
  BAD_VAIRABLE_TYPE,
  END_TIME_IS_EARILER_THAN_CURRENT,
  DATE_MODIFY_VALUE_INCORRET,
  GENERAL_ELEMENT_MISSING_OR_INCORRECT,
  FIRST_REQUEST_VARIABLE_TYPE_CANNOT_BE_PREVIOUS_REQUEST,
  PREVIOUS_REQUEST_MISSING_REQUEST_INDEX,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_FROM,
  PREVIOUS_REQUEST_MISSING_RETRIEVE_POSITION,
  concatValidatorGeneralMessage,
  concatValidatorMessageException,
  concatValidatorMessageIndexException,
  concatValidorMissingValue,
  generateExceptionResponse,
};

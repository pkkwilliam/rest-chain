const { FIX, DATE_TYPES } = require("../../../commons/models/date/DateType");
const { enumsContains } = require("../../../commons/enumUtil");
const {
  DATE_TYPE_NOT_VALID,
  FIX_DATE_MISSING,
  TIME_UNIT_MODIFY_TYPE_INCORRECT,
  DATE_MODIFY_VALUE_INCORRET,
  concatValidatorMessageException,
  concatValidorMissingValue,
} = require("../../../commons/exceptionMessages");
const {
  TIME_UNIT_MODIFY_TYPES,
} = require("../../../commons/models/date/TimeUnitModifyType");

const VALID_REQUEST_RESPONSE = { valid: true };

function validateDateVariable(variableObject) {
  const { date, format, locale, dateType, day, minute, second } =
    variableObject;
  if (!validateDateType(dateType)) {
    return concatValidorMissingValue(DATE_TYPE_NOT_VALID);
  }
  if (dateType === FIX && !date) {
    return concatValidorMissingValue(FIX_DATE_MISSING);
  }

  const dayValid = validateModifyTimeUnit(day);
  if (!dayValid.valid) {
    return concatValidatorMessageException(dayValid, "day", true);
  }
  const minuteValid = validateModifyTimeUnit(minute);
  if (!minuteValid.valid) {
    return concatValidatorMessageException(minuteValid, "minute", true);
  }
  const secondValid = validateModifyTimeUnit(second);
  if (!secondValid.valid) {
    return concatValidatorMessageException(secondValid, "second", true);
  }
  return VALID_REQUEST_RESPONSE;
}

function validateDateType(dateType) {
  return enumsContains(DATE_TYPES, dateType);
}

function validateModifyTimeUnit(timeUnit) {
  if (!timeUnit) {
    return VALID_REQUEST_RESPONSE;
  }
  const { modifyType, value } = timeUnit;
  if (!enumsContains(TIME_UNIT_MODIFY_TYPES, modifyType)) {
    return concatValidorMissingValue(TIME_UNIT_MODIFY_TYPE_INCORRECT);
  }
  if (!value) {
    return concatValidorMissingValue(DATE_MODIFY_VALUE_INCORRET);
  }
  return VALID_REQUEST_RESPONSE;
}

module.exports = {
  validateDateVariable,
};

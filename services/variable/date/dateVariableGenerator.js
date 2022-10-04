const {
  FIX,
  CURRENT,
  FIRST_DATE_OF_CURRENT_MONTH,
  FIRST_DATE_OF_LAST_MONTH,
  FIRST_DATE_OF_NEXT_MONTH,
  LAST_DATE_OF_CURRENT_MONTH,
  LAST_DATE_OF_LAST_MONTH,
  LAST_DATE_OF_NEXT_MONTH,
} = require("../../../commons/models/date/DateType");
const moment = require("moment");
const {
  TIME_UNIT_MODIFY_TYPE_ADD,
  TIME_UNIT_MODIFY_TYPE_SUBSTRACT,
} = require("../../../commons/models/date/TimeUnitModifyType");

function generateDateVariable(variable) {
  let { date, format, locale = "en", dateType, day, minute, second } = variable;
  let result = getDateByDateType(dateType, date);
  const modifyValue = (date, setMethod, getMethod, modifyType, value) => {
    if (modifyType === TIME_UNIT_MODIFY_TYPE_ADD) {
      setMethod(getMethod() + value);
    } else if (modifyType === TIME_UNIT_MODIFY_TYPE_SUBSTRACT) {
      setMethod(getMethod() - value);
    }
  };

  if (day) {
    modifyValue(
      result,
      (value) => result.setDate(value),
      () => result.getDate(),
      day.modifyType,
      day.value
    );
  }
  if (minute) {
    modifyValue(
      result,
      (value) => result.setMinutes(value),
      () => result.getMinutes(),
      minute.modifyType,
      minute.value
    );
  }
  if (second) {
    modifyValue(
      result,
      (value) => result.setSeconds(value),
      () => result.getSeconds(),
      second.modifyType,
      second.value
    );
  }
  return moment(result).locale(locale).format(format);
}

function getDateByDateType(dateType, date) {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  switch (dateType) {
    case FIX:
      return new Date(date);
    case CURRENT:
      return currentDate;
    case FIRST_DATE_OF_CURRENT_MONTH:
      return new Date(year, month, 1);
    case FIRST_DATE_OF_LAST_MONTH:
      return new Date(year, month - 1, 1);
    case FIRST_DATE_OF_NEXT_MONTH:
      return new Date(year, month + 1, 1);
    case LAST_DATE_OF_CURRENT_MONTH:
      return new Date(year, month + 1, 0);
    case LAST_DATE_OF_LAST_MONTH:
      return new Date(year, month, 0);
    case LAST_DATE_OF_NEXT_MONTH:
      return new Date(year, month + 2, 0);
  }
}

module.exports = {
  generateDateVariable,
};

const {
  VARIABLE_TYPE_DATE,
  VARIABLE_TYPE_PREVIOUS_REQUEST,
} = require("../../commons/models/VariableType");
const { generateDateVariable } = require("./date/dateVariableGenerator");
const {
  generatePreviousRequestVariable,
} = require("./previousRequest/previousRequestGenerator");

function constructRequest(previousRequestResponses, request) {
  let { dynamicBody, dynamicHeaders, dynamicRequestParams } = request;
}

function getDynamicObject(
  previousRequestResponses,
  targetObject,
  dynamicValueConfigs
) {
  dynamicValueConfigs((config) => {
    const { position } = config;
    const value = getDynamicValue(previousRequestResponses, config);
    insertValueIntoPosition(targetObject, position, value);
    return targetObject;
  });
}

function insertValueIntoPosition(currentObject, position, value) {
  const current = currentObject;
  position.forEach((currentPosition, index) => {
    if (!current[currentPosition]) {
      current[currentPosition] = {};
    }
    // TODO please make this better later, we are in hurry to push this!!!
    // We don't have to validate this everytime. We only need to add this at last when exit the loop
    if (index === position.length - 1) {
      current[currentPosition] = value;
    }
  });
  return currentObject;
}

function getDynamicValue(previousRequestResponses, dynaimcValueConfig) {
  const { variableType } = dynaimcValueConfig;
  switch (variableType) {
    case VARIABLE_TYPE_DATE:
      return generateDateVariable(dynaimcValueConfig);
    case VARIABLE_TYPE_PREVIOUS_REQUEST:
      return generatePreviousRequestVariable(
        previousRequestResponses,
        dynaimcValueConfig
      );
  }
}

module.exports = {};

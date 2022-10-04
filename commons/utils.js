const {
  generatePreviousRequestVariable,
} = require("./previousRequestVariable");
const {
  generateDateVariable,
} = require("../services/variable/date/dateVariable");
const {
  VARIABLE_TYPE_DATE,
  VARIABLE_TYPE_PREVIOUS_REQUEST,
} = require("./models/VariableType");

function splitDynamicString(inputString) {
  return inputString.split(/[{}]/);
}

function generateRequestParamsString(
  previousRequestResponses,
  staticObject,
  variables
) {
  requestParamsObject = setVariableObject(
    previousRequestResponses,
    staticObject,
    variables
  );
  let result = "";
  for (const objectKey in requestParamsObject) {
    result += "&" + objectKey + "=" + requestParamsObject[objectKey];
  }
  return result.length > 0 ? "?" + result.substring(1) : "";
}

function setVariableObject(previousRequestResponses, staticObject, variables) {
  for (const variable of variables) {
    const { position } = variable;
    const value = generateVariable(previousRequestResponses, variable);
    staticObject = setValueIntoObject(staticObject, position, value);
  }
  return staticObject;
}

function setValueIntoObject(object, position, value) {
  let tempObject = object;
  let index = 0;
  // while (index < position.length - 1) {
  //   if (!tempObject[position[index]]) {
  //     tempObject[position[index]] = {};
  //   }
  //   tempObject = tempObject[position[index]];
  //   index++;
  // }
  Object.assign(tempObject, { [position]: value });
  return object;
}

function generateVariable(previousRequestResponses, variable) {
  const { variableType } = variable;
  if (variableType === VARIABLE_TYPE_PREVIOUS_REQUEST) {
    return generatePreviousRequestVariable(previousRequestResponses, variable);
  } else if (variableType === VARIABLE_TYPE_DATE) {
    return generateDateVariable(variable);
  }
}

module.exports = { generateRequestParamsString, setVariableObject };

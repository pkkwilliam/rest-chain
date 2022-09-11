function generatePreviousRequestVariable(previousRequestResponses, variable) {
  let { prefix = "", suffix = "", value } = variable;
  const splited = value.split("@");
  // ['', '0', 'headers', 'authorization']
  const spliced = splited.splice(1);
  // ['0', 'headers', 'authorization']
  const responseIndex = spliced[0];
  const responseContent = spliced[1];
  const responseKey = spliced[2];
  console.log("variable value", responseIndex, responseContent, responseKey);
  previousRequestValue = previousRequestResponses[responseIndex][
    responseContent
  ].get([responseKey]);
  // console.debug("modified header value:", previousRequestValue);
  value = prefix + previousRequestValue + suffix;
  return value;
}

function extractVariableBody(inputString, variableDelimiter) {
  let queue = [];
  let variables = [];
  let result;
  for (let i = 0; i < inputString.length; i++) {
    const current = inputString[i];
    if (current === "}") {
      let localResult = "";
      let char = queue.pop();
      while (char != "{") {
        localResult = char + localResult;
        char = queue.pop();
      }
      variables.push(localResult);
      queue.push(variableDelimiter);
    } else {
      queue.push(inputString[i]);
    }
  }
  return {
    inputString: queue.reduce((previous, current) => (previous += current), ""),
    variables,
  };
}

module.exports = {
  generatePreviousRequestVariable,
};

const AccountStorage = require("../models/Account");

async function validateApiKey(req) {
  const { headers } = req;
  const apiKey = headers["apikey"];
  const rapidApiKey = headers["x-rapidapi-key"];
  const existed = await AccountStorage.exists({ apiKey });
  console.log("apiKey:", apiKey, "rapidApiKey:", rapidApiKey);
  console.log("existed:", existed);
}

module.exports = { validateApiKey };

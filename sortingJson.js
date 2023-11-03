const axios = require("axios");

const allUrl = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

const RetryUrl = 3;

const fetchUrl = async (url, RetryUrl) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (RetryUrl > 0) {
      return fetchUrl(url, RetryUrl - 1);
    } else {
      console.error(`[Fail] ${url}: The endpoint is unavailable`);
      // throw error;
      return;
    }
  }
};

const sorting = async () => {
  let countTrue = 0;
  let countFals = 0;

  for (const url of allUrl) {
    try {
      const data = await fetchUrl(url, RetryUrl);

      if (data && data.hasOwnProperty("isDone")) {
        const isDone = data.isDone;
        console.log(`[Success] ${url}: isDone - ${isDone ? "True" : "False"}`);

        if (isDone) {
          countTrue++;
        } else {
          countFals++;
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  console.log(`Found True values: ${countTrue}`);
  console.log(`Found False values: ${countFals}`);
};

sorting();

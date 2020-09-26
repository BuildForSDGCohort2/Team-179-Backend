const axios = require('axios');
// const axiosRetry = require('axios-retry');
// const debug = require('debug')('app:APICallController');
// const errorHelper = require('./errorHelper');

module.exports = async (requestUrl, headers, json, requestMethod) => {
  const options = {
    headers,
  };
  try {
    // axiosRetry(axios, {
    //   retries: 3,
    //   retryDelay: axiosRetry.exponentialDelay,
    //   retryCondition: (axioserr) => true,
    // });
    let results;
    if (requestMethod === 'POST') {
      results = await axios.post(requestUrl, json, options);
    }
    results = await axios.get(requestUrl, options);
    return results;
  } catch (err) {
    if (err.response) {
      const errorObj = {
        statusCode: err.response.status,
        data: err.response.data,
      };
      return errorObj;
      // return errorHelper.customErrorResponse(res, err);
    }
    return `err', ${err.message}`;
  }
};

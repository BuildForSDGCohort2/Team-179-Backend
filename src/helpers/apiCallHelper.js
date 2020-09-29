const axios = require('axios');
// const axiosRetry = require('axios-retry');
// const debug = require('debug')('app:APICallController');
// const errorHelper = require('./errorHelper');

module.exports = async (requestUrl, reqheaders, json, requestMethod) => {
  const options = {
    method: requestMethod,
    url: requestUrl,
    data: json,
    headers: reqheaders,
    // eslint-disable-next-line no-unused-vars
    validateStatus: (status) => true,
  };
  try {
    const results = await axios(options);
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

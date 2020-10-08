const errorHelper = {};
errorHelper.formatErrorObj = (err) => {
  const formatError = err.toString();
  const obj = JSON.parse(JSON.stringify(formatError.substring(formatError.indexOf('{'))));
  return JSON.parse(obj);
};

errorHelper.outputJSONErrorMessage = (err) => {
  const obj = errorHelper.formatErrorObj(err);
  return {
    status_code: obj.status_code,
    message: obj.message,
  };
};

errorHelper.getErrorObj = (err) => {
  const errorObj = {
    error_message: '',
    error_stack: '',
    error_type: '',
  };
  if (typeof err === 'string') {
    errorObj.error_message = err;
    errorObj.error_stack = err;
    errorObj.error_type = '';
  } else {
    errorObj.error_message = err.message;
    errorObj.error_stack = err.stack;
    errorObj.error_type = err.name;
  }
  return errorObj;
};

errorHelper.customErrorResponse = (res, cancellationErr) => {
  const errorMessage = errorHelper.outputJSONErrorMessage(cancellationErr);

  res.status(errorMessage.statusCode);

  res.json({
    status: errorMessage.statusCode,
    data: errorMessage.data,
  });
};
// function errorHandler(err, req, res, next) {
//   switch (true) {
//     case typeof err === 'string':
//       // custom application error
//       const is404 = err.toLowerCase().endsWith('not found');
//       const statusCode = is404 ? 404 : 400;
//       return res.status(statusCode).json({ message: err });
//     case err.name === 'ValidationError':
//       // mongoose validation error
//       return res.status(400).json({ message: err.message });
//     case err.name === 'UnauthorizedError':
//       // jwt authentication error
//       return res.status(401).json({ message: 'Unauthorized' });
//     default:
//       return res.status(500).json({ message: err.message });
//   }
// }
module.exports = errorHelper;

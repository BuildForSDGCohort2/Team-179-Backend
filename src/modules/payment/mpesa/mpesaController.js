const debug = require('debug')('app:RoleController');
// const { Mpesa } = require('mpesa-api');
// const request = require('request');
const apiCallHelper = require('../../../helpers/apiCallHelper');
const otherHelper = require('../../../helpers/otherhelpers');
const config = require('../../../appconfigs/config')();
const mpesaValidationSchema = require('./validation');

function MpesaController(MpesaB2C, MpesaC2B, MpesaLNM, User, Project) {
  const getToken = (req, res, next) => {
    try {
      return otherHelper.sendResponse(res, 200, true, req.accessToken, null, 'success', null);
    } catch (error) {
      return next(error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const accessToken = async (req, res, next) => {
    debug('initializing access token');
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const method = 'GET';
    const headers = {
      Authorization: `Basic ${Buffer.from(`${config.mpesaKey
      }:${config.mpesaSecret}`).toString('base64')}`,
    };
    const data = null;
    try {
      const response = await apiCallHelper(url, headers, data, method);
      // debug({ response });
      req.accessToken = response.data;
      return next();
    } catch (error) {
      return next(error);
    }
  };
  // create our processing data endpoint to recive webhooks from Safaricom
  const c2bregistrPaymentURL = async (req, res, next) => {
    // const { amount, mssidn } = req.body;
    try {
      const method = 'POST';
      const headers = { Authorization: `Bearer ${req.accessToken.access_token}` };
      debug(headers);
      const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
      const json = {
        ShortCode: 600754,
        ResponseType: 'Completed',
        ConfirmationURL: 'https://agri-vesty.loca.lt/api/payments/c2b/confirm',
        ValidationURL: 'https://agri-vesty.loca.lt/api/payments/c2b/validate',
      };
      const response = await apiCallHelper(url, headers, json, method);
      debug(response);
      return otherHelper.sendResponse(res, 200, true, response, null, 'success', null);
    } catch (err) {
      return next(err);
    }
  };
  const c2bvalidateURL = (req, res) => {
    try {
      debug(req.body);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return debug(err);
    }
  };
  const c2bconfirmURL = (req, res) => {
    try {
      debug(req.body);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return debug(err);
    }
  };

  const c2bSimulatePayments = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { amount, phone } = req.body;
    try {
      if (!phone || !amount) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'please enter phone or amount', null);
      }
      phone = otherHelper.processPhone(phone);
      const body = {
        ShortCode: 600754,
        CommandID: 'CustomerPayBillOnline',
        Amount: amount,
        Msisdn: phone,
        BillRefNumber: otherHelper.generateRandomHexString(15),
      };
      const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
      const method = 'POST';
      const token = req.accessToken.access_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCallHelper(url, headers, body, method);
      return otherHelper.sendResponse(res, 400, true, response, null, 'success', null);
    } catch (error) {
      return next(error);
    }
  };
  const transactionType = [];
  const lipaNaMpesaprocessPayments = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { amount, phone } = req.body;
    const data = {};
    // Validate if the phone number is a kenyan number and amout
    try {
      if (!phone || !amount) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'please enter phone or amount', null);
      }
      phone = otherHelper.processPhone(phone);
      debug(phone);
      await mpesaValidationSchema.validateAsync(req.body);
      const postBody = {
        BusinessShortCode: 174379,
        Password: Buffer.from(`${config.lipaMpesaCode}${config.lipaMpesaKey}${otherHelper.getTimeStamp()}`).toString('base64'),
        Timestamp: otherHelper.getTimeStamp(),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: 174379,
        PhoneNumber: phone,
        CallBackURL: 'https://agri-vesty.loca.lt/api/payments/lnm/response',
        AccountReference: 'LNMOAgri',
        TransactionDesc: '@SandboxTests',
      };
      // debug(token);
      const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
      const method = 'POST';
      const token = req.accessToken.access_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCallHelper(url, headers, postBody, method);
      debug(response);
      if (typeof (response.ResponseCode) !== 'undefined' && response.ResponseCode === '0') {
        const requestID = response.MerchantRequestID;
        const transactionObj = {
          requestID,
          phone,
          amount,
          callBackStatus: false,
          status: 'PendingCompletion',
        };
        debug(transactionObj);
        transactionType.push(transactionObj);
        data.trans = transactionObj;
        data.status = 'success';
        data.requestID = response.MerchantRequestID;
      }
      return otherHelper.sendResponse(res, 400, true, data, null, 'success', null);
    } catch (err) {
      return next(err);
    }
  };
  const lipaNaMpesatransactionComplete = (transactData) => {
    setTimeout(() => {
      debug(transactData);
    }, 60000);
  };
  const lipaNaMpesatransaction = (req, res) => {
    debug(req.body);
    const requestID = req.body.Body.stkCallback.MerchantRequestID;
    let transData = {};
    const resultCode = req.body.Body.stkCallback.ResultCode;
    let status;
    if (resultCode === '1031') {
      status = 'Cancelled';
    } else if (resultCode === '1037') {
      status = 'RequestTimeOut';
    } else if (resultCode === '0') {
      status = 'Success';
    } else {
      status = 'Failed';
    }
    const resultDesc = req.body.Body.stkCallback.ResultDesc;
    transactionType.forEach((trans) => {
      if (trans.requestID === requestID) {
        transData = trans;
        transData.status = status;
        transData.callBackStatus = true;
        transData.timeStamp = otherHelper.getTimeStamp();
      }
      transData.resultCode = 'Unkown';
      transData.status = 'Unresolved';
      transData.resultDesc = '[Error] Unresolved Callback';
      transData.callBackStatus = true;
      return transData;
    });
    transData.resultCode = resultCode;
    transData.resultDesc = resultDesc;
    /* Persist Processing Results to a MongoDB collection */
    lipaNaMpesatransactionComplete(transData);
    /* Send ACK receipt back to the LNM API */
    const message = { ResponseCode: '0', ResponseDesc: 'success' };
    res.status(200).json(message);
  };

  const b2cData = {};
  const b2cPaymentRequest = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { amount, phone } = req.body;
    // Validate if the phone number is a kenyan number and amout
    const { projectId } = req.params;
    try {
      if (!phone || !amount) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'please enter phone or amount', null);
      }
      phone = otherHelper.processPhone(phone);
      debug(phone);
      await mpesaValidationSchema.validateAsync(req.body);
      const { id } = req.payload.user;
      b2cData.projectId = projectId;
      b2cData.userId = id;
      const body = {
        InitiatorName: 'testapi754',
        SecurityCredential: config.mpesa_encoded,
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: 600754,
        PartyB: phone,
        Remarks: 'Withdrawal Money for Project X',
        QueueTimeOutURL: 'https://agri-vesty.loca.lt/api/payments/b2c/timeout',
        ResultURL: 'https://agri-vesty.loca.lt/api/payments/b2c/success',
        Occasion: 'Thank you',
      };
      const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';
      const method = 'POST';
      const token = req.accessToken.access_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCallHelper(url, headers, body, method);
      debug(response);
      return otherHelper.sendResponse(res, 200, true, response, null, 'transaction successful', null);
    } catch (error) {
      return next(error);
    }
  };
  const b2cSuccesss = async (req, res, next) => {
    try {
      const { body } = req;
      debug(req.body);
      debug(req.body.Result.ResultParameters);
      debug(req.body.Result.ReferenceData);
      const data = {
        resultDesc: body.ResultDesc ? body.ResultDesc : null,
        // eslint-disable-next-line max-len
        OriginatorConversationID: body.OriginatorConversationID ? body.OriginatorConversationID : null,
        ConversationID: body.ConversationID ? body.ConversationID : null,
        TransactionID: body.TransactionID ? body.TransactionID : null,
        ResultParameters: body.Result.ResultParameters ? body.Result.ResultParameters : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = await User.findOne({ where: { id: b2cData.userId } });
      const project = await Project.findOne({ where: { id: b2cData.projectId } });
      const results = await MpesaB2C.create(data);
      results.setUsers(user);
      results.setProjects(project);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return next(err);
    }
  };
  const b2cTimeout = async (req, res, next) => {
    try {
      debug(req.body);
      const { body } = req;
      const data = {
        resultDesc: body.ResultDesc ? body.ResultDesc : null,
        // eslint-disable-next-line max-len
        OriginatorConversationID: body.OriginatorConversationID ? body.OriginatorConversationID : null,
        ConversationID: body.ConversationID ? body.ConversationID : null,
        TransactionID: body.TransactionID ? body.TransactionID : null,
        ResultParameters: body.Result.ResultParameters ? body.Result.ResultParameters : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = await User.findOne({ where: { id: b2cData.userId } });
      const project = await Project.findOne({ where: { id: b2cData.projectId } });
      const results = MpesaB2C.create(data);
      results.setUsers(user);
      results.setProjects(project);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    c2bregistrPaymentURL,
    c2bvalidateURL,
    c2bconfirmURL,
    getToken,
    accessToken,
    lipaNaMpesaprocessPayments,
    lipaNaMpesatransaction,
    c2bSimulatePayments,
    b2cPaymentRequest,
    b2cSuccesss,
    b2cTimeout,
  };
  return controller;
}

module.exports = MpesaController;

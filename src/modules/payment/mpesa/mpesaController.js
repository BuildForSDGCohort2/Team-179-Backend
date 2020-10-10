/* eslint-disable no-param-reassign */
const debug = require('debug')('app:RoleController');
// const { date } = require('@hapi/joi');
// const { Mpesa } = require('mpesa-api');
// const request = require('request');
const apiCallHelper = require('../../../helpers/apiCallHelper');
const otherHelper = require('../../../helpers/otherhelpers');
const config = require('../../../appconfigs/config')();
const mpesaValidationSchema = require('./validation');

function MpesaController(MpesaB2C, MpesaC2B, MpesaLNM, User, Project, ProjectInvestments) {
  const getToken = (req, res, next) => {
    try {
      return otherHelper.sendResponse(res, 200, true, req.accessToken, null, 'success', null);
    } catch (error) {
      return next(error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const accessToken = async (req, res, next) => {
    // debug('initializing access token');
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const method = 'GET';
    const headers = {
      Authorization: `Basic ${Buffer.from(`${config.mpesaKey
      }:${config.mpesaSecret}`).toString('base64')}`,
    };
    debug(config.mpesaKey);
    const data = null;
    try {
      const response = await apiCallHelper(url, headers, data, method);
      // debug({ response.data });
      if (!response.data.access_token) {
        return otherHelper.sendResponse(
          res, 500, true, response, null, 'Unable to access token', null,
        );
      }
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
      const headers = {
        Authorization: `Bearer ${req.accessToken.access_token}`,
      };
      // debug(headers);
      const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
      const json = {
        ShortCode: config.shortCode,
        ResponseType: 'Completed',
        ConfirmationURL: config.confirmUrl,
        ValidationURL: config.validateUrl,
      };
      const response = await apiCallHelper(url, headers, json, method);
      const responseObject = JSON.parse(JSON.stringify(response.data));
      debug(responseObject);
      return otherHelper.sendResponse(
        res, 200, true, responseObject, null, responseObject.ResponseDescription, null,
      );
    } catch (err) {
      return next(err);
    }
  };
  const c2bSimulateData = {};
  const c2bSimulateDataCache = [];
  const c2bvalidateURL = (req, res, next) => {
    try {
      const { body } = req;
      debug(req.body);
      const data = {
        TransactionType: body.TransactionType ? body.TransactionType : null,
        TransID: body.TransID ? body.TransID : null,
        TransTime: body.TransTime ? body.TransTime : null,
        TransAmount: body.TransAmount ? body.TransAmount : null,
        BusinessShortCode: body.BusinessShortCode ? body.BusinessShortCode : null,
        BillRefNumber: body.BillRefNumber ? body.BillRefNumber : null,
        InvoiceNumber: body.InvoiceNumber ? body.InvoiceNumber : null,
        ThirdPartyTransID: body.ThirdPartyTransID ? body.ThirdPartyTransID : null,
        MSISDN: body.MSISDN ? body.MSISDN : null,
        FirstName: body.FirstName ? body.FirstName : null,
        MiddleName: body.MiddleName ? body.MiddleName : null,
        LastName: body.LastName ? body.LastName : null,
        OrgAccountBalance: body.OrgAccountBalance ? body.OrgAccountBalance : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // debug(data);
      c2bSimulateDataCache.push(data);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return next(err);
    }
  };
  const c2bconfirmURL = async (req, res, next) => {
    try {
      const { body } = req;
      debug(req.body);
      let transactData;
      await c2bSimulateDataCache.forEach((elem) => {
        // debug(elem);
        if (!(elem.TransID === body.TransID) && !(elem.BillRefNumber === body.BillRefNumber)) {
          return;
        }
        elem.TransactionType = body.TransactionType;
        elem.OrgAccountBalance = body.OrgAccountBalance;
        // eslint-disable-next-line consistent-return
        transactData = elem;
      });
      // debug(transactData);
      const user = await User.findOne({ where: { id: c2bSimulateData.userId } });
      const project = await Project.findOne({ where: { id: c2bSimulateData.projectId } });
      const results = await MpesaC2B.create(transactData);
      const invested = await ProjectInvestments.create({
        amountInvested: body.TransAmount ? body.TransAmount : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (project) {
        Project.update({ totalInvested: project.totalInvested += parseFloat(body.TransAmount) },
          { where: { id: c2bSimulateData.projectId } });
      }
      results.setUser(user);
      results.setProject(project);
      invested.setUser(user);
      invested.setProject(project);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return next(err);
    }
  };

  const c2bSimulatePayments = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { amount, phone } = req.body;
    const { projectId } = req.params;
    const { id } = req.payload.user;
    try {
      if (!phone || !amount) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'please enter phone or amount', null);
      }
      phone = otherHelper.processPhone(phone);
      const body = {
        ShortCode: config.shortCode,
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
      const responseObject = JSON.parse(JSON.stringify(response.data));
      c2bSimulateData.projectId = projectId;
      c2bSimulateData.userId = id;
      // if (response) {
      //   setTimeout(() => {
      //     c2bSimulateDataCache.forEach(
      //       (elem) => otherHelper.sendResponse(res, 200, true, elem, null, elem.Trans, null),
      //     );
      //   }, 60000);
      // }
      return otherHelper.sendResponse(
        res, 200, true, responseObject, null, responseObject.ResponseDescription, null,
      );
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
      // debug(phone);
      await mpesaValidationSchema.validateAsync(req.body);
      const postBody = {
        BusinessShortCode: config.lipaMpesaCode,
        Password: Buffer.from(`${config.lipaMpesaCode}${config.lipaMpesaKey}${otherHelper.getTimeStamp()}`).toString('base64'),
        Timestamp: otherHelper.getTimeStamp(),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: config.lipaMpesaCode,
        PhoneNumber: phone,
        CallBackURL: config.callbackUrl,
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
      const responseObject = JSON.parse(JSON.stringify(response.data));
      // debug(responseObject);
      if (typeof (responseObject.ResponseCode) !== 'undefined' && responseObject.ResponseCode === '0') {
        const requestID = response.MerchantRequestID;
        const transactionObj = {
          requestID,
          phone,
          amount,
          callBackStatus: false,
          status: 'PendingCompletion',
        };
        // debug(transactionObj);
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

  const lipaNaMpesatransaction = (req, res) => {
    // debug(req.body);
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
    /* Send ACK receipt back to the LNM API */
    const message = { ResponseCode: 0, ResponseDesc: 'success' };
    res.status(200).json(message);
  };

  const b2cData = {};
  const b2cDataCache = [];
  const b2cPaymentRequest = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { amount, phone } = req.body;
    const { id } = req.payload.user;
    const { projectId } = req.params;
    // Validate if the phone number is a kenyan number and amount
    try {
      if (!phone || !amount) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'please enter phone or amount', null);
      }
      phone = otherHelper.processPhone(phone);
      // debug(phone);
      await mpesaValidationSchema.validateAsync({ amount, phone });
      // debug(id, projectId);
      const project = await Project.findOne({ where: { id: projectId } });
      // debug(project.totalInvested <= parseFloat(amount));
      if (!project) {
        return otherHelper.sendResponse(res, 400, true, null, null, 'No project to associate this transaction', null);
      }
      if (parseFloat(amount) >= project.totalInvested) {
        return otherHelper.sendResponse(res, 400, true, null, null, 'Your transaction amount exceeds the project amount', null);
      }
      const body = {
        InitiatorName: config.initiator,
        SecurityCredential: config.mpesa_encoded,
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: config.shortCode,
        PartyB: phone,
        Remarks: 'Withdrawal Money from Agrivesty',
        QueueTimeOutURL: config.queueUrl,
        ResultURL: config.resultUrl,
        Occasion: 'Thank you',
      };
      const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';
      const method = 'POST';
      const token = req.accessToken.access_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCallHelper(url, headers, body, method);
      const responseObject = JSON.parse(JSON.stringify(response.data));
      // debug(response);
      b2cData.projectId = projectId;
      b2cData.userId = id;
      return otherHelper.sendResponse(
        res, 201, true, responseObject, null, responseObject.ResponseDescription, null,
      );
    } catch (error) {
      return next(error);
    }
  };
  const b2cSuccesss = async (req, res, next) => {
    try {
      const { body } = req;
      // debug(req.body);
      const data = {
        resultDesc: body.Result.ResultDesc ? body.Result.ResultDesc : null,
        // eslint-disable-next-line max-len
        OriginatorConversationID: body.Result.OriginatorConversationID ? body.Result.OriginatorConversationID : null,
        ConversationID: body.Result.ConversationID ? body.Result.ConversationID : null,
        TransactionID: body.Result.TransactionID ? body.Result.TransactionID : null,
        ResultParameters: body.Result.ResultParameters ? body.Result.ResultParameters : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      b2cDataCache.push(data);
      const user = await User.findOne({ where: { id: b2cData.userId } });
      const project = await Project.findOne({ where: { id: b2cData.projectId } });
      const results = await MpesaB2C.create(data);
      const { ResultParameter } = data.ResultParameters;
      if (project) {
        ResultParameter.forEach((item) => {
          if (item.Key === 'TransactionAmount') {
            Project.update({
              totalInvested: project.totalInvested -= parseFloat(item.Value),
            }, { where: { id: b2cData.projectId } });
          }
        });
      }
      results.setUser(user);
      results.setProject(project);
      // debug(b2cDataCache);
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
      // debug(req.body);
      const { body } = req;
      const data = {
        resultDesc: body.Result.ResultDesc ? body.Result.ResultDesc : null,
        // eslint-disable-next-line max-len
        OriginatorConversationID: body.Result.OriginatorConversationID ? body.Result.OriginatorConversationID : null,
        ConversationID: body.Result.ConversationID ? body.Result.ConversationID : null,
        TransactionID: body.Result.TransactionID ? body.Result.TransactionID : null,
        ResultParameters: body.Result.ResultParameters ? body.Result.ResultParameters : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      b2cDataCache.push(data);
      const user = await User.findOne({ where: { id: b2cData.userId } });
      const project = await Project.findOne({ where: { id: b2cData.projectId } });
      const results = MpesaB2C.create(data);
      results.setUser(user);
      results.setProject(project);
      // debug(b2cDataCache);
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'success',
      });
    } catch (err) {
      return next(err);
    }
  };
  // // c2bLocalCache Listener for Updating appUI
  // const c2bListener = (req, res, next) => {
  //   try {
  //     setTimeout(() => {
  //       c2bSimulateDataCache.forEach(
  //         (elem) => otherHelper.sendResponse(res, 200, true, elem, null, elem.Trans, null));
  //     }, 60000);
  //   } catch (err) {
  //     next(err);
  //   }
  // };
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

const express = require('express');
const mpesaController = require('../../modules/payment/mpesa/mpesaController');
const auth = require('../../middleware/auth');

function PaymentRoutes(MpesaB2C, MpesaC2B, MpesaLNM, User, Project) {
  const router = express.Router();
  const {
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
  } = mpesaController(MpesaB2C, MpesaC2B, MpesaLNM, User, Project);

  /**
   * @route POST api/payments/c2b/register
   * @description register URLS
   * @access Private
  */
  router.route('/payments/c2b/register').post(accessToken, c2bregistrPaymentURL);

  /**
  * @route Put api/payments/c2b/validation
  * @description updte farm detail route
  * @access Private
 */
  router.route('/payments/c2b/confirm').post(c2bconfirmURL);

  /**
  * @route Put api/payments/c2b/success
  * @description get success url
  * @access Private
 */
  router.route('/payments/c2b/validate').post(c2bvalidateURL);
  /**
  * @route Put api/payments/c2b/simulate
  * @description get success url
  * @access Private
 */
  router.route('/payments/c2b/simulate').post(auth, accessToken, c2bSimulatePayments);
  /**
    * @route Put api/payments/access-token
    * @description get token
    * @access Private
  */
  router.route('/payments/access-token').get(auth, accessToken, getToken);
  /**
  * @route Put api/hooks/lnmResponse
  * @description post data from lipa na Mpesa API
  * @access Public
 */
  router.route('/payments/lnm/response').post(lipaNaMpesatransaction);
  /**
  * @route Put api/hooks/lnmResponse
  * @description post data from lipa na Mpesa API
  * @access Public
 */
  router.route('/payments/lnp/process').post(auth, accessToken, lipaNaMpesaprocessPayments);
  /**
  * @route Put api/payments/b2c/timeout
  * @description withdraw from our lipa na mpesa
  * @access Private
 */
  router.route('/payments/b2c/:projectId/requestPayment').post(auth, accessToken, b2cPaymentRequest);
  /**
  * @route Put api/payments/b2c/timeout
  * @description post timeout data from B2C Mpesa API
  * @access Public
 */
  router.route('/payments/b2c/timeout').post(b2cTimeout);
  /**
  * @route Put api/payments/b2c/success
  * @description post success data from B2C Mpesa API
  * @access Public
 */
  router.route('/payments/b2c/success').post(b2cSuccesss);
  return router;
}

module.exports = PaymentRoutes;

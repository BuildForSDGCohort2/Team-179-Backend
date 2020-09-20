const express = require('express');
const farmController = require('../../modules/farm/farmController');
const auth = require('../../middleware/auth');

function farmRoutes(Farm, Location) {
  const router = express.Router();
  const {
    createFarm,
    findFarm,
    findAllFarms,
    deleteFirm,
    updateFarms,
  } = farmController(Farm, Location);

  /**
   * @route POST api/farm/create-farm
   * @description create farm route
   * @access Private
  */
  router.route('/farms/create-farm').post(auth, createFarm);

  /**
  * @route Put api/user/farm/:farmId
  * @description updte farm detail route
  * @access Private
 */
  router.route('/farms/:farmId').put(auth, updateFarms);

  /**
  * @route Put api/farms/:farmId
  * @description get farm details
  * @access Private
 */
  router.route('/farms/:farmId').get(auth, findFarm);

  /**
  * @route Put api/farms/list
  * @description get farm list
  * @access Private
 */
  router.route('/farms/list').get(auth, findAllFarms);
  /**
   * @route Put /farm/delete
   * @description Delete farm
   * @access Private
  */
  router.route('/farm/delete').delete(auth, deleteFirm);
  return router;
}

module.exports = farmRoutes;

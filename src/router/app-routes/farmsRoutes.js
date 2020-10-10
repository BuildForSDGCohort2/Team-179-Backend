const express = require('express');
const farmController = require('../../modules/farm/farmController');
const auth = require('../../middleware/auth');
const fileUpload = require('../../helpers/upload')('public/uploads/');
const rolesMiddleware = require('../../middleware/rolesMiddleware');

function farmRoutes(Farm, Location, User) {
  const router = express.Router();
  const {
    createFarm,
    findFarm,
    findAllFarms,
    deleteFirm,
    updateFarms,
  } = farmController(Farm, Location, User);
  const { uploader } = fileUpload;
  const { isAdmin } = rolesMiddleware(User);
  /**
   * @route POST api/farm/create-farm
   * @description create farm route
   * @access Private
  */
  router.route('/farms/create-farm').post(auth, uploader.single('images'), createFarm);

  /**
  * @route Put api/user/farm/:farmId
  * @description updte farm detail route
  * @access Private
 */
  router.route('/farm/:farmId').put(auth, uploader.single('images'), updateFarms);

  /**
  * @route Put api/farms/:farmId
  * @description get farm details
  * @access Private
 */
  router.route('/farm/:farmId').get(auth, findFarm);

  /**
  * @route Put api/farms/list
  * @description get farm list
  * @access Private
 */
  router.route('/farms/lists').get(auth, isAdmin, findAllFarms);
  /**
   * @route Put /farm/delete
   * @description Delete farm
   * @access Private
  */
  router.route('/farm/delete/:farmId').delete(auth, deleteFirm);
  return router;
}

module.exports = farmRoutes;

const debug = require('debug')('app:FarmController');
// const { Op } = require('sequelize');
const farmSchema = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');

function farmController(Farm, Location, User) {
  const createFarm = async (req, res, next) => {
    // checks if the user submits an empty request
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
    }
    try {
      let { images } = req.body;
      debug(req.file);
      if (req.file) {
        debug(req.file);
        const url = `${req.protocol}://${req.get('host')}`;
        images = `${url}/public/uploads/${req.file.filename}`;
      }
      // validates the farms data from the user
      // await farmSchema.validateAsync(req.body);
      const {
        landForm,
        landTenure,
        irrigationType,
        soilType,
        soilDepth,
        accessibility,
        landSize,
        county,
        longitude,
        latitude,
      } = req.body;
      // Find request on the database
      const { id } = req.payload.user;
      // debug(id)
      const dbUser = await User.findOne({ where: { id } });

      if (!dbUser) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'No user to associate this farm', null);
      }
      const createdAt = new Date();
      const updatedAt = new Date();
      const geoLocation = { type: 'Point', coordinates: [latitude, longitude] };
      // creates farm
      const fResults = await Farm.create({
        images,
        landForm,
        landTenure,
        irrigationType,
        soilType,
        soilDepth,
        accessibility,
        landSize,
        createdAt,
        updatedAt,
        location: {
          county,
          longitude,
          latitude,
          geoLocation,
          createdAt,
          updatedAt,
        },
      }, {
        include: {
          model: Location,
          as: 'location',
        },
      });
      // KozB_qfEyUiFBJxDqt0eeA
      // EW3oe0C_5ECWW9xSClxTXg
      // PJCVaXbCw0mSG8mRQ8pVhw
      // XG-p06eEUEaAcg-fwqvgPg
      // 16Ntf93p5k-A3TwrNUQ2bA
      // CgKn1oaQSUizC71xz6tqYg
      // 2AfMApTF8EurzplFxkRnyA

      // Set associations
      fResults.setUser(dbUser);

      return otherHelper.sendResponse(res, 201, true, fResults, null, 'Farm created successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds one firm from the database
  const findFarm = async (req, res, next) => {
    try {
      const { farmId } = req.params;
      // debug(req.payload);
      const farm = await Farm.findOne({
        where: { id: farmId },
        include: [
          {
            model: Location,
            as: 'location',
          }],
      });
      if (!farm) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No farm found', null);
      }
      return otherHelper.sendResponse(res, 201, true, farm, null, 'Farm fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds farms from the database
  const findAllFarms = async (req, res, next) => {
    try {
      const farms = await Farm.findAll({
        include: [
          {
            model: Location,
            as: 'location',
          },
        ],
      });
      if (isEmpty(farms)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No farms available to show', null);
      }
      return otherHelper.sendResponse(res, 201, true, farms, null, 'Farms fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // update farms from to database
  const updateFarms = async (req, res, next) => {
    if (req.body.id) {
      delete req.body.id;
    }
    const { farmId } = req.params;
    try {
      let { images } = req.body;
      if (req.file) {
        debug(req.file);
        const url = `${req.protocol}://${req.get('host')}`;
        images = `${url}/public/uploads/${req.file.filename}`;
      }
      // validates the farms data from the user
      await farmSchema.validateAsync(req.body);
      const {
        landForm,
        landTenure,
        irrigationType,
        soilType,
        soilDepth,
        accessibility,
        landSize,
        county,
        longitude,
        latitude,
      } = req.body;
      const updatedAt = new Date();
      const geoLocation = { type: 'Point', coordinates: [latitude, longitude] };
      // Update location
      const fResults = await Farm.update({
        images,
        landForm,
        landTenure,
        irrigationType,
        soilType,
        soilDepth,
        accessibility,
        landSize,
        updatedAt,
      },
      { where: { id: farmId } });
      // update location
      await Location.update({
        county,
        longitude,
        latitude,
        geoLocation,
        updatedAt,
      },
      { where: { farmId } });
      return otherHelper.sendResponse(res, 201, true, fResults, null, 'Farms fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // Delete a firm
  const deleteFirm = async (req, res, next) => {
    try {
      const { farmId } = req.params;
      await Farm.destroy({
        where: { id: farmId },
        cascade: true,
        include: [{
          model: Location,
          as: 'location',
          cascade: true,
        }],
      });
      return otherHelper.sendResponse(res, 204, true, {}, null, 'Farm deleted successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    createFarm,
    findFarm,
    findAllFarms,
    deleteFirm,
    updateFarms,
  };
  return controller;
}

module.exports = farmController;

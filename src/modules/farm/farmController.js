// const debug = require('debug')('app:UserController');
// const { Op } = require('sequelize');
const {
  farmSchema,
} = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');

function farmController(Farm, Location) {
  const createFarm = async (req, res, next) => {
    // checks if the user submits an empty request
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
    }
    try {
      // validates the firms data from the user
      await farmSchema.validateAsync(req.body);
      const {
        images,
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
      const id = req.payload.user;
      const dbUser = await Farm.findOne({ where: { id } });

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
      });
      // creates farm
      const lResults = await Location.create({
        county,
        longitude,
        latitude,
        geoLocation,
        createdAt,
        updatedAt,
      });
      // Set associations
      fResults.setUsers(dbUser);
      fResults.setLocations(lResults);

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
        return otherHelper.sendResponse(res, 400, false, null, null, 'No firm found', null);
      }
      return otherHelper.sendResponse(res, 201, true, farm, null, 'Farm fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds farms from the database
  const findAllFarms = async (req, res, next) => {
    try {
      const farms = await Farm.findAll({});
      if (isEmpty(farms)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No farms available to show', null);
      }
      return otherHelper.sendResponse(res, 201, true, farms, null, 'Firms fetched successfully', null);
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
    // validates the firms data from the user
    await farmSchema.validateAsync(req.body);

    const {
      images,
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
    try {
      // Confirm if the firm exists in the database
      const farm = await Farm.findOne({
        where: { id: farmId },
      });
      if (isEmpty(farm)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No farms available to show', null);
      }
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
      });
      // update location
      await Location.update({
        county,
        longitude,
        latitude,
        geoLocation,
        updatedAt,
      });
      return otherHelper.sendResponse(res, 201, true, fResults, null, 'Firms fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // Delete a firm
  const deleteFirm = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Farm.destroy({
        where: { id },
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

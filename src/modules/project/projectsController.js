// const debug = require('debug')('app:ProjectController');
// const {
//   projectSchema,
// } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');

function projectController(
  Project, User, Farm, Location, ProjectComments, ProjectFavs, ProjectInvestments,
) {
  const createProject = async (req, res, next) => {
    // checks if the user submits an empty request
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
    }
    try {
      // validates the projects data from the user
      // await projectSchema.validateAsync(req.body);
      let { imageUrl } = req.body;
      const {
        title,
        description,
        targetCost,
        dateStarted,
        dateEnded,
      } = req.body;
      if (req.file) {
        // debug(req.file);
        const url = `${req.protocol}://${req.get('host')}`;
        imageUrl = `${url}/public/uploads/${req.file.filename}`;
      }
      // Find request on the database
      const { id } = req.payload.user;
      const dbUser = await User.findOne({ where: { id } });
      const { farmId } = req.params;
      // debug(farmId);
      const farm = await Farm.findOne({ where: { id: farmId } });

      if (!dbUser || !farm) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'No user or farm to associate this project', null);
      }
      const createdAt = new Date();
      const updatedAt = new Date();
      // creates project
      const fResults = await Project.create({
        title,
        description,
        dateStarted,
        dateEnded,
        imageUrl,
        active: false,
        targetCost,
        totalInvested: 0,
        isWithdrawable: false,
        createdAt,
        updatedAt,
      });

      // Set associations
      fResults.setUser(dbUser);
      fResults.setFarm(farm);
      return otherHelper.sendResponse(res, 201, true, fResults, null, 'project created successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds one firm from the database
  const findProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      // debug(req.payload);
      const project = await Project.findOne({
        where: { id: projectId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['email', 'displayName'],
          },
          {
            model: Farm,
            as: 'farm',
            include: [
              {
                model: Location,
                as: 'location',
              }],
          },
          {
            model: ProjectInvestments,
            as: 'investors',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['email', 'displayName'],
              }],
          },
          {
            model: ProjectFavs,
            as: 'favourites',
          },
          {
            model: ProjectComments,
            as: 'comments',
          },
        ],
      });
      if (!project) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No project found', null);
      }
      return otherHelper.sendResponse(res, 201, true, project, null, 'project fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds projects from the database
  const findAllProjects = async (req, res, next) => {
    let { offset, limit } = req.query;
    try {
      limit = Math.abs(parseInt(limit, 10));
      offset = Math.abs(parseInt(offset, 10)) * limit;
      const projects = await Project.findAndCountAll({
        where: {},
        limit,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      if (isEmpty(projects)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No projects available to show', null);
      }
      return otherHelper.sendResponse(res, 201, true, projects, null, 'Projects fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // update projects from to database
  const updateProject = async (req, res, next) => {
    if (req.body.id) {
      delete req.body.id;
    }
    const { projectId } = req.params;
    // validates the firms data from the user
    // await projectSchema.validateAsync(req.body);

    const {
      title,
      description,
      dateEnded,
      imageUrl,
      status,
      targetCost,
      progress,
      isWithdrawable,
    } = req.body;
    try {
      // Confirm if the firm exists in the database
      const project = await Project.findOne({
        where: { id: projectId },
      });
      if (isEmpty(project)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'No projects available to show', null);
      }
      const updatedAt = new Date();
      // Update location
      const fResults = await project.update({
        title,
        description,
        dateEnded,
        imageUrl,
        status,
        targetCost,
        progress,
        isWithdrawable,
        updatedAt,
      },
      { where: { id: projectId } });
      return otherHelper.sendResponse(res, 201, true, fResults, null, 'Projects fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // Delete a project
  const deleteProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      await Project.destroy({
        where: { id: projectId },
      });
      return otherHelper.sendResponse(res, 204, true, {}, null, 'Project deleted successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    createProject,
    findProject,
    findAllProjects,
    deleteProject,
    updateProject,
  };
  return controller;
}

module.exports = projectController;

const express = require('express');
const projectController = require('../../modules/project/projectsController');
const auth = require('../../middleware/auth');

function farmRoutes(Project, User, Farm, Location, ProjectComments, ProjectFavs) {
  const router = express.Router();
  const {
    createProject,
    findProject,
    findAllProjects,
    deleteProject,
    updateProject,
  } = projectController(Project, User, Farm, Location, ProjectComments, ProjectFavs);

  /**
   * @route POST api/farm/create-farm
   * @description create farm route
   * @access Private
  */
  router.route('/:farmId/projects/create-projects').post(auth, createProject);

  /**
  * @route Put api/user/farm/:farmId
  * @description updte farm detail route
  * @access Private
 */
  router.route('/projects/:projectId').put(auth, updateProject);

  /**
  * @route Put api/farms/:farmId
  * @description get farm details
  * @access Private
 */
  router.route('/projects/:projectId').get(auth, findProject);

  /**
  * @route Put api/farms/list
  * @description get farm list
  * @access Private
 */
  router.route('/projects/list').get(auth, findAllProjects);
  /**
   * @route Put /farm/delete
   * @description Delete farm
   * @access Private
  */
  router.route('/projects/:projectId').delete(auth, deleteProject);
  return router;
}

module.exports = farmRoutes;

const express = require('express');
const projectController = require('../../modules/project/projectsController');
const auth = require('../../middleware/auth');
const fileUpload = require('../../helpers/upload')('public/uploads/');

function farmRoutes(Project, User, Farm, Location, ProjectComments, ProjectFavs) {
  const router = express.Router();
  const {
    createProject,
    findProject,
    findAllProjects,
    deleteProject,
    updateProject,
  } = projectController(Project, User, Farm, Location, ProjectComments, ProjectFavs);
  const { uploader } = fileUpload;

  /**
   * @route POST api/farm/create-farm
   * @description create farm route
   * @access Private
  */
  router.route('/:farmId/projects/create-projects').post(auth, uploader.single('imageUrl'), createProject);

  /**
  * @route Put api/user/farm/:farmId
  * @description updte farm detail route
  * @access Private
 */
  router.route('/project/:projectId').put(auth, uploader.single('imageUrl'), updateProject);

  /**
  * @route Put api/farms/:farmId
  * @description get farm details
  * @access Private
 */
  router.route('/project/:projectId').get(auth, findProject);

  /**
  * @route Put api/farms/list
  * @description get farm list
  * @access Private
 */
  router.route('/projects').get(auth, findAllProjects);
  /**
   * @route Put /farm/delete
   * @description Delete farm
   * @access Private
  */
  router.route('/project/:projectId').delete(auth, deleteProject);
  return router;
}

module.exports = farmRoutes;

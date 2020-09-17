const debug = require('debug')('app:RoleController');

function RoleController(Role) {
  // Loop through all the id in req.role
  const createRole = (roles, results) => roles.forEach(async (item) => {
    try {
      // Search if the role id it exists. If it doesn't, respond with status 400.
      const role = await Role.findOne({ where: { role: item } });
      if (!role) {
        debug('Role does not exist');
      }
      await results.setRoles(role);
      return;
    } catch (err) {
      debug(err);
    }
  });
  const controller = {
    createRole,
  };
  return controller;
}

module.exports = RoleController;

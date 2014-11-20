'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var levels = require('../../app/controllers/levels.server.controller');

	// Levels Routes
	app.route('/levels')
		.get(levels.list)
		.post(users.requiresLogin, levels.create);

	app.route('/levels/:levelId')
		.get(levels.read)
		.put(users.requiresLogin, levels.hasAuthorization, levels.update)
		.delete(users.requiresLogin, levels.hasAuthorization, levels.delete);

	// Finish by binding the Level middleware
	app.param('levelId', levels.levelByID);
};
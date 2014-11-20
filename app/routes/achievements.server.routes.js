'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var achievements = require('../../app/controllers/achievements.server.controller');

	// Achievements Routes
	app.route('/achievements')
		.get(achievements.list)
		.post(users.requiresLogin, achievements.create);

	app.route('/achievements/:achievementId')
		.get(achievements.read)
		.put(users.requiresLogin, achievements.hasAuthorization, achievements.update)
		.delete(users.requiresLogin, achievements.hasAuthorization, achievements.delete);

	// Finish by binding the Achievement middleware
	app.param('achievementId', achievements.achievementByID);
};
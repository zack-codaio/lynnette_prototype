'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var kcomponents = require('../../app/controllers/kcomponents.server.controller');

	// Kcomponents Routes
	app.route('/kcomponents')
		.get(kcomponents.list)
		.post(users.requiresLogin, kcomponents.create);

	app.route('/kcomponents/:kcomponentId')
		.get(kcomponents.read)
		.put(users.requiresLogin, kcomponents.hasAuthorization, kcomponents.update)
		.delete(users.requiresLogin, kcomponents.hasAuthorization, kcomponents.delete);

	// Finish by binding the Kcomponent middleware
	app.param('kcomponentId', kcomponents.kcomponentByID);
};
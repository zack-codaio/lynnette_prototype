'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Kcomponent = mongoose.model('Kcomponent'),
	_ = require('lodash');

/**
 * Create a Kcomponent
 */
exports.create = function(req, res) {
	var kcomponent = new Kcomponent(req.body);
	kcomponent.user = req.user;

	kcomponent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(kcomponent);
		}
	});
};

/**
 * Show the current Kcomponent
 */
exports.read = function(req, res) {
	res.jsonp(req.kcomponent);
};

/**
 * Update a Kcomponent
 */
exports.update = function(req, res) {
	var kcomponent = req.kcomponent ;

	kcomponent = _.extend(kcomponent , req.body);

	kcomponent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(kcomponent);
		}
	});
};

/**
 * Delete an Kcomponent
 */
exports.delete = function(req, res) {
	var kcomponent = req.kcomponent ;

	kcomponent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(kcomponent);
		}
	});
};

/**
 * List of Kcomponents
 */
exports.list = function(req, res) { Kcomponent.find().sort('-created').populate('user', 'displayName').exec(function(err, kcomponents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(kcomponents);
		}
	});
};

/**
 * Kcomponent middleware
 */
exports.kcomponentByID = function(req, res, next, id) { Kcomponent.findById(id).populate('user', 'displayName').exec(function(err, kcomponent) {
		if (err) return next(err);
		if (! kcomponent) return next(new Error('Failed to load Kcomponent ' + id));
		req.kcomponent = kcomponent ;
		next();
	});
};

/**
 * Kcomponent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.kcomponent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
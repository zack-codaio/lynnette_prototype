'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Level = mongoose.model('Level'),
	_ = require('lodash');

/**
 * Create a Level
 */
exports.create = function(req, res) {
	var level = new Level(req.body);
	level.user = req.user;

	level.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(level);
		}
	});
};

/**
 * Show the current Level
 */
exports.read = function(req, res) {
	res.jsonp(req.level);
};

/**
 * Update a Level
 */
exports.update = function(req, res) {
	var level = req.level ;

	level = _.extend(level , req.body);

	level.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(level);
		}
	});
};

/**
 * Delete an Level
 */
exports.delete = function(req, res) {
	var level = req.level ;

	level.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(level);
		}
	});
};

/**
 * List of Levels
 */
exports.list = function(req, res) { Level.find().sort('created').populate('user', 'displayName').populate('kcomponents').exec(function(err, levels) {
        //console.log(levels);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(levels);
		}
	});
};

/**
 * Level middleware
 */
exports.levelByID = function(req, res, next, id) { Level.findById(id).populate('user', 'displayName').exec(function(err, level) {
		if (err) return next(err);
		if (! level) return next(new Error('Failed to load Level ' + id));
		req.level = level ;
		next();
	});
};

/**
 * Level authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.level.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
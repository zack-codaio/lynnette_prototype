'use strict';

//Setting up route
angular.module('achievements').config(['$stateProvider',
	function($stateProvider) {
		// Achievements state routing
		$stateProvider.
		state('listAchievements', {
			url: '/achievements',
			templateUrl: 'modules/achievements/views/list-achievements.client.view.html'
		}).
		state('createAchievement', {
			url: '/achievements/create',
			templateUrl: 'modules/achievements/views/create-achievement.client.view.html'
		}).
		state('viewAchievement', {
			url: '/achievements/:achievementId',
			templateUrl: 'modules/achievements/views/view-achievement.client.view.html'
		}).
		state('editAchievement', {
			url: '/achievements/:achievementId/edit',
			templateUrl: 'modules/achievements/views/edit-achievement.client.view.html'
		});
	}
]);
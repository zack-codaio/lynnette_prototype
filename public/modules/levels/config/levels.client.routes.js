'use strict';

//Setting up route
angular.module('levels').config(['$stateProvider',
	function($stateProvider) {
		// Levels state routing
		$stateProvider.
		state('listLevels', {
			url: '/levels',
			templateUrl: 'modules/levels/views/list-levels.client.view.html'
		}).
		state('createLevel', {
			url: '/levels/create',
			templateUrl: 'modules/levels/views/create-level.client.view.html'
		}).
		state('viewLevel', {
			url: '/levels/:levelId',
			templateUrl: 'modules/levels/views/view-level.client.view.html'
		}).
		state('editLevel', {
			url: '/levels/:levelId/edit',
			templateUrl: 'modules/levels/views/edit-level.client.view.html'
		});
	}
]);
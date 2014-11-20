'use strict';

//Setting up route
angular.module('kcomponents').config(['$stateProvider',
	function($stateProvider) {
		// Kcomponents state routing
		$stateProvider.
		state('listKcomponents', {
			url: '/kcomponents',
			templateUrl: 'modules/kcomponents/views/list-kcomponents.client.view.html'
		}).
		state('createKcomponent', {
			url: '/kcomponents/create',
			templateUrl: 'modules/kcomponents/views/create-kcomponent.client.view.html'
		}).
		state('viewKcomponent', {
			url: '/kcomponents/:kcomponentId',
			templateUrl: 'modules/kcomponents/views/view-kcomponent.client.view.html'
		}).
		state('editKcomponent', {
			url: '/kcomponents/:kcomponentId/edit',
			templateUrl: 'modules/kcomponents/views/edit-kcomponent.client.view.html'
		});
	}
]);
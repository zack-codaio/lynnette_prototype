'use strict';

//Achievements service used to communicate Achievements REST endpoints
angular.module('achievements').factory('Achievements', ['$resource',
	function($resource) {
		return $resource('achievements/:achievementId', { achievementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
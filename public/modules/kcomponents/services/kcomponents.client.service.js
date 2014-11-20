'use strict';

//Kcomponents service used to communicate Kcomponents REST endpoints
angular.module('kcomponents').factory('Kcomponents', ['$resource',
	function($resource) {
		return $resource('kcomponents/:kcomponentId', { kcomponentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
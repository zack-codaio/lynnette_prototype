'use strict';

// Kcomponents controller
angular.module('kcomponents').controller('KcomponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Kcomponents',
	function($scope, $stateParams, $location, Authentication, Kcomponents ) {
		$scope.authentication = Authentication;

		// Create new Kcomponent
		$scope.create = function() {
			// Create new Kcomponent object
			var kcomponent = new Kcomponents ({
				name: this.name
			});

			// Redirect after save
			kcomponent.$save(function(response) {
				$location.path('kcomponents/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Kcomponent
		$scope.remove = function( kcomponent ) {
			if ( kcomponent ) { kcomponent.$remove();

				for (var i in $scope.kcomponents ) {
					if ($scope.kcomponents [i] === kcomponent ) {
						$scope.kcomponents.splice(i, 1);
					}
				}
			} else {
				$scope.kcomponent.$remove(function() {
					$location.path('kcomponents');
				});
			}
		};

		// Update existing Kcomponent
		$scope.update = function() {
			var kcomponent = $scope.kcomponent ;

			kcomponent.$update(function() {
				$location.path('kcomponents/' + kcomponent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Kcomponents
		$scope.find = function() {
			$scope.kcomponents = Kcomponents.query();
		};

		// Find existing Kcomponent
		$scope.findOne = function() {
			$scope.kcomponent = Kcomponents.get({ 
				kcomponentId: $stateParams.kcomponentId
			});
		};
	}
]);
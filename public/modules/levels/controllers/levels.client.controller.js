'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels',
	function($scope, $stateParams, $location, Authentication, Levels ) {
		$scope.authentication = Authentication;

		// Create new Level
		$scope.create = function() {
			// Create new Level object
			var level = new Levels ({
				name: this.name
			});

			// Redirect after save
			level.$save(function(response) {
				$location.path('levels/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Level
		$scope.remove = function( level ) {
			if ( level ) { level.$remove();

				for (var i in $scope.levels ) {
					if ($scope.levels [i] === level ) {
						$scope.levels.splice(i, 1);
					}
				}
			} else {
				$scope.level.$remove(function() {
					$location.path('levels');
				});
			}
		};

		// Update existing Level
		$scope.update = function() {
			var level = $scope.level ;

			level.$update(function() {
				$location.path('levels/' + level._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Levels
		$scope.find = function() {
			$scope.levels = Levels.query();
		};

		// Find existing Level
		$scope.findOne = function() {
			$scope.level = Levels.get({ 
				levelId: $stateParams.levelId
			});
		};
	}
]);
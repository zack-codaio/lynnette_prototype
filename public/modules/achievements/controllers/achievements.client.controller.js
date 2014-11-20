'use strict';

// Achievements controller
angular.module('achievements').controller('AchievementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Achievements',
	function($scope, $stateParams, $location, Authentication, Achievements ) {
		$scope.authentication = Authentication;

		// Create new Achievement
		$scope.create = function() {
			// Create new Achievement object
			var achievement = new Achievements ({
				name: this.name,
                description: this.description
			});

			// Redirect after save
			achievement.$save(function(response) {
				$location.path('achievements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Achievement
		$scope.remove = function( achievement ) {
			if ( achievement ) { achievement.$remove();

				for (var i in $scope.achievements ) {
					if ($scope.achievements [i] === achievement ) {
						$scope.achievements.splice(i, 1);
					}
				}
			} else {
				$scope.achievement.$remove(function() {
					$location.path('achievements');
				});
			}
		};

		// Update existing Achievement
		$scope.update = function() {
			var achievement = $scope.achievement ;

			achievement.$update(function() {
				$location.path('achievements/' + achievement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Achievements
		$scope.find = function() {
			$scope.achievements = Achievements.query();
		};

		// Find existing Achievement
		$scope.findOne = function() {
			$scope.achievement = Achievements.get({ 
				achievementId: $stateParams.achievementId
			});
		};
	}
]);
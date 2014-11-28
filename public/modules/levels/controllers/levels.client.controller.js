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

        //on level complete
        $scope.complete_level = function(){
            console.log("level completed");
            $scope.level_complete_message = true;
        }
        $scope.level_complete_next = function(){
            console.log("level complete next");
            $scope.level_complete_message = false;
            $scope.problem_selection_rating();
        }
        $scope.problem_selection_rating = function(){
            console.log("problem selection rating show");
            $scope.problem_selection_message = true;
        }
        $scope.problem_selection_next = function(){
            console.log("problem selection next");
            $scope.problem_selection_message = false;
            $scope.suggested_level_message = true;
        }
        $scope.suggested_level_next = function(){
            $scope.suggested_level_message = false;

        }



        //on bad level selection
        $scope.bad_selection_click = function(){
            console.log("bad selection");
            $scope.bad_selection = true;
        }
        $scope.bad_selection_next = function(){
            $scope.bad_selection = false;
        }

        //on good level selection
        $scope.positive_feedback_click = function(){
            $scope.positive_feedback = true;

        }
        $scope.positive_feedback_next = function(){
            $scope.positive_feedback = false;
        }


        $scope.daily_challenge_selected = 1;
        $scope.daily_challenge_new = $scope.daily_challenge_selected;
        $scope.select1 = true;
        //daily challenge
        $scope.daily_challenge_click = function(){
            $scope.daily_challenge = true;
        }
        $scope.prospective_challenge = function(a){
            $scope.daily_challenge_new = a;

            if(a == 1){
                $scope.select1 = true;
                $scope.select2 = false;
                $scope.select3 = false;
            }
            if(a == 2){
                $scope.select1 = false;
                $scope.select2 = true;
                $scope.select3 = false;
            }
            if(a == 3){
                $scope.select1 = false;
                $scope.select2 = false;
                $scope.select3 = true;
            }
        }
        $scope.daily_challenge_next = function(){
            $scope.daily_challenge = false;
            $scope.daily_challenge_selected = $scope.daily_challenge_new;
        }
	}
]);
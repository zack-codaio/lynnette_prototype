'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels', '$rootScope',
    function ($scope, $stateParams, $location, Authentication, Levels, $rootScope) {
        $scope.authentication = Authentication;

        // Create new Level
        $scope.create = function () {
            // Create new Level object
            var level = new Levels({
                name: this.name,
                leveltype: this.leveltype,
                icon: this.icon,
                example1: this.example1,
                example2: this.example2
            });

            // Redirect after save
            level.$save(function (response) {
                $location.path('levels/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Level
        $scope.remove = function (level) {
            if (level) {
                level.$remove();

                for (var i in $scope.levels) {
                    if ($scope.levels [i] === level) {
                        $scope.levels.splice(i, 1);
                    }
                }
            } else {
                $scope.level.$remove(function () {
                    $location.path('levels');
                });
            }
        };

        // Update existing Level
        $scope.update = function () {
            //parse kcomponents into an array

            //set $scope.level.kcomponenets equal to the array
            if($scope.level.kcomponentList.length > 3){
            var res = $scope.level.kcomponentList.split(" ");
            console.log(res);

            var level = $scope.level;
            level.kcomponents = res;
                delete level.kcomponentList;
            }

            level.$update(function () {
                $location.path('levels/' + level._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Levels
        $scope.find = function () {
            $scope.levels = Levels.query();
        };

        // Find existing Level
        $scope.findOne = function () {
            $scope.level = Levels.get({
                levelId: $stateParams.levelId
            }, function(){
                $scope.level.kcomponentList = "";
                console.log($scope.level);
                for(var i = 0; i < $scope.level.kcomponents.length; i++){
                    $scope.level.kcomponentList = $scope.level.kcomponentList + $scope.level.kcomponents[i] + " ";
                }
                $scope.level.kcomponentList = $scope.level.kcomponentList.substr(0, $scope.level.kcomponentList.length-1);
            });


        };

        //$scope.find_kcs = function(){
        //    $scope.kcs = kcomponents.query();
        //    console.log($scope.kcs);
        //}

        //on level complete
        $scope.complete_level = function () {
            console.log("level completed");
            $scope.level_complete_message = true;
        }
        $scope.level_complete_next = function () {
            console.log("level complete next");
            $scope.level_complete_message = false;
            $scope.problem_selection_rating();
        }
        $scope.problem_selection_rating = function () {
            console.log("problem selection rating show");
            $scope.problem_selection_message = true;
        }
        $scope.problem_selection_next = function () {
            console.log("problem selection next");
            $scope.problem_selection_message = false;
            $scope.suggested_level_message = true;
        }
        $scope.suggested_level_next = function () {
            $scope.suggested_level_message = false;

        }


        //on bad level selection
        $scope.bad_selection_click = function () {
            console.log("bad selection");
            $scope.bad_selection = true;
        }
        $scope.bad_selection_next = function () {
            $scope.bad_selection = false;
        }

        //on good level selection
        $scope.positive_feedback_click = function () {
            $scope.positive_feedback = true;

        }
        $scope.positive_feedback_next = function () {
            $scope.positive_feedback = false;
        }


        $scope.daily_challenge_selected = 1;
        $scope.daily_challenge_new = $scope.daily_challenge_selected;
        $scope.select1 = true;
        $scope.challenge_name = "I Ain't Scared";
        //daily challenge
        $scope.daily_challenge_click = function () {
            $scope.daily_challenge = true;
        }
        $scope.prospective_challenge = function (a) {
            $scope.daily_challenge_new = a;

            if (a == 1) {
                $scope.select1 = true;
                $scope.select2 = false;
                $scope.select3 = false;
                $scope.challenge_name = "I Ain't Scared";
            }
            if (a == 2) {
                $scope.select1 = false;
                $scope.select2 = true;
                $scope.select3 = false;
                $scope.challenge_name = "Elemental Sampler";
            }
            if (a == 3) {
                $scope.select1 = false;
                $scope.select2 = false;
                $scope.select3 = true;
                $scope.challenge_name = "Hot Streak";
            }
        }
        $scope.daily_challenge_next = function () {
            $scope.daily_challenge = false;
            $scope.daily_challenge_selected = $scope.daily_challenge_new;
        }

        $scope.air_click = function () {
            console.log($scope);
            $rootScope.$broadcast('KCbroadcast', {kcs: $scope.levels[4].kcomponents});
        }

        $scope.$on('KCupdated', function(){
            console.log("received KCupdated");

            //hacky but it works?
            setTimeout(function(){
                $scope.find();
            }, 500);
        });

        $scope.select_level = function(levelindex){
            console.log("select_level("+levelindex+")");
            $rootScope.$broadcast('KCbroadcast', {kcs: $scope.levels[levelindex].kcomponents});
        }
    }
]).directive('myKc', function(){
    console.log();

    //return{
    //    restrict: 'E',
    //    scope: {
    //        id: '=info'
    //    },
    //    template: 'ID: {{id}}'
    //};
});
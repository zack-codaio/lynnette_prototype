'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels', '$rootScope',
    function ($scope, $stateParams, $location, Authentication, Levels, $rootScope) {
        $scope.authentication = Authentication;

        $scope.masteredLevel;
        $scope.difficulty_sequence = "332211";

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
            if ($scope.level.kcomponentList.length > 3) {
                var res = $scope.level.kcomponentList.split(" ");
                //console.log(res);

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
            $scope.levels.$promise.then(function (result) {

                //look for mismatch of mastered and kcs
                console.log($scope.levels);
                for (var i = 0; i < $scope.levels.length; i++) {
                    //check level mastered

                    var curlevel = $scope.levels[i];
                    //console.log("scope mastered " + curlevel.mastered);
                    var levelmastered = result[i].mastered;
                    //console.log("levelmastered "+i+" "+levelmastered);

                    //check kc mastered for each kc
                    var kcmastered = true;
                    $scope.levels[i].progress = 100;
                    for (var j = 0; j < $scope.levels[i].kcomponents.length; j++) {
                        if ($scope.levels[i].kcomponents[j].mastered == false) {
                            kcmastered = false;
                        }
                        if ($scope.levels[i].progress > $scope.levels[i].kcomponents[j].percentComplete) {
                            $scope.levels[i].progress = $scope.levels[i].kcomponents[j].percentComplete;
                        }
                    }
                    //if all kc's mastered and level mastered is false

                    if (levelmastered == false && kcmastered == true) {
                        //update level mastered
                        $scope.levels[i].mastered = true;
                        //update to DB
                        for (var k = 0; k < $scope.levels[i].kcomponents.length; k++) {
                            $scope.levels[i].kcomponents[k] = $scope.levels[i].kcomponents[k]._id;
                        }
                        $scope.levels[i].user = $scope.levels[i].user._id;

                        $scope.levels[i]
                            .$update(function () {
                                $scope.find();
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                                console.log($scope.error);
                            });
                        //trigger level complete popup
                        $rootScope.$broadcast("levelmastered", {levelid: i});
                        console.log("levelmastered " + i);
                    }
                    else if (kcmastered == false && levelmastered == true) {
                        $scope.levels[i].mastered = false;

                        //update to DB
                        for (var k = 0; k < $scope.levels[i].kcomponents.length; k++) {
                            $scope.levels[i].kcomponents[k] = $scope.levels[i].kcomponents[k]._id;
                        }
                        $scope.levels[i].user = $scope.levels[i].user._id;

                        $scope.levels[i]
                            .$update(function () {
                                $scope.find();
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                            });
                    }

                }
            });
        };

        // Find existing Level
        $scope.findOne = function () {
            $scope.level = Levels.get({
                levelId: $stateParams.levelId
            }, function () {
                $scope.level.kcomponentList = "";
                console.log($scope.level);
                for (var i = 0; i < $scope.level.kcomponents.length; i++) {
                    $scope.level.kcomponentList = $scope.level.kcomponentList + $scope.level.kcomponents[i] + " ";
                }
                $scope.level.kcomponentList = $scope.level.kcomponentList.substr(0, $scope.level.kcomponentList.length - 1);
            });
        };

        // Find existing Level
        $scope.findOneID = function (levelId) {
            $scope.level = Levels.get({
                levelId: levelId
            }, function () {
                $scope.level.kcomponentList = "";
                console.log($scope.level);
                $scope.level.progress = 100;
                for (var i = 0; i < $scope.level.kcomponents.length; i++) {
                    $scope.level.kcomponentList = $scope.level.kcomponentList + $scope.level.kcomponents[i] + " ";
                    if ($scope.level.progress > $scope.level.kcomponents[i].percentComplete) {
                        $scope.level.progress = $scope.level.kcomponents[i].percentComplete;
                    }

                }
                $scope.level.kcomponentList = $scope.level.kcomponentList.substr(0, $scope.level.kcomponentList.length - 1);

            });
        };

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
        $scope.$on('alreadymastered', function () {
            console.log("bad selection");
            $scope.bad_selection = true;
        });

        $scope.bad_selection_next = function (a) {
            $scope.bad_selection = false;
            if (a == 1) {
                $scope.problem_screen = false;
            }
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

        $scope.$on('KCupdated', function () {
            console.log("received KCupdated");

            //hacky but it works?
            setTimeout(function () {
                $scope.find();
            }, 500);
        });

        $scope.select_level = function (levelindex) {
            console.log("select_level(" + levelindex + ")");
            //check if mastered
            var mastered = true;
            for (var i = 0; i < $scope.levels[levelindex].kcomponents.length; i++) {
                if ($scope.levels[levelindex].kcomponents[i].mastered == false) {
                    mastered = false;
                }
            }
            if (mastered == true) {
                console.log('already mastered');
                $scope.$broadcast('alreadymastered', {});
                $rootScope.$broadcast('levelselect', {level: levelindex, mastered: true});
            }
            else if (mastered == false) {
                //$rootScope.$broadcast('KCbroadcast', {kcs: $scope.levels[levelindex].kcomponents});
                $rootScope.$broadcast('levelselect', {level: levelindex, mastered: false});
            }
        }

        $scope.$on('levelmastered', function (event, data) {
            console.log('LevelsClientController received levelmastered');
            console.log('levelid = ' + data.levelid);

            $scope.level_complete_message = true;

            $scope.masteredLevel = $scope.levels[data.levelid];
            console.log($scope.masteredLevel);
        });

        $scope.problem_screen = false;
        $scope.hint_visible = false;
        $scope.problem = new Object();
        $scope.$on('levelselect', function (data, args) {
            $scope.selectedLevel = $scope.levels[args.level];
            $scope.problem_screen = true;

            var sequence = $scope.levels[args.level].sequence.toString();
            console.log(sequence);

            var difficulty = parseInt(sequence.slice(0, 1));
            $scope.levels[args.level].sequence = $scope.levels[args.level].sequence.slice(1) + difficulty;
            console.log($scope.levels[args.level]);
            //depopulate_level($scope.levels[args.level]).$update();
            //console.log($scope.levels[args.level].sequence);


            var difficulty = parseInt($scope.difficulty_sequence.slice(0, 1));
            $scope.difficulty_sequence = $scope.difficulty_sequence.slice(1) + difficulty;
            if (difficulty > 3 || difficulty < 1) {
                difficulty = 2;
            }
            console.log("difficulty = " + difficulty);


            $scope.problem.difficulty = difficulty;
            $scope.levelindex = args.level;
            $scope.hint_visible = false;
        });

        $scope.problem_complete = function (difficulty, levelindex, status) {
            if (status == 1) { //proper return
                console.log('problem complete');
                $scope.problem_screen = false;
                $rootScope.$broadcast('levelcomplete', {difficulty: difficulty, level: levelindex});
                console.log('levelindex: ' + levelindex);
                console.log('$scope.levels: ');
                console.log($scope.levels);
                $rootScope.$broadcast('KCbroadcast', {
                    kcs: $scope.levels[levelindex].kcomponents,
                    difficulty: difficulty
                });
            }
            else if (status == -1) { //back to selection
                console.log('problem complete received '+ status+' , back to selection');
                $scope.problem_screen = false;
            }
        }
        $scope.hint_click = function () {
            $scope.hint_visible = true;
        }

        $scope.aint_scared_complete = false;
        $scope.$on('aint_scared_complete', function (event, data) {
            console.log("received aint scared complete");
            $scope.aint_scared_complete = true;
        });

        $scope.hot_streak_complete = false;
        $scope.$on('hot_streak_complete', function (event, data) {
            console.log("received hot streak complete");
            $scope.hot_streak_complete = true;
        });

        $scope.trophy_case_show = false;
        $scope.trophy_case_click = function (a) {
            if (a == 1) {
                $scope.trophy_case_show = true;
            }
            else {
                $scope.trophy_case_show = false;
            }
        }
    }
]).directive('myKc', function () {
    console.log();

    //return{
    //    restrict: 'E',
    //    scope: {
    //        id: '=info'
    //    },
    //    template: 'ID: {{id}}'
    //};
});
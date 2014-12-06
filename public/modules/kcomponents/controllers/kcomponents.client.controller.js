'use strict';

// Kcomponents controller
angular.module('kcomponents').controller('KcomponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Kcomponents', '$rootScope',
    function ($scope, $stateParams, $location, Authentication, Kcomponents, $rootScope) {
        $scope.authentication = Authentication;

        // Create new Kcomponent
        $scope.create = function () {
            // Create new Kcomponent object
            var kcomponent = new Kcomponents({
                name: this.name
            });

            // Redirect after save
            kcomponent.$save(function (response) {
                $location.path('kcomponents/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Kcomponent
        $scope.remove = function (kcomponent) {
            if (kcomponent) {
                kcomponent.$remove();

                for (var i in $scope.kcomponents) {
                    if ($scope.kcomponents [i] === kcomponent) {
                        $scope.kcomponents.splice(i, 1);
                    }
                }
            } else {
                $scope.kcomponent.$remove(function () {
                    $location.path('kcomponents');
                });
            }
        };

        // Update existing Kcomponent
        $scope.update = function () {
            var kcomponent = $scope.kcomponent;


            kcomponent.$update(function () {
                $location.path('kcomponents/' + kcomponent._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Update existing Kcomponent within scope
        $scope.updateWithin = function (howmuch) {
            //var kcomponent = $scope.updateKC ;
            console.log(kcomponent);
            //$scope.findOneArg($scope.updateKC._id);

            var kcomponent = new Kcomponents(
                $scope.updateKC
            );
            //kcomponent.percentComplete = Math.round(kcomponent.percentComplete + getRandomArbitrary(0, 25));
            //kcomponent.percentComplete = kcomponent.percentComplete + 10;
            if (howmuch == 1) {
                kcomponent.percentComplete = kcomponent.percentComplete + 0;
            }
            else if (howmuch == 2) {
                kcomponent.percentComplete = kcomponent.percentComplete + 7;
            }
            else if (howmuch == 3) {
                kcomponent.percentComplete = kcomponent.percentComplete + 24;
            }
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            if (kcomponent.percentComplete >= 100) {
                kcomponent.percentComplete = 100;
                kcomponent.mastered = true;
            }

            kcomponent.$update(function () {
                //$location.path('kcomponents/' + $scope.updateKC._id);

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Kcomponents
        $scope.find = function () {
            $scope.kcomponents = Kcomponents.query();
            console.log($scope.kcomponents);
        };

        // Find existing Kcomponent
        $scope.findOne = function () {
            $scope.kcomponent = Kcomponents.get({
                kcomponentId: $stateParams.kcomponentId

            });
            console.log($stateParams.kcomponentId);
        };

        // Find existing Kcomponent
        $scope.findOneArg = function (id) {
            $scope.updateKC = Kcomponents.get({
                kcomponentId: id
            });
            console.log($scope.updateKC);
        };

        $scope.$on('KCbroadcast', function (event, args) {
            console.log("received KCbroadcast:");
            console.log(args);
            for (var i = 0; i < args.kcs.length; i++) {
                var kcomponent = args.kcs[i];

                $scope.updateKC = kcomponent;
                $scope.updateWithin(args.difficulty);
            }

            //$scope.$apply();
            //instead of apply, emit back to the other controller so it knows to $apply
            $scope.$emit('KCupdated', {});
        });

        $scope.reset_kcs = function () {
            console.log('resetting kcs');
            //for all kcs
            console.log($scope);
            for (var i = 0; i < $scope.kcomponents.length; i++) {
                //set all mastered to false
                //set all percentCompletes to 0
                $scope.kcomponents[i].mastered = false;
                $scope.kcomponents[i].percentComplete = 0;
                //console.log($scope.kcomponents[i]);
                $scope.kcomponents[i].$update(function (response) {
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        }

        $scope.scenario2 = function () {
            console.log('scenario 2');

            for (var i = 0; i < $scope.kcomponents.length; i++) {
                if (i >= 0 && i < 3) { //level 1
                    $scope.kcomponents[i].percentComplete = 25;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 3 && i < 6){ //level 2
                    $scope.kcomponents[i].percentComplete = 25;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 6 && i < 9){ //level 3
                    $scope.kcomponents[i].percentComplete = 40;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 9 && i < 12){ //level 4
                    $scope.kcomponents[i].percentComplete = 40;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 12 && i < 15){ //level 5
                    $scope.kcomponents[i].percentComplete = 80;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 15 && i < 18){ // level 6
                    $scope.kcomponents[i].percentComplete = 100;
                    $scope.kcomponents[i].mastered = true;
                }
                $scope.kcomponents[i].$update(function (response) {
                    $location.path('/');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        }

    }
]);
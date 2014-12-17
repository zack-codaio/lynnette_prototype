/**
 * Created by zackaman on 12/16/14.
 */

'use strict';

angular.module('core').controller('OnboardingController', ['$scope', '$rootScope',
    function($scope, $rootScope) {
        $scope.ycord = "300px";

        $scope.myStyle ={
            "width" : "300px"
        }

        $scope.test = function(){
            alert('test called');
        }

        $scope.tutorial = 1;

        //remove me if not in dev
        //$scope.tutorial = 99;

        $scope.next = function(){
            $scope.tutorial++;
        }

        $scope.back = function(){
            $scope.tutorial--;
        }
    }
]);
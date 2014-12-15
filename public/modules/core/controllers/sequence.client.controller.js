/**
 * Created by zackaman on 12/14/14.
 */

'use strict';

angular.module('core').controller('SequenceController', ['$scope', '$rootScope', 'Stars', 'lynHistory',
    function($scope, $rootScope, Stars, lynHistory) {

        //watch lynHistory for currentSequence
        $scope.currentSequence = $scope.$watch(function(){
                return lynHistory.currentSequence;
            },
            function (newVal, oldVal){
                if(typeof newVal !== 'undefined'){
                    console.log('currentSequence');
                    console.log(lynHistory.currentSequence);
                    $scope.currentSequence = lynHistory.currentSequence;
                }
            });

        //watch lynHistory for stars
        $scope.stars = $scope.$watch(function(){
                return lynHistory.stars;
            },
            function (newVal, oldVal){
                if(typeof newVal !== 'undefined'){
                    $scope.stars = lynHistory.stars;
                }
            });

        //watch lynHistory for missed_opportunities
        $scope.missed_opportunities = $scope.$watch(function(){
                return lynHistory.missed_opportunities;
            },
            function (newVal, oldVal){
                if(typeof newVal !== 'undefined'){
                    $scope.missed_opportunities = lynHistory.missed_opportunities;
                }
            });

        //watch lynHistory for total_sequence
        $scope.total_sequence = $scope.$watch(function(){
                return lynHistory.total_sequence;
            },
            function (newVal, oldVal){
                if(typeof newVal !== 'undefined'){
                    $scope.total_sequence = lynHistory.total_sequence;
                }
            });
    }
]);

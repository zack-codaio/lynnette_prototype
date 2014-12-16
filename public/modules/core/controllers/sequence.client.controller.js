/**
 * Created by zackaman on 12/14/14.
 */

'use strict';

angular.module('core').controller('SequenceController', ['$scope', '$rootScope', 'Stars', 'lynHistory',
    function($scope, $rootScope, Stars, lynHistory) {
        $scope.myStyle = "test test";


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

        $scope.show_feedback = false;
        $scope.the_feedback = "";
        $scope.greentext = false;
        $scope.explanatory_feedback = function(index, selected_levelname){
            console.log("explanatory feedback for "+index);

            //record selections clicked on
            $scope.levelselections[selected_levelname].selected = true;

            if($scope.levelselections[selected_levelname].mastered == false){
                $scope.greentext = true;
                $scope.the_feedback = "Correct! "+ $scope.currentSequence.sequence[index].levelname+" was unmastered and so had opportunities for mastery.  Picking "+$scope.currentSequence.sequence[index].levelname+" was a good choice."
            }
            else if($scope.levelselections[selected_levelname].mastered == true){
                $scope.greentext = false;
                $scope.the_feedback = $scope.currentSequence.sequence[index].levelname+" was already mastered, so it did not have any additional opportunities for mastery."
            }

            $scope.show_feedback = true;

            //if remaining = 0 or there weren't any bad selections
            //enable continue button
            var all_selected = true;
            if(typeof($scope.levelselections['Water']) !== 'undefined'){
                if($scope.levelselections['Water'].mastered == false && $scope.levelselections['Water'].selected == false){
                    all_selected = false;
                }
            }
            if(typeof($scope.levelselections['Earth']) !== 'undefined'){
                if($scope.levelselections['Earth'].mastered == false && $scope.levelselections['Earth'].selected == false){
                    all_selected = false;
                }
            }
            if(typeof($scope.levelselections['Metal']) !== 'undefined'){
                if($scope.levelselections['Metal'].mastered == false && $scope.levelselections['Metal'].selected == false){
                    all_selected = false;
                }
            }
            if(typeof($scope.levelselections['Fire']) !== 'undefined'){
                if($scope.levelselections['Fire'].mastered == false && $scope.levelselections['Fire'].selected == false){
                    all_selected = false;
                }
            }
            if(typeof($scope.levelselections['Air']) !== 'undefined'){
                if($scope.levelselections['Air'].mastered == false && $scope.levelselections['Air'].selected == false){
                    all_selected = false;
                }
            }
            if(typeof($scope.levelselections['Time']) !== 'undefined'){
                if($scope.levelselections['Time'].mastered == false && $scope.levelselections['Time'].selected == false){
                    all_selected = false;
                }
            }
            $scope.continue = all_selected;
        }



        $scope.levelselections;
        $scope.continue = false;

        //selection by level type

        //initialize
        $scope.$on('history_show', function(event, data){
            //initialize selections clicked on
            $scope.levelselections = new Object();

            if(lynHistory.missed_opportunities == 0){
                //enable continue button
                $scope.continue = true;
            }
            else if(lynHistory.missed_opportunities > 0){
                //disable continue button
                $scope.continue = false;
            }
            console.log(lynHistory.currentSequence.sequence);
            //make a structure where I can tell if all of the unmastered levels present have been selected
            for(var i = 0; i < lynHistory.currentSequence.sequence.length; i++){
                var levelname = lynHistory.currentSequence.sequence[i].levelname;
                if(typeof $scope.levelselections[levelname] == 'undefined'){
                    $scope.levelselections[levelname] = new Object();
                    $scope.levelselections[levelname].selected = false;
                    $scope.levelselections[levelname].mastered = lynHistory.currentSequence.sequence[i].mastered;
                }
            }
            //console.log($scope.levelselections);

            if(lynHistory.currentSequence.sequence.length >= 8){
            $scope.sequence1 = lynHistory.currentSequence.sequence;
            $scope.sequence2 = $scope.sequence1.splice(Math.ceil($scope.sequence1.length*10/2)/10);
                $scope.sequence1length = $scope.sequence1.length;
            }
            else{
                $scope.sequence1 = lynHistory.currentSequence.sequence;
            }

        });


        //reset
        $scope.$on('history_done', function(event, data){
           $scope.show_feedback = false;
        });

    }
]);

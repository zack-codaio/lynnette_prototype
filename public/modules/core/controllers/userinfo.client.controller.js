'use strict';

angular.module('core').controller('UserInfoController', ['$scope', 'Authentication', 'Menus', '$rootScope', 'Stars', 'lynHistory',
    function($scope, Authentication, Menus, $rootScope, Stars, lynHistory) {
        $scope.authentication = Authentication;

        console.log(Authentication);

        $scope.displayName = Authentication.user.displayName;
        $scope.selectionLevel = Authentication.user.selectionLevel;
        $scope.completionLevel = Authentication.user.completionLevel;


        //watch lynHistory for currentSequence
        $scope.currentSequence = $scope.$watch(function(){
            return lynHistory.currentSequence;
        },
        function (newVal, oldVal){
           if(typeof newVal !== 'undefined'){
               $scope.currentSequence = lynHistory.currentSequence;
           }
        });

        //watch lynHistory for currentStreak
        $scope.currentStreak = $scope.$watch(function(){
            return lynHistory.currentStreak;

        },
        function(newVal, oldVal){
            if(typeof newVal !== 'undefined'){
                $scope.currentStreak = lynHistory.currentStreak;
                //if this = 10, hot streak challenge is complete
            }
        });

        //watch lynHistory for totalgood
        //if totalgood / totalall > .9 and totalall >= 10, then "I ain't scared" challenge is complete
        $scope.totalgood = $scope.$watch(function(){
           return lynHistory.totalgood;
        },
            function(newVal, oldVal){
            if(typeof newVal !== 'undefined'){
             $scope.totalgood = lynHistory.totalgood;
            }
        });

        //watch lynHistory for totalall
        $scope.totalall = $scope.$watch(function(){
            return lynHistory.totalall;
        },
            function(newVal, oldVal){
                if(typeof newVal !== 'undefined'){
                    $scope.totalall = lynHistory.totalall;
                }

        });

        //watch lynHistory for percentgood
        $scope.percentgood = $scope.$watch(function(){
            return lynHistory.percentgood;
        },
        function(newVal, oldVal){
            if(typeof newVal !== 'undefined'){
                $scope.percentgood = lynHistory.percentgood;
            }
        });

        //watch lynHistory for session_total_unmastered
        $scope.session_total_unmastered = $scope.$watch(function(){
            return lynHistory.session_total_unmastered;
        }, function(newVal, oldVal){
            if(typeof newVal !== 'undefined'){
                $scope.session_total_unmastered = newVal;
            }
        })

        //watch Stars for stars_earned
        $scope.stars_earned = $scope.$watch(function(){
            return Stars.stars;
        },
        function(newVal, oldVal){
            if(typeof newVal !== 'undefined'){
                $scope.stars_earned = Stars.stars;
            }
        });

        //watch lynHistory for eventList, which contains the sequence of events
        $scope.eventList = $scope.$watch(function(){
            return lynHistory.eventList;
        }, function(newVal, oldVal){
           if(typeof newVal !== 'undefined'){
               $scope.eventList = lynHistory.eventList;
           }
        });

        //elemental sampler is triggered off of individual levels selected
        $scope.achievement_earned = 0;

        $scope.$on('levelselect', function(event, data){
            console.log('UserInfoController received levelselect');

            //selection event
            //  eventType = "selection"
            //  level
            //  mastered
            //  % completed?
            //  time
            var selectionEvent = new Object();
            selectionEvent.eventType = "selection";
            selectionEvent.level = data.level;
            selectionEvent.mastered = data.mastered;
            selectionEvent.levelname = data.levelname;
            selectionEvent.timestamp = new Date().getTime();

            if(data.mastered == false){
                lynHistory.inc_streak(1);
            }
            else{
                lynHistory.inc_sequence(-1);
            }
            lynHistory.totalall++;
            lynHistory.percentgood = Math.round((lynHistory.totalgood / (lynHistory.totalall))*100);

            lynHistory.eventList.push(selectionEvent);

            console.log("lynHistory");
            console.log(lynHistory);
            console.log(lynHistory.eventList);
        });

        $scope.$on('levelcomplete', function(event, data){

        });

        $scope.$on('levelmastered', function(event, data){
           console.log('UserInfoController received levelmastered');
            console.log('levelid '+ data.levelid);

            var masteredEvent = new Object();
            //level completion event
            //  eventType = "levelcomplete"
            //  level
            //  time
            masteredEvent.eventType = "levelcomplete";
            masteredEvent.level = data.levelid;
            masteredEvent.timestamp = new Date().getTime();

            //attach level selection events to the level completion event
            masteredEvent.sequence = new Array();
            setTimeout(function(){

                //loop to add selection events to levelcomplete event
                for(var i = 0; i < lynHistory.eventList.length; i++){
                    //go through each event, if it is of type "selection"
                    if(lynHistory.eventList[i].eventType == "selection"){
                        masteredEvent.sequence.push(lynHistory.eventList[i]);
                        //$scope.eventList = $scope.eventList.splice(i, 1);
                    }
                }

                //removing selection events from the top level array
                for(var i = 0; i < lynHistory.eventList.length; i++){
                    if(lynHistory.eventList[i].eventType == "selection"){
                        lynHistory.eventList.splice(i, 1);
                        i--;
                    }
                }

                //this will incorrectly log ones where the feedback message pops up and the user goes back to selection
                lynHistory.eventList.push(masteredEvent);
                lynHistory.currentSequence = masteredEvent;

                //how many total
                //how many good
                lynHistory.total_sequence = lynHistory.currentSequence.sequence.length;
                lynHistory.missed_opportunities = 0;
                for(var i = 0; i < lynHistory.currentSequence.sequence.length; i++){
                    if(lynHistory.currentSequence.sequence[i].mastered == true){
                        lynHistory.missed_opportunities++;
                    }
                }
                lynHistory.stars = Math.round((100 - 100*(lynHistory.missed_opportunities/lynHistory.total_sequence))/20);
                Stars.add_stars(lynHistory.stars);
            }, 500);
        });

        $scope.$on('achievement_earned', function(event, data){
            $scope.achievement_earned = data.achievement_id;
            console.log(data);
            console.log($scope.achievement_earned);
        })
    }
])



'use strict';

angular.module('core').controller('UserInfoController', ['$scope', 'Authentication', 'Menus', '$rootScope', 'Stars',
    function($scope, Authentication, Menus, $rootScope, Stars) {
        $scope.authentication = Authentication;

        console.log(Authentication);

        $scope.displayName = Authentication.user.displayName;
        $scope.selectionLevel = Authentication.user.selectionLevel;
        $scope.completionLevel = Authentication.user.completionLevel;
        $scope.currentSequence;
        $scope.currentStreak = 0; //if this = 10, hot streak challenge is complete
        $scope.totalgood = 0; //if totalgood / totalall > .9 and totalall >= 10, then "I ain't scared" challenge is complete
        $scope.totalall = 0;
        $scope.percentgood = 0;
        $scope.stars_earned = Stars.stars;

        $scope.session_total_unmastered = 0;
        //elemental sampler is triggered off of individual levels selected

        $scope.achievement_earned = 0;

        //keep a list of events
        $scope.eventList = new Array();
        //selection event
        //  eventType = "selection"
        //  level
        //  mastered
        //  % completed?
        //  time
        //level completion event
        //  eventType = "levelcomplete"
        //  level
        //  time
        //achievement event?


        $scope.$on('levelselect', function(event, data){
            console.log('UserInfoController received levelselect');
            //console.log(data.level);
            //console.log(data.mastered);

            var selectionEvent = new Object();
            //selection event
            //  eventType = "selection"
            //  level
            //  mastered
            //  % completed?
            //  time
            selectionEvent.eventType = "selection";
            selectionEvent.level = data.level;
            selectionEvent.mastered = data.mastered;
            selectionEvent.timestamp = new Date().getTime();

            if(data.mastered == false){
                $scope.currentStreak++;
                $rootScope.$broadcast("selectionStreak", {streak: $scope.currentStreak});
                console.log("currentStreak");
                console.log($scope.currentStreak);
                $scope.totalgood++;
                $scope.session_total_unmastered++;
                $rootScope.$broadcast("total_unmastered", {number: $scope.session_total_unmastered});
            }
            else{
                $scope.currentStreak = 0;
            }
            $scope.totalall++;
            $scope.percentgood = Math.round(($scope.totalgood / ($scope.totalall))*100);

            $scope.eventList.push(selectionEvent);
            console.log($scope.eventList);

            //if($scope.totalall >= 10 && $scope.percentgood >= 90){
            //    $rootScope.$broadcast('aint_scared_complete', {});
            //}
            if($scope.totalall >= 5){
                $rootScope.$broadcast('aint_scared_complete', {});
            }
            if($scope.currentStreak >= 10){
                $rootScope.$broadcast('hot_streak_complete', {});
            }

            //save back to DB?
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
                for(var i = 0; i < $scope.eventList.length; i++){
                    //go through each event, if it is of type "selection"
                    if($scope.eventList[i].eventType == "selection"){
                        masteredEvent.sequence.push($scope.eventList[i]);
                        //$scope.eventList = $scope.eventList.splice(i, 1);
                    }
                }

                //removing selection events from the top level array
                for(var i = 0; i < $scope.eventList.length; i++){
                    if($scope.eventList[i].eventType == "selection"){
                        $scope.eventList.splice(i, 1);
                        i--;
                    }
                }

                //this will incorrectly log ones where the feedback message pops up and the user goes back to selection

                $scope.eventList.push(masteredEvent);
                $scope.currentSequence = masteredEvent;
                //how many total
                //how many good
                console.log("current sequence");
                console.log($scope.currentSequence);
                $scope.total_sequence = $scope.currentSequence.sequence.length;
                $scope.missed_opportunities = 0;
                for(var i = 0; i < $scope.currentSequence.sequence.length; i++){
                    if($scope.currentSequence.sequence[i].mastered == true){
                        $scope.missed_opportunities++;
                    }
                }
                $scope.stars = Math.round((100 - 100*($scope.missed_opportunities/$scope.total_sequence))/20);
                console.log("stars = "+$scope.stars);

                $scope.$broadcast('stars_added', {stars: $scope.stars});

                console.log($scope.eventList);
            }, 500);
        });

        $scope.$on('stars_added', function(event, data){
            console.log('received stars_added');
            $scope.stars_earned = $scope.stars_earned + data.stars;
            $scope.$digest();
        })

        $scope.$on('achievement_earned', function(event, data){
            $scope.achievement_earned = data.achievement_id;
            console.log(data);
            console.log($scope.achievement_earned);
            //$scope.$digest();
        })
    }
])
    .directive('problemHistory', function(){
        return {
            templateUrl: 'problemHistory.html'
        }
    });
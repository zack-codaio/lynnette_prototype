'use strict';

angular.module('core').controller('UserInfoController', ['$scope', 'Authentication', 'Menus', '$rootScope',
    function($scope, Authentication, Menus, $rootScope) {
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
        //elemental sampler is triggered off of individual levels selected




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
            }
            else{
                $scope.currentStreak = 0;
            }
            $scope.totalall++;
            $scope.percentgood = Math.round(($scope.totalgood / ($scope.totalall))*100);

            $scope.eventList.push(selectionEvent);
            console.log($scope.eventList);

            if($scope.totalall >= 10 && $scope.percentgood >= 90){
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

                $scope.eventList.push(masteredEvent);
                $scope.currentSequence = masteredEvent;
                console.log($scope.eventList);
            }, 500);
        });
    }
]);
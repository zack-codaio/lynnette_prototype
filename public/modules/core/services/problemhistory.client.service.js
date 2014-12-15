'use strict';

/**
 * Created by zackaman on 12/14/14.
 */


angular.module('core').service('lynHistory', ['$rootScope', function($rootScope){
    var history = new Object();
    history.currentSequence;
    history.currentStreak = 0;
    history.totalgood = 0;
    history.totalall = 0;
    history.percentgood = 0;
    history.session_total_unmastered = 0;
    history.problem_selection_message = false;
    //missed opportunities
    history.missed_opportunities = 0;
    //stars
    history.stars = 0;
    history.total_sequence = 0;

    //keep a list of events
    history.eventList = new Array();
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

    history.inc_streak = function(a){
        if(a !== -1){
            history.currentStreak += a;
            history.totalgood++;
            history.session_total_unmastered++;

            if(history.totalall == 5){
                $rootScope.$broadcast('aint_scared_complete', {});
            }
            if(history.currentStreak == 10){
                $rootScope.$broadcast('hot_streak_complete', {});
            }
            //save back to DB?
        }
        else{
            history.currentStreak = 0;
        }

        $rootScope.$broadcast("selectionStreak", {streak: history.currentStreak});
        $rootScope.$broadcast("total_unmastered", {number: history.session_total_unmastered});
    }





    return history;


    //var serviceInstance = new Object();
    //serviceInstance.stars = 3;
    //serviceInstance.add_stars = function(a){
    //    serviceInstance.stars += a;
    //    console.log("ADDING STARS: now "+serviceInstance.stars);
    //    //$scope.$digest();
    //};
    //
    //return serviceInstance;
}]);
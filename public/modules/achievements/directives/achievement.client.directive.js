/**
 * Created by zackaman on 12/15/14.
 */

'use strict';

angular.module('achievements').directive('achievementPopover',  function(){
    return {
        restrict: "E",
        templateUrl: '/modules/achievements/directives/achievement.html'
    }
});
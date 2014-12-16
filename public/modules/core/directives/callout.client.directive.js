///**
// * Created by zackaman on 12/15/14.
// */

'use strict';

angular.module('core').directive('callOutChallenges',  function(){
    return {
        restrict: "E",
        templateUrl: '/modules/core/directives/callout_challenges.client.template.html',
        scope:{
            xcord: 800,
            ycord: 200,
            width: 300,
            height: 300,
            myStyle: "test test"
        }
    }
});

angular.module('core').directive('callOutAvatar',  function(){
    var directive = {};
    directive.restrict = "E";
    directive.templateUrl = '/modules/core/directives/callout_avatar.client.template.html';
    directive.scope = {
        xcord: 800,
        ycord: 200,
        width: 300,
        height: 300,
        myStyle: "test test"
    };
    directive.require = "ngController";

    //directive.compile = function(element, attributes){
    //
    //    var linkFunction = function($scope, element, attributes){
    //
    //    }
    //    return linkFunction;
    //}

    directive.link = function($scope, element, attributes){
        //element.css("background-color", "#ff0000"):
    }

    return directive;
});
/**
 * Created by zackaman on 12/15/14.
 */

'use strict';

angular.module('core').directive('suggestedModal',  function(){
    return {
        restrict: "E",
        templateUrl: '/modules/core/directives/modal.client.template.html'
    }
});
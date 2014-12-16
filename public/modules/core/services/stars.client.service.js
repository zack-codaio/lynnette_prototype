'use strict';

/**
 * Created by zackaman on 12/14/14.
 */


angular.module('core').service('Stars', function(){
    var serviceInstance = new Object();
        serviceInstance.stars = 0;
    serviceInstance.add_stars = function(a){
        serviceInstance.stars += a;
        console.log("ADDING STARS: now "+serviceInstance.stars);
        //$scope.$digest();
    };

    return serviceInstance;
});
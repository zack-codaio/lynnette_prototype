/**
 * Created by zackaman on 12/16/14.
 */


angular.module('core').service('Challenges',['$rootScope', 'Stars', function($rootScope, Stars){
    var serviceInstance = new Object();

    serviceInstance.redemption = false;
    serviceInstance.wise_words = false;
    serviceInstance.second_thoughts = false;

    //when earning a star back
    $rootScope.$on('star_earned', function(){
        if(serviceInstance.redemption == false){
            Stars.add_stars(1);
            serviceInstance.redemption = true;
        }
    });

    //when reconsidering level selection
    $rootScope.$on('second_thoughts', function(){
        if(serviceInstance.second_thoughts == false){
            Stars.add_stars(1);
            serviceInstance.second_thoughts = true;
        }
    });

    //when picking suggested level
    $rootScope.$on('wise_words', function(){
        if(serviceInstance.wise_words == false){
            Stars.add_stars(1);
            serviceInstance.wise_words = true;
        }
    });



    return serviceInstance;
}]);
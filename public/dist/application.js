'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('achievements');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('kcomponents');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('levels');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('achievements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Achievements', 'achievements', 'dropdown', '/achievements(/create)?');
		Menus.addSubMenuItem('topbar', 'achievements', 'List Achievements', 'achievements');
		Menus.addSubMenuItem('topbar', 'achievements', 'New Achievement', 'achievements/create');
	}
]);
'use strict';

//Setting up route
angular.module('achievements').config(['$stateProvider',
	function($stateProvider) {
		// Achievements state routing
		$stateProvider.
		state('listAchievements', {
			url: '/achievements',
			templateUrl: 'modules/achievements/views/list-achievements.client.view.html'
		}).
		state('createAchievement', {
			url: '/achievements/create',
			templateUrl: 'modules/achievements/views/create-achievement.client.view.html'
		}).
		state('viewAchievement', {
			url: '/achievements/:achievementId',
			templateUrl: 'modules/achievements/views/view-achievement.client.view.html'
		}).
		state('editAchievement', {
			url: '/achievements/:achievementId/edit',
			templateUrl: 'modules/achievements/views/edit-achievement.client.view.html'
		});
	}
]);
'use strict';

// Achievements controller
angular.module('achievements').controller('AchievementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Achievements', '$rootScope',
	function($scope, $stateParams, $location, Authentication, Achievements, $rootScope ) {
		$scope.authentication = Authentication;

		// Create new Achievement
		$scope.create = function() {
			// Create new Achievement object
			var achievement = new Achievements ({
				name: this.name,
                description: this.description
			});

			// Redirect after save
			achievement.$save(function(response) {
				$location.path('achievements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Achievement
		$scope.remove = function( achievement ) {
			if ( achievement ) { achievement.$remove();

				for (var i in $scope.achievements ) {
					if ($scope.achievements [i] === achievement ) {
						$scope.achievements.splice(i, 1);
					}
				}
			} else {
				$scope.achievement.$remove(function() {
					$location.path('achievements');
				});
			}
		};

		// Update existing Achievement
		$scope.update = function() {
			var achievement = $scope.achievement ;

			achievement.$update(function() {
				$location.path('achievements/' + achievement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Achievements
		$scope.find = function() {
			$scope.achievements = Achievements.query();
		};

		// Find existing Achievement
		$scope.findOne = function() {
			$scope.achievement = Achievements.get({ 
				achievementId: $stateParams.achievementId
			});
		};

        var achievements = new Object();
        achievements.a1 = false;
        achievements.a2 = false;
        achievements.a3 = false;
        achievements.a4 = false;

		var audio = new Audio('/modules/achievements/img/bell.wav');
		//from http://www.freesound.org/people/Zabuhailo/sounds/178645/

        $scope.achievement = new Object();
        $scope.achievement.title = "Run, Don't Walk";
        $scope.achievement.description = "Select three unmastered problems in a row.";
        $scope.achievement.icon = "run_dont_walk";

        $scope.make_visible = false;
        $scope.$on("selectionStreak", function(event, data){
           if(data.streak == 3 && $scope.make_visible == false && achievements.a1 == false){


			   audio.play();

               $scope.make_visible = true;
               achievements.a1 = true;

               $scope.achievement.title = "Run, Don't Walk";
               $scope.achievement.description = "Select three unmastered problems in a row.";
               $scope.achievement.icon = "run_dont_walk";

               $rootScope.$broadcast('achievement_earned', {achievement_id: 1});

               setTimeout(function(){
                   $scope.make_visible = false;
                   $scope.$digest();
               }, 5500);
           }
        });
        $scope.$on("total_unmastered", function(event, data){
            if(data.number == 10 && $scope.make_visible == false && achievements.a2 == false){
				audio.play();
                $scope.make_visible = true;
                achievements.a2 = true;

                $scope.achievement.title = "Mountain Climber";
                $scope.achievement.description = "Complete 10 unmastered problems.";
                $scope.achievement.icon = "mountain_climber";

                $rootScope.$broadcast('achievement_earned', {achievement_id: 2});

                setTimeout(function(){
                    $scope.make_visible = false;
                    $scope.$digest();
                }, 5500);
            }
        });
	}
]);
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
'use strict';

//Achievements service used to communicate Achievements REST endpoints
angular.module('achievements').factory('Achievements', ['$resource',
	function($resource) {
		return $resource('achievements/:achievementId', { achievementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
        try{Typekit.load();}catch(e){}
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
/**
 * Created by zackaman on 12/14/14.
 */

'use strict';

angular.module('core').controller('SequenceController', ['$scope', '$rootScope', 'Stars', 'lynHistory',
    function($scope, $rootScope, Stars, lynHistory) {

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
        $scope.explanatory_feedback = function(index){
            console.log("explanatory feedback for "+index);
            console.log($scope.currentSequence.sequence);
            if($scope.currentSequence.sequence[index].mastered == true){
                $scope.greentext = false;
                $scope.the_feedback = $scope.currentSequence.sequence[index].levelname+" was already mastered, so it did not have any additional opportunities for mastery."

            }

            else if($scope.currentSequence.sequence[index].mastered == false){
                $scope.greentext = true;
                $scope.the_feedback = "Correct! "+ $scope.currentSequence.sequence[index].levelname+" was unmastered and so had opportunities for mastery.  Picking "+$scope.currentSequence.sequence[index].levelname+" was a good choice."
            }

            $scope.show_feedback = true;
        }


        $scope.$on('history_done', function(event, data){
           $scope.show_feedback = false;
        });

    }
]);

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
                lynHistory.inc_streak(-1);
            }
            lynHistory.totalall++;
            lynHistory.percentgood = Math.round((lynHistory.totalgood / (lynHistory.totalall))*100);

            lynHistory.eventList.push(selectionEvent);

            console.log("lynHistory");
            console.log(lynHistory);
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



'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

/**
 * Created by zackaman on 12/14/14.
 */
angular.module('core').directive('problemHistory',  function(){
    return {
        restrict: "E",
        templateUrl: '/modules/core/directives/problemHistory.html'
    }
});
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
'use strict';

/**
 * Created by zackaman on 12/14/14.
 */


angular.module('core').service('Stars', function(){
    var serviceInstance = new Object();
        serviceInstance.stars = 3;
    serviceInstance.add_stars = function(a){
        serviceInstance.stars += a;
        console.log("ADDING STARS: now "+serviceInstance.stars);
        //$scope.$digest();
    };

    return serviceInstance;
});
'use strict';

// Configuring the Articles module
angular.module('kcomponents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Kcomponents', 'kcomponents', 'dropdown', '/kcomponents(/create)?');
		Menus.addSubMenuItem('topbar', 'kcomponents', 'List Kcomponents', 'kcomponents');
		Menus.addSubMenuItem('topbar', 'kcomponents', 'New Kcomponent', 'kcomponents/create');
	}
]);
'use strict';

//Setting up route
angular.module('kcomponents').config(['$stateProvider',
	function($stateProvider) {
		// Kcomponents state routing
		$stateProvider.
		state('listKcomponents', {
			url: '/kcomponents',
			templateUrl: 'modules/kcomponents/views/list-kcomponents.client.view.html'
		}).
		state('createKcomponent', {
			url: '/kcomponents/create',
			templateUrl: 'modules/kcomponents/views/create-kcomponent.client.view.html'
		}).
		state('viewKcomponent', {
			url: '/kcomponents/:kcomponentId',
			templateUrl: 'modules/kcomponents/views/view-kcomponent.client.view.html'
		}).
		state('editKcomponent', {
			url: '/kcomponents/:kcomponentId/edit',
			templateUrl: 'modules/kcomponents/views/edit-kcomponent.client.view.html'
		});
	}
]);
'use strict';

// Kcomponents controller
angular.module('kcomponents').controller('KcomponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Kcomponents', '$rootScope',
    function ($scope, $stateParams, $location, Authentication, Kcomponents, $rootScope) {
        $scope.authentication = Authentication;

        // Create new Kcomponent
        $scope.create = function () {
            // Create new Kcomponent object
            var kcomponent = new Kcomponents({
                name: this.name
            });

            // Redirect after save
            kcomponent.$save(function (response) {
                $location.path('kcomponents/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Kcomponent
        $scope.remove = function (kcomponent) {
            if (kcomponent) {
                kcomponent.$remove();

                for (var i in $scope.kcomponents) {
                    if ($scope.kcomponents [i] === kcomponent) {
                        $scope.kcomponents.splice(i, 1);
                    }
                }
            } else {
                $scope.kcomponent.$remove(function () {
                    $location.path('kcomponents');
                });
            }
        };

        // Update existing Kcomponent
        $scope.update = function () {
            var kcomponent = $scope.kcomponent;


            kcomponent.$update(function () {
                $location.path('kcomponents/' + kcomponent._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Update existing Kcomponent within scope
        $scope.updateWithin = function (howmuch) {
            //var kcomponent = $scope.updateKC ;
            console.log(kcomponent);
            //$scope.findOneArg($scope.updateKC._id);

            var kcomponent = new Kcomponents(
                $scope.updateKC
            );
            //kcomponent.percentComplete = Math.round(kcomponent.percentComplete + getRandomArbitrary(0, 25));
            //kcomponent.percentComplete = kcomponent.percentComplete + 10;
            if (howmuch == 1) {
                kcomponent.percentComplete = kcomponent.percentComplete + 0;
            }
            else if (howmuch == 2) {
                kcomponent.percentComplete = kcomponent.percentComplete + 7;
            }
            else if (howmuch == 3) {
                kcomponent.percentComplete = kcomponent.percentComplete + 24;
            }
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            if (kcomponent.percentComplete >= 100) {
                kcomponent.percentComplete = 100;
                kcomponent.mastered = true;
            }

            kcomponent.$update(function () {
                //$location.path('kcomponents/' + $scope.updateKC._id);

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Kcomponents
        $scope.find = function () {
            $scope.kcomponents = Kcomponents.query();
            console.log($scope.kcomponents);
        };

        // Find existing Kcomponent
        $scope.findOne = function () {
            $scope.kcomponent = Kcomponents.get({
                kcomponentId: $stateParams.kcomponentId

            });
            console.log($stateParams.kcomponentId);
        };

        // Find existing Kcomponent
        $scope.findOneArg = function (id) {
            $scope.updateKC = Kcomponents.get({
                kcomponentId: id
            });
            console.log($scope.updateKC);
        };

        $scope.$on('KCbroadcast', function (event, args) {
            console.log("received KCbroadcast:");
            console.log(args);
            for (var i = 0; i < args.kcs.length; i++) {
                var kcomponent = args.kcs[i];

                $scope.updateKC = kcomponent;
                $scope.updateWithin(args.difficulty);
            }

            //$scope.$apply();
            //instead of apply, emit back to the other controller so it knows to $apply
            $scope.$emit('KCupdated', {});
        });

        $scope.reset_kcs = function () {
            console.log('resetting kcs');
            //for all kcs
            console.log($scope);
            for (var i = 0; i < $scope.kcomponents.length; i++) {
                //set all mastered to false
                //set all percentCompletes to 0
                $scope.kcomponents[i].mastered = false;
                $scope.kcomponents[i].percentComplete = 0;
                //console.log($scope.kcomponents[i]);
                $scope.kcomponents[i].$update(function (response) {
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        }

        $scope.scenario2 = function () {
            console.log('scenario 2');

            for (var i = 0; i < $scope.kcomponents.length; i++) {
                if (i >= 0 && i < 3) { //level 1
                    $scope.kcomponents[i].percentComplete = 25;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 3 && i < 6){ //level 2
                    $scope.kcomponents[i].percentComplete = 25;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 6 && i < 9){ //level 3
                    $scope.kcomponents[i].percentComplete = 40;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 9 && i < 12){ //level 4
                    $scope.kcomponents[i].percentComplete = 40;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 12 && i < 15){ //level 5
                    $scope.kcomponents[i].percentComplete = 80;
                    $scope.kcomponents[i].mastered = false;
                }
                if(i >= 15 && i < 18){ // level 6
                    $scope.kcomponents[i].percentComplete = 100;
                    $scope.kcomponents[i].mastered = true;
                }
                $scope.kcomponents[i].$update(function (response) {
                    $location.path('/');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        }

    }
]);
'use strict';

//Kcomponents service used to communicate Kcomponents REST endpoints
angular.module('kcomponents').factory('Kcomponents', ['$resource',
	function($resource) {
		return $resource('kcomponents/:kcomponentId', { kcomponentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('levels').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Levels', 'levels', 'dropdown', '/levels(/create)?');
		Menus.addSubMenuItem('topbar', 'levels', 'List Levels', 'levels');
		Menus.addSubMenuItem('topbar', 'levels', 'New Level', 'levels/create');
	}
]);
'use strict';

//Setting up route
angular.module('levels').config(['$stateProvider',
	function($stateProvider) {
		// Levels state routing
		$stateProvider.
		state('listLevels', {
			url: '/levels',
			templateUrl: 'modules/levels/views/list-levels.client.view.html'
		}).
		state('createLevel', {
			url: '/levels/create',
			templateUrl: 'modules/levels/views/create-level.client.view.html'
		}).
		state('viewLevel', {
			url: '/levels/:levelId',
			templateUrl: 'modules/levels/views/view-level.client.view.html'
		}).
		state('editLevel', {
			url: '/levels/:levelId/edit',
			templateUrl: 'modules/levels/views/edit-level.client.view.html'
		});
	}
]);
'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels', '$rootScope', 'Stars', 'lynHistory',
    function ($scope, $stateParams, $location, Authentication, Levels, $rootScope, Stars, lynHistory) {
        $scope.authentication = Authentication;

        $scope.masteredLevel;
        $scope.difficulty_sequence = "32122232";

        // Create new Level
        $scope.create = function () {
            // Create new Level object
            var level = new Levels({
                name: this.name,
                leveltype: this.leveltype,
                icon: this.icon,
                example1: this.example1,
                example2: this.example2
            });

            // Redirect after save
            level.$save(function (response) {
                $location.path('levels/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Level
        $scope.remove = function (level) {
            if (level) {
                level.$remove();

                for (var i in $scope.levels) {
                    if ($scope.levels [i] === level) {
                        $scope.levels.splice(i, 1);
                    }
                }
            } else {
                $scope.level.$remove(function () {
                    $location.path('levels');
                });
            }
        };

        // Update existing Level
        $scope.update = function () {
            //parse kcomponents into an array

            //set $scope.level.kcomponenets equal to the array
            if ($scope.level.kcomponentList.length > 3) {
                var res = $scope.level.kcomponentList.split(" ");
                //console.log(res);

                var level = $scope.level;
                level.kcomponents = res;
                delete level.kcomponentList;
            }

            level.$update(function () {
                $location.path('levels/' + level._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Levels
        $scope.find = function () {
            $scope.levels = Levels.query();
            $scope.levels.$promise.then(function (result) {

                //look for mismatch of mastered and kcs
                console.log($scope.levels);
                for (var i = 0; i < $scope.levels.length; i++) {
                    //check level mastered

                    var curlevel = $scope.levels[i];
                    //console.log("scope mastered " + curlevel.mastered);
                    var levelmastered = result[i].mastered;
                    //console.log("levelmastered "+i+" "+levelmastered);

                    //check kc mastered for each kc
                    var kcmastered = true;
                    $scope.levels[i].progress = 100;
                    for (var j = 0; j < $scope.levels[i].kcomponents.length; j++) {
                        if ($scope.levels[i].kcomponents[j].mastered == false) {
                            kcmastered = false;
                        }
                        if ($scope.levels[i].progress > $scope.levels[i].kcomponents[j].percentComplete) {
                            $scope.levels[i].progress = $scope.levels[i].kcomponents[j].percentComplete;
                        }
                    }
                    //if all kc's mastered and level mastered is false

                    if (levelmastered == false && kcmastered == true) {
                        //update level mastered
                        $scope.levels[i].mastered = true;
                        //update to DB
                        for (var k = 0; k < $scope.levels[i].kcomponents.length; k++) {
                            $scope.levels[i].kcomponents[k] = $scope.levels[i].kcomponents[k]._id;
                        }
                        $scope.levels[i].user = $scope.levels[i].user._id;

                        $scope.levels[i]
                            .$update(function () {
                                $scope.find();
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                                console.log($scope.error);
                            });
                        //trigger level complete popup
                        console.log("broadcasting levelmastered");
                        $rootScope.$broadcast("levelmastered", {levelid: i});
                        console.log("levelmastered " + i);
                    }
                    else if (kcmastered == false && levelmastered == true) {
                        $scope.levels[i].mastered = false;

                        //update to DB
                        for (var k = 0; k < $scope.levels[i].kcomponents.length; k++) {
                            $scope.levels[i].kcomponents[k] = $scope.levels[i].kcomponents[k]._id;
                        }
                        $scope.levels[i].user = $scope.levels[i].user._id;

                        $scope.levels[i]
                            .$update(function () {
                                $scope.find();
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                            });
                    }

                }
            });
        };

        // Find existing Level
        $scope.findOne = function () {
            $scope.level = Levels.get({
                levelId: $stateParams.levelId
            }, function () {
                $scope.level.kcomponentList = "";
                console.log($scope.level);
                for (var i = 0; i < $scope.level.kcomponents.length; i++) {
                    $scope.level.kcomponentList = $scope.level.kcomponentList + $scope.level.kcomponents[i] + " ";
                }
                $scope.level.kcomponentList = $scope.level.kcomponentList.substr(0, $scope.level.kcomponentList.length - 1);
            });
        };

        // Find existing Level
        $scope.findOneID = function (levelId) {
            $scope.level = Levels.get({
                levelId: levelId
            }, function () {
                $scope.level.kcomponentList = "";
                console.log($scope.level);
                $scope.level.progress = 100;
                for (var i = 0; i < $scope.level.kcomponents.length; i++) {
                    $scope.level.kcomponentList = $scope.level.kcomponentList + $scope.level.kcomponents[i] + " ";
                    if ($scope.level.progress > $scope.level.kcomponents[i].percentComplete) {
                        $scope.level.progress = $scope.level.kcomponents[i].percentComplete;
                    }

                }
                $scope.level.kcomponentList = $scope.level.kcomponentList.substr(0, $scope.level.kcomponentList.length - 1);

            });
        };

        //on level complete
        $scope.complete_level = function () {
            console.log("level completed");
            $scope.level_complete_message = true;
        }

        $scope.level_complete_next = function () {
            console.log("level complete next");
            $scope.level_complete_message = false;
            $scope.problem_selection_rating();
        }
        $scope.problem_selection_rating = function () {
            console.log("problem selection rating show");
            $scope.problem_selection_message = true;
        }
        $scope.problem_selection_next = function () {
            console.log("problem selection next");
            $rootScope.$broadcast('history_done', {});

            $scope.problem_selection_message = false;
            $scope.suggested_level_message = true;
        }
        $scope.suggested_level_next = function () {
            $scope.suggested_level_message = false;

        }


        //on bad level selection
        $scope.bad_selection_click = function () {
            console.log("bad selection");
            $scope.bad_selection = true;
        }
        $scope.$on('alreadymastered', function () {
            console.log("bad selection");
            $scope.bad_selection = true;
        });

        $scope.bad_selection_next = function (a) {
            $scope.bad_selection = false;
            if (a == 1) {
                $scope.problem_screen = false;
            }
        }


        //on good level selection
        $scope.positive_feedback_click = function () {
            $scope.positive_feedback = true;

        }
        $scope.positive_feedback_next = function () {
            $scope.positive_feedback = false;
        }


        $scope.daily_challenge_selected = 1;
        $scope.daily_challenge_new = $scope.daily_challenge_selected;
        $scope.select1 = true;
        $scope.challenge_name = "I Ain't Scared";
        //daily challenge
        $scope.daily_challenge_click = function () {
            $scope.daily_challenge = true;
        }
        $scope.prospective_challenge = function (a) {
            $scope.daily_challenge_new = a;

            if (a == 1) {
                $scope.select1 = true;
                $scope.select2 = false;
                $scope.select3 = false;
                $scope.challenge_name = "I Ain't Scared";
            }
            if (a == 2) {
                $scope.select1 = false;
                $scope.select2 = true;
                $scope.select3 = false;
                $scope.challenge_name = "Elemental Sampler";
            }
            if (a == 3) {
                $scope.select1 = false;
                $scope.select2 = false;
                $scope.select3 = true;
                $scope.challenge_name = "Hot Streak";
            }
        }
        $scope.daily_challenge_next = function () {
            $scope.daily_challenge = false;
            $scope.daily_challenge_selected = $scope.daily_challenge_new;
        }

        $scope.$on('KCupdated', function () {
            console.log("received KCupdated");

            //hacky but it works?
            setTimeout(function () {
                $scope.find();
            }, 500);
        });

        $scope.select_level = function (levelindex) {
            console.log("select_level(" + levelindex + ")");
            //check if mastered
            var mastered = true;
            for (var i = 0; i < $scope.levels[levelindex].kcomponents.length; i++) {
                if ($scope.levels[levelindex].kcomponents[i].mastered == false) {
                    mastered = false;
                }
            }
            if (mastered == true) {
                console.log('already mastered');
                $scope.$broadcast('alreadymastered', {});
                $rootScope.$broadcast('levelselect', {level: levelindex, mastered: true, levelname: $scope.levels[levelindex].leveltype});
            }
            else if (mastered == false) {
                //$rootScope.$broadcast('KCbroadcast', {kcs: $scope.levels[levelindex].kcomponents});
                $rootScope.$broadcast('levelselect', {level: levelindex, mastered: false, levelname: $scope.levels[levelindex].leveltype});
            }
        }

        $scope.$on('levelmastered', function (event, data) {
            console.log('LevelsClientController received levelmastered');
            console.log('levelid = ' + data.levelid);

            $scope.level_complete_message = true;

            $scope.masteredLevel = $scope.levels[data.levelid];
            console.log($scope.masteredLevel);
        });

        $scope.problem_screen = false;
        $scope.hint_visible = false;
        $scope.problem = new Object();
        $scope.$on('levelselect', function (data, args) {
            $scope.selectedLevel = $scope.levels[args.level];
            $scope.problem_screen = true;

            var sequence = $scope.levels[args.level].sequence.toString();
            console.log(sequence);

            var difficulty = parseInt(sequence.slice(0, 1));
            $scope.levels[args.level].sequence = $scope.levels[args.level].sequence.slice(1) + difficulty;
            console.log($scope.levels[args.level]);
            //depopulate_level($scope.levels[args.level]).$update();
            //console.log($scope.levels[args.level].sequence);


            var difficulty = parseInt($scope.difficulty_sequence.slice(0, 1));
            $scope.difficulty_sequence = $scope.difficulty_sequence.slice(1) + difficulty;
            if (difficulty > 3 || difficulty < 1) {
                difficulty = 2;
            }
            console.log("difficulty = " + difficulty);


            $scope.problem.difficulty = difficulty;
            $scope.levelindex = args.level;
            $scope.hint_visible = false;
        });

        $scope.problem_complete = function (difficulty, levelindex, status) {
            if (status == 1) { //proper return
                console.log('problem complete');
                console.log(difficulty +" "+levelindex+" "+status);
                $scope.problem_screen = false;
                $rootScope.$broadcast('levelcomplete', {difficulty: difficulty, level: levelindex});
                console.log('$scope.levels: ');
                console.log($scope.levels);

                $rootScope.$broadcast('KCbroadcast', {
                    kcs: $scope.levels[levelindex].kcomponents,
                    difficulty: difficulty
                });
                console.log("broadcasted KCbroadcast");
            }
            else if (status == -1) { //back to selection
                console.log('problem complete received '+ status+' , back to selection');
                $scope.problem_screen = false;
            }
        }
        $scope.hint_click = function () {
            $scope.hint_visible = true;
        }

        $scope.aint_scared_complete = false;
        $scope.$on('aint_scared_complete', function (event, data) {
            console.log("received aint scared complete");
            $scope.aint_scared_complete = true;
            Stars.add_stars(2);
        });

        $scope.hot_streak_complete = false;
        $scope.$on('hot_streak_complete', function (event, data) {
            console.log("received hot streak complete");
            $scope.hot_streak_complete = true;
            //Stars.add_stars(2);
        });

        $scope.trophy_case_show = false;
        $scope.trophy_case_click = function (a) {
            if (a == 1) {
                $scope.trophy_case_show = true;
            }
            else {
                $scope.trophy_case_show = false;
            }
        }
    }
]).directive('myKc', function () {
    console.log();

    //return{
    //    restrict: 'E',
    //    scope: {
    //        id: '=info'
    //    },
    //    template: 'ID: {{id}}'
    //};
});
'use strict';

//Levels service used to communicate Levels REST endpoints
angular.module('levels').factory('Levels', ['$resource',
	function($resource) {
		return $resource('levels/:levelId', { levelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;
        //$scope.displayName = "test";
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
/**
 * Created by zackaman on 12/2/14.
 */
'use strict';

angular.module('users').controller('TestController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        //$scope.displayName = "test";
        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.displayName = "test";

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
'use strict';

angular.module('users').controller('UserInfoController2', ['$scope', 'Authentication', '$rootScope',
    function($scope, Authentication, $rootScope) {
        $scope.authentication = Authentication;

        console.log(Authentication);

        $scope.displayName = Authentication.user.displayName;
        $scope.selectionLevel = Authentication.user.selectionLevel;
        $scope.completionLevel = Authentication.user.completionLevel;

        //$scope.displayName = "test name";

        $scope.$on('levelselect', function(event, data){
            console.log('UserInfoController received levelselect');
            console.log(data.level);
            console.log(data.mastered);
        });
    }
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
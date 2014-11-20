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
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
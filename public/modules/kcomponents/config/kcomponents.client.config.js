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
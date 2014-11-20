'use strict';

(function() {
	// Achievements Controller Spec
	describe('Achievements Controller Tests', function() {
		// Initialize global variables
		var AchievementsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Achievements controller.
			AchievementsController = $controller('AchievementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Achievement object fetched from XHR', inject(function(Achievements) {
			// Create sample Achievement using the Achievements service
			var sampleAchievement = new Achievements({
				name: 'New Achievement'
			});

			// Create a sample Achievements array that includes the new Achievement
			var sampleAchievements = [sampleAchievement];

			// Set GET response
			$httpBackend.expectGET('achievements').respond(sampleAchievements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.achievements).toEqualData(sampleAchievements);
		}));

		it('$scope.findOne() should create an array with one Achievement object fetched from XHR using a achievementId URL parameter', inject(function(Achievements) {
			// Define a sample Achievement object
			var sampleAchievement = new Achievements({
				name: 'New Achievement'
			});

			// Set the URL parameter
			$stateParams.achievementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/achievements\/([0-9a-fA-F]{24})$/).respond(sampleAchievement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.achievement).toEqualData(sampleAchievement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Achievements) {
			// Create a sample Achievement object
			var sampleAchievementPostData = new Achievements({
				name: 'New Achievement'
			});

			// Create a sample Achievement response
			var sampleAchievementResponse = new Achievements({
				_id: '525cf20451979dea2c000001',
				name: 'New Achievement'
			});

			// Fixture mock form input values
			scope.name = 'New Achievement';

			// Set POST response
			$httpBackend.expectPOST('achievements', sampleAchievementPostData).respond(sampleAchievementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Achievement was created
			expect($location.path()).toBe('/achievements/' + sampleAchievementResponse._id);
		}));

		it('$scope.update() should update a valid Achievement', inject(function(Achievements) {
			// Define a sample Achievement put data
			var sampleAchievementPutData = new Achievements({
				_id: '525cf20451979dea2c000001',
				name: 'New Achievement'
			});

			// Mock Achievement in scope
			scope.achievement = sampleAchievementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/achievements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/achievements/' + sampleAchievementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid achievementId and remove the Achievement from the scope', inject(function(Achievements) {
			// Create new Achievement object
			var sampleAchievement = new Achievements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Achievements array and include the Achievement
			scope.achievements = [sampleAchievement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/achievements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAchievement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.achievements.length).toBe(0);
		}));
	});
}());
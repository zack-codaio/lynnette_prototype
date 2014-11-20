'use strict';

(function() {
	// Kcomponents Controller Spec
	describe('Kcomponents Controller Tests', function() {
		// Initialize global variables
		var KcomponentsController,
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

			// Initialize the Kcomponents controller.
			KcomponentsController = $controller('KcomponentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Kcomponent object fetched from XHR', inject(function(Kcomponents) {
			// Create sample Kcomponent using the Kcomponents service
			var sampleKcomponent = new Kcomponents({
				name: 'New Kcomponent'
			});

			// Create a sample Kcomponents array that includes the new Kcomponent
			var sampleKcomponents = [sampleKcomponent];

			// Set GET response
			$httpBackend.expectGET('kcomponents').respond(sampleKcomponents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.kcomponents).toEqualData(sampleKcomponents);
		}));

		it('$scope.findOne() should create an array with one Kcomponent object fetched from XHR using a kcomponentId URL parameter', inject(function(Kcomponents) {
			// Define a sample Kcomponent object
			var sampleKcomponent = new Kcomponents({
				name: 'New Kcomponent'
			});

			// Set the URL parameter
			$stateParams.kcomponentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/kcomponents\/([0-9a-fA-F]{24})$/).respond(sampleKcomponent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.kcomponent).toEqualData(sampleKcomponent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Kcomponents) {
			// Create a sample Kcomponent object
			var sampleKcomponentPostData = new Kcomponents({
				name: 'New Kcomponent'
			});

			// Create a sample Kcomponent response
			var sampleKcomponentResponse = new Kcomponents({
				_id: '525cf20451979dea2c000001',
				name: 'New Kcomponent'
			});

			// Fixture mock form input values
			scope.name = 'New Kcomponent';

			// Set POST response
			$httpBackend.expectPOST('kcomponents', sampleKcomponentPostData).respond(sampleKcomponentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Kcomponent was created
			expect($location.path()).toBe('/kcomponents/' + sampleKcomponentResponse._id);
		}));

		it('$scope.update() should update a valid Kcomponent', inject(function(Kcomponents) {
			// Define a sample Kcomponent put data
			var sampleKcomponentPutData = new Kcomponents({
				_id: '525cf20451979dea2c000001',
				name: 'New Kcomponent'
			});

			// Mock Kcomponent in scope
			scope.kcomponent = sampleKcomponentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/kcomponents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/kcomponents/' + sampleKcomponentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid kcomponentId and remove the Kcomponent from the scope', inject(function(Kcomponents) {
			// Create new Kcomponent object
			var sampleKcomponent = new Kcomponents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Kcomponents array and include the Kcomponent
			scope.kcomponents = [sampleKcomponent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/kcomponents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleKcomponent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.kcomponents.length).toBe(0);
		}));
	});
}());
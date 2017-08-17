angular.module('CurrencyApp').config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
}]);

angular.module('CurrencyApp').config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home/index.view.html',
			title: 'CurrencyApp | Amaro Corp',
			controller:  'HomeIndexController',
			authenticate: false
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
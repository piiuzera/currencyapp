angular.module('CurrencyApp')
	.run(['$rootScope',
		function($rootScope) {

	    $rootScope.$on('$routeChangeSuccess', function(next, current) {
	    	$rootScope.current = current;
	    });

}]);
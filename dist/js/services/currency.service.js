angular.module('CurrencyApp')
	.service('Currency', ['$http', 'Web',
		function($http, Web) {

		var _getCurrency = function(callback) {
			Web.Get(
				'/crawler/currency/',
				callback
			);
		};

		return {
			GetCurrency : _getCurrency
		};
}]);
angular.module('CurrencyApp')
	.controller('HomeIndexController', ['$scope', 'Currency', 'Util',
		function($scope, Currency, Util) {

			$scope.currencies 	= [];

			var _getCurrency = function() {
				Currency.GetCurrency(
					callbackCurrency
				);
			};

			var _getValueCurrency = function(_currency) {
				$scope.currency = _currency;
			};

			var callbackCurrency = function(body, status) {
				if (status > 399) {
					return;
				}

				$scope.currencies = body.currency;
			};

			var _init = function() {
				$scope.currencies = [];
				delete $scope.currency;
				
				$scope.GetCurrency();
			};

			$scope.GetCurrency 		= _getCurrency;
			$scope.GetValueCurrency = _getValueCurrency;
			$scope.Init 			= _init;
}]);
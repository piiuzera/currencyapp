angular.module('CurrencyApp')
	.service('Web', ['$http',
		function($http) {
			var _requestDefault = function(callback, response) {
				callback(response.data, response.status);
			};

			var _get = function(url, callback) {
				$http.get(url).then(
					_requestDefault.bind(this, callback),
					_requestDefault.bind(this, callback)
				);
			};

			var _post = function(url, form, callback) {
				$http.post(url, form).then(
					_requestDefault.bind(this, callback),
					_requestDefault.bind(this, callback)
				);
			};

			return {
				Get: _get,
				Post: _post
			};
}]);
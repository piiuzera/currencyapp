angular.module('CurrencyApp')
	.service('Util', [
		function() {
			var _notifyType = {
				Success: 'success',
				Error: 'error',
				Info: 'info',
				Warning: 'warning'
			};

			var _getButtonLoading = function(button) {
				$(button).button('loading');
			};

			var _getButtonReset = function() {
				$(document).find('[data-loading-text]').map(function(index) {
					var obj = $(this);
					if($(obj).attr('data-loading-text') === $(obj).text()) {
						$(obj).button('reset');
					}
				});
			};

			var _getModalShow = function(modalReference) {
				$(modalReference).modal('show');
			};

			var _getModalHide = function(modalReference) {
				$(modalReference).modal('hide');
			};

			var _getNotify = function(message, title, type) {
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 4000
                };
                toastr[type](message, title);
			};

			return {
				getButtonLoading: _getButtonLoading,
				GetButtonReset: _getButtonReset,
				GetModalHide: _getModalHide,
				GetModalShow: _getModalShow,
				GetNotify: _getNotify,
				NotifyType: _notifyType
			};
}]);
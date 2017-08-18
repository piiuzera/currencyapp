"use strict";

(function() {

	var _currency = function(currency) {
		var self = {};
		self.code_coin 				= currency && currency.code_coin 			? currency.code_coin 			: '';
		self.initial				= currency && currency.initial				? currency.initial 				: '';
		self.name 					= currency && currency.name 				? currency.name					: '';
		self.type 					= currency && currency.type 				? currency.type 				: '';
		self.coin 					= currency && currency.coin 				? currency.coin 				: '';
		self.code_country			= currency && currency.code_country			? currency.code_country			: '';
		self.country				= currency && currency.country				? currency.country 				: '';
		self.exclusion_ptax_date	= currency && currency.exclusion_ptax_date	? currency.exclusion_ptax_date 	: '';
		self.purchase_rate			= currency && currency.purchase_rate		? currency.purchase_rate 		: 0;
		self.purchase_parity		= currency && currency.purchase_parity		? currency.purchase_parity 		: 0;
		self.sales_charge			= currency && currency.sales_charge			? currency.sales_charge 		: 0;
		self.sales_parity			= currency && currency.sales_parity			? currency.sales_parity 		: 0;

	    var _toJson = function() {
	    	return self;
	    };

	    var _isEmpty = function() {
	    	return !self.code_coin &&
				   !self.initial &&
				   !self.name &&
				   !self.type &&
				   !self.coin &&
				   !self.code_country &&
				   !self.country &&
				   !self.exclusion_ptax_date &&
				   !self.sales_charge &&
				   !self.purchase_rate &&
				   !self.purchase_parity &&
				   !self.sales_charge &&
				   !self.sales_parity;
	    };

	    var _get = function(key) {
	    	return self[key];
	    };

	    var _set = function(key, value) {
	    	self[key] = value;
	    };

	    this.ToJson 	= _toJson;
	    this.IsEmpty 	= _isEmpty;
	    this.Get 		= _get;
	    this.Set 		= _set;
	};

	module.exports = _currency;

})();
"use strict";

(function() {

	var _currencyCountry = function(currencyCountry) {
		var self = {};
		self.code 					= currencyCountry && currencyCountry.code 					? currencyCountry.code 					: '';
		self.name 					= currencyCountry && currencyCountry.name 					? currencyCountry.name 					: '';
		self.initial				= currencyCountry && currencyCountry.initial 				? currencyCountry.initial 				: '';
		self.code_country			= currencyCountry && currencyCountry.code_country			? currencyCountry.code_country			: '';
		self.country				= currencyCountry && currencyCountry.country				? currencyCountry.country 				: '';
		self.type					= currencyCountry && currencyCountry.type					? currencyCountry.type 					: '';
		self.exclusion_ptax_date	= currencyCountry && currencyCountry.exclusion_ptax_date	? currencyCountry.exclusion_ptax_date 	: '';

	    var _toJson = function() {
	    	return self;
	    };

	    var _isEmpty = function() {
	    	return !self.code &&
				   !self.name &&
				   !self.initial &&
				   !self.code_country &&
				   !self.country &&
				   !self.type &&
				   !self.exclusion_ptax_date;
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

	module.exports = _currencyCountry;

})();
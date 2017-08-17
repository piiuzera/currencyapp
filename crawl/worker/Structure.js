"use strict";

(function() {
	var _baseUrl   						= 'https://ptax.bcb.gov.br/'; 
	var _indexCurrencyCountry  			= _baseUrl + 'ptax_internet/consultarTabelaMoedas.do?method=consultaTabelaMoedas';
	var _indexCurrencyPrice				= _baseUrl + 'ptax_internet/consultarTodasAsMoedas.do?method=consultaTodasMoedas';

	module.exports.BaseUrl				= _baseUrl;
	module.exports.IndexCurrencyCountry	= _indexCurrencyCountry;
	module.exports.IndexCurrencyPrice	= _indexCurrencyPrice;
})();
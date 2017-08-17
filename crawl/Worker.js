"use strict";

var Cheerio 				= require('cheerio');
var CurrencyCountryModel 	= require('../models/CurrencyCountry');
var CurrencyModel 			= require('../models/Currency');
var Log 					= require('./worker/Log');
var Structure 				= require('./worker/Structure');
var Web 					= require('./worker/Web');

(function() {

	var IsReady 			= true;
	var StartCrawlLoop 		= {};
	var StartCrawlLoopMs 	= 100;
	var Currency			= null;

	var HandleMessage = function(message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'SetCurrency') {
			SetCurrency(message.data.currency);
		}
	};

	var StartCrawl = function() {
		if (!IsReady) {
			return;
		}

		if (!Currency) {
			GetCurrency();
		} else {
			IsReady = false;

			GetCrawlCurrencyPrice();

			return;
		}
	};

	var GetCurrency = function() {
		process.send({
			command : 'GetCurrency'
		});
	};

	var SetCurrency = function(_currency) {
		if (!_currency || !_currency.request_hash || !_currency.currencies) {
			return;
		}

		Currency = _currency;
	};

	var GetCrawlCurrencyPrice = function() {
		Log.Info('SEARCH CURRENCY PRICE STARTED');

		Web.Get(
			Structure.IndexCurrencyPrice,
			SetCrawlCurrencyPrice
		);
	};

	var SetCrawlCurrencyPrice = function(body, status) {
		if (status !== 200 || !body) {
			Log.Error('SEARCH CANDIDATE HAS ERROR');

			SendError();

			return;
		}

		var $ = Cheerio.load(body);

		$('table > tbody > tr').each(function(indexRow) {
			var _currency = new CurrencyModel();

			$(this).find('td').each(function(indexCell) {
				if (indexCell === 0) {
					_currency.Set('code_coin', $(this).html());
				} else if (indexCell === 1) {
					_currency.Set('type', $(this).html());
				} else if (indexCell === 2) {
					_currency.Set('coin', $(this).html());
				} else if (indexCell === 3) {
					_currency.Set('purchase_rate', parseFloat($(this).html().replace(',', '.')));
				} else if (indexCell === 4) {
					_currency.Set('sales_charge', parseFloat($(this).html().replace(',', '.')));
				} else if (indexCell === 5) {
					_currency.Set('purchase_parity', parseFloat($(this).html().replace(',', '.')));
				} else if (indexCell === 6) {
					_currency.Set('sales_parity', parseFloat($(this).html().replace(',', '.')));
				}
			});

			if (!_currency.IsEmpty()) {
				Currency.currencies.push(_currency.ToJson());
			}
		});

		Log.Info('SEARCH CURRENCY PRICE SUCCESS');

		GetCrawlerCurrencyCountry();
	};

	var GetCrawlerCurrencyCountry = function() {
		Log.Info('SEARCH CURRENCY COUNTRY STARTED');

		Web.Get(
			Structure.IndexCurrencyCountry,
			SetCrawlerCurrencyCountry
		);
	};

	var SetCrawlerCurrencyCountry = function(body, status) {
		if (status !== 200 || !body) {
			Log.Error('SEARCH CURRENCY COUNTRY HAS ERROR');

			SendError();

			return;
		}

		var $ = Cheerio.load(body);

		$('table > tbody > tr').each(function(indexRow) {
			var _currencyCountry = {};
			$(this).find('td').each(function(indexCell) {
				if (indexCell === 0) {
					for (var i = 0; i < Currency.currencies.length; ++i) {
						if (Currency.currencies[i].code_coin === $(this).html()) {
							Currency.currencies[i].countries.push(_currencyCountry);
						}
					}
				} else if (indexCell === 1) {
					_currencyCountry.name = $(this).html();
				} else if (indexCell === 2) {
					_currencyCountry.initial = $(this).html();
				} else if (indexCell === 3) {
					_currencyCountry.code_country = $(this).html();
				} else if (indexCell === 4) {
					_currencyCountry.country = $(this).html();
				} else if (indexCell === 5) {
					_currencyCountry.type = $(this).html();
				} else if (indexCell === 6) {
					var dateSplit = $(this).html().split('/');
					if (dateSplit) {
						_currencyCountry.exclusion_ptax_date = new Date(dateSplit[1] + '-' +
																 		dateSplit[0] + '-' +
																 		dateSplit[2]);
					}
				}
			});
		});

		Log.Info('SEARCH CURRENCY COUNTRY SUCCESS');

		SendCurrency();
	};

	var SendError = function() {
		Currency = null;
		SendCurrency();
	};

	var SendCurrency = function() {
		process.send({
			command	: 'SetCurrency',
			data 	: {
				currency : Currency
			}
		});

		Currency 	= null;
		IsReady 	= true;
	};

	var _init = function() {
		process.on('message', HandleMessage);

		StartCrawl();
		StartCrawlLoop = setInterval(
			StartCrawl,
			StartCrawlLoopMs
		);
	};

	module.exports.Init = _init;
})();

this.Init();
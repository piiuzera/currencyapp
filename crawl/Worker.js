"use strict";

var Cheerio 	= require('cheerio');
var Currency 	= require('../models/Currency');
var Log 		= require('./worker/Log');
var Structure 	= require('./worker/Structure');
var Web 		= require('./worker/Web');

(function() {

	var IsReady 			= true;
	var StartCrawlLoop 		= {};
	var StartCrawlLoopMs 	= 100;
	var Request				= null;

	var HandleMessage = function(message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'SetRequest') {
			SetRequest(message.data.request);
		}
	};

	var StartCrawl = function() {
		if (!IsReady) {
			return;
		}

		if (!Request) {
			GetRequest();
		} else {
			IsReady = false;

			GetCrawlerCurrencyCountry();

			return;
		}
	};

	var GetRequest = function() {
		process.send({
			command : 'GetRequest'
		});
	};

	var SetRequest = function(_request) {
		if (!_request || !_request.request_hash || !_request.currencies) {
			return;
		}

		Request = _request;
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
			var _currency = new Currency();
			$(this).find('td').each(function(indexCell) {
				if (indexCell === 0) {
					_currency.Set('code_coin', $(this).html());
				} else if (indexCell === 1) {
					_currency.Set('name', $(this).html());
				} else if (indexCell === 2) {
					_currency.Set('initial', $(this).html());
				} else if (indexCell === 3) {
					_currency.Set('code_country', $(this).html());
				} else if (indexCell === 4) {
					_currency.Set('country', $(this).html());
				} else if (indexCell === 6) {
					var dateSplit = $(this).html().split('/');
					if (dateSplit) {
						_currency.Set('exclusion_ptax_date', new Date(dateSplit[1] + '-' +
																 	  dateSplit[0] + '-' +
																 	  dateSplit[2]));
					}
				}
			});

			if (!_currency.IsEmpty()) {
				Request.currencies.push(_currency);
			}
		});

		Log.Info('SEARCH CURRENCY COUNTRY SUCCESS');

		GetCrawlCurrencyPrice();
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
			var _currency = null;

			$(this).find('td').each(function(indexCell) {
				if (indexCell === 0) {
					for (var i = 0; i < Request.currencies.length; ++i) {
						if (Request.currencies[i].Get('code_coin') === $(this).html()) {
							_currency = Request.currencies[i];
						}
					}
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
		});

		Log.Info('SEARCH CURRENCY PRICE SUCCESS');

		SendRequest();
	};

	var SendError = function() {
		Request = null;
		SendRequest();
	};

	var SendRequest = function() {
		var currencies = [];
		for (var i = 0; i < Request.currencies.length; ++i) {
			currencies.push(Request.currencies[i].ToJson());
		}
		Request.currencies = currencies;

		process.send({
			command	: 'SetRequest',
			data 	: {
				request : Request
			}
		});

		Request 	= null;
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
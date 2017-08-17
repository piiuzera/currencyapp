"use strict";

var Currency = require('../models/Currency');
var Express  = require('express');
var Fork 	 = require('../crawl/Fork');

(function() {

	var Router 	 = Express.Router();
	var Requests = [];

	Router.get('/', function(request, response) {
		var hash = Math.random().toString(16).slice(2);

		Requests.push({
			request 	: request,
			response 	: response,
			hash 		: hash
		});

		var currency = {};
		currency.request_hash = hash;
		currency.currencies = [];

		Fork.GetListCurrency().Enqueue(currency);
	});

	var _setCurrency = function(_currency) {
		var response = {};
		for (var i = 0; i < Requests.length; ++i) {
			if (Requests[i].hash === _currency.request_hash) {
				response = Requests[i].response;
			}
		}

		if (!_currency) {
			response.status(401).json({
				request : false,
				date 	: new Date(),
				message : 'Nenhuma moeda foi encontrada!'
			});

			return;
		}

		response.status(200).json({
			request  : true,
			date 	 : new Date(),
			currency : _currency.currencies
		});
	};

	var _getRouter = function() {
		return Router;
	};

	module.exports.SetCurrency 	= _setCurrency;
	module.exports.GetRouter 	= _getRouter;
})();
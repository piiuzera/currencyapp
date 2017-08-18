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

		var req = {};
		req.request_hash = hash;
		req.currencies = [];

		Fork.GetListRequest().Enqueue(req);
	});

	var _setRequest = function(_request) {
		var response = {};
		for (var i = 0; i < Requests.length; ++i) {
			if (Requests[i].hash === _request.request_hash) {
				response = Requests[i].response;
			}
		}

		if (!_request) {
			response.status(401).json({
				request : false,
				date 	: new Date(),
				message : 'Nenhuma moeda foi encontrada!'
			});

			return;
		}

		response.status(200).json({
			request  	: true,
			date 	 	: new Date(),
			currencies 	: _request.currencies
		});
	};

	var _getRouter = function() {
		return Router;
	};

	module.exports.SetRequest 	= _setRequest;
	module.exports.GetRouter 	= _getRouter;
})();
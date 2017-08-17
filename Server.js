"use strict";

var BodyParser      = require('body-parser');
var CookieParser    = require('cookie-parser');
var Cors            = require('cors');
var EJS             = require('ejs');
var Express         = require('express');
var Index 			= require('./Index');
var Path            = require('path');
var RouterCurrency 	= require('./router/RouterCurrency');

(function() {
	var _init = function() {
		var App = Express();

		App.engine('html', EJS.renderFile);

		App.use(BodyParser.urlencoded({
			extended: true
		}));
		App.use(BodyParser.json());
		App.use(CookieParser());
		App.use(Cors());
		App.use(Express.static(Path.join(__dirname, 'public_html')));

		App.use('/crawler/currency/', RouterCurrency.GetRouter());

		App.listen(5010, function() {
			console.log("Server has Started: http://localhost:5010");

			Index.Init();
		});
	};

	module.exports.Init = _init;
})();

this.Init();
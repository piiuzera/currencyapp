"use strict";

var Cluster 		= require('cluster');
var Fork 			= require('./crawl/Fork');
var RouterCurrency	= require('./router/RouterCurrency');

(function() {

	var handleMessage = function(worker, message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'GetCurrency') {
			var currency = Fork.GetListCurrency().Dequeue();

			worker.send({
				command: 'SetCurrency',
				data: {
					currency: currency ? currency : null
				}
			});
		} else if (message.command === 'SetCurrency') {
			RouterCurrency.SetCurrency(message.data.currency);
		}
	};

	var _init = function() {
		Cluster.on('message', handleMessage);

		Fork.Init();
	};

	module.exports.Init = _init;
})();
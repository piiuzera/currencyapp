"use strict";

var Cluster 		= require('cluster');
var Fork 			= require('./crawl/Fork');
var RouterCurrency	= require('./router/RouterCurrency');

(function() {

	var handleMessage = function(worker, message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'GetRequest') {
			var request = Fork.GetListRequest().Dequeue();

			worker.send({
				command: 'SetRequest',
				data: {
					request: request ? request : null
				}
			});
		} else if (message.command === 'SetRequest') {
			RouterCurrency.SetRequest(message.data.request);
		}
	};

	var _init = function() {
		Cluster.on('message', handleMessage);

		Fork.Init();
	};

	module.exports.Init = _init;
})();
"use strict";

var Cluster	= require('cluster');
var Log 	= require('./fork/Log');

(function() {
	var ListRequest  = [];
    var Workers      = [];
    var ScaleLoop    = {};
    var ScaleLoopMs  = 100;

    var SetScale = function() {
        var workersId 	= Object.keys(Workers);
        var threads 	= 10;
        var resolution	= ListRequest.length / threads;
        var newThreads	= 0;

        if (threads > workersId.length) {
            newThreads = threads - workersId.length;

            if (resolution < 1) {
                newThreads = ListRequest.length - workersId.length;
            }

            StartWorkers(newThreads);
            return;
        }
    };

    var StartWorkers = function(newThreads) {
        for (var i = 0; i < newThreads; ++i) {
            var worker = Cluster.fork();

            Workers[worker.id] = worker;
        }
    };

    var _getListRequest = function() {
        var _enqueue = function(_request) {
            if (!_request || !_request.request_hash || !_request.currencies) {
                return;
            }

            ListRequest.unshift(_request);
        };

        var _dequeue = function() {
            if (ListRequest.length === 0) {
                return null;
            }

            return ListRequest.pop();
        };

        return {
            Enqueue : _enqueue,
            Dequeue : _dequeue
        };
    };

	var _init = function() {
        Cluster.setupMaster({
            exec: './crawl/Worker.js',
            args: ['--use', 'http']
        });

        SetScale();
        ScaleLoop = setInterval(
            SetScale,
            ScaleLoopMs
        );
	};

	module.exports.GetListRequest  = _getListRequest;
	module.exports.Init 		   = _init;
})();
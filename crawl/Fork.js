"use strict";

var Cluster	= require('cluster');
var Log 	= require('./fork/Log');

(function() {
	var ListCurrency  = [];
    var Workers       = [];
    var ScaleLoop     = {};
    var ScaleLoopMs   = 100;

    var SetScale = function() {
        var workersId 	= Object.keys(Workers);
        var threads 	= 10;
        var resolution	= ListCurrency.length / threads;
        var newThreads	= 0;

        if (threads > workersId.length) {
            newThreads = threads - workersId.length;

            if (resolution < 1) {
                newThreads = ListCurrency.length - workersId.length;
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

    var _getListCurrency = function() {
        var _enqueue = function(_currency) {
            if (!_currency || !_currency.request_hash || !_currency.currencies) {
                return;
            }

            ListCurrency.unshift(_currency);
        };

        var _dequeue = function() {
            if (ListCurrency.length === 0) {
                return null;
            }

            return ListCurrency.pop();
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

	module.exports.GetListCurrency     = _getListCurrency;
	module.exports.Init 			   = _init;
})();
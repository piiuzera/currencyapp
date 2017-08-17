"use strict";

var Colors = require('colors');

(function() {
    Colors.setTheme({
        success : 'green',
        info    : 'gray',
        error   : 'red'
    });
    
    var _error = function(message) {
        if (typeof message === 'object') {
            console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.error('[ERROR ] '));
            console.log(message);
            return;
        }
        console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.error('[ERROR ] ') + message);
    };

    var _info = function(message) {
        if (typeof message === 'object') {
            console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.info('[ INFO ] '));
            console.log(message);
            return;
        }

        console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.info('[ INFO ] ') + message);
    };

    var _success = function(message) {
        if (typeof message === 'object') {
            console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.success('[SUCESS] '));
            console.log(message);
            return;
        }

        console.log(Colors.success('[ WORKER: ' + process.pid + ' ]') + Colors.success('[SUCESS] ') + message);
    };

    var _clearLine = function(message) {
        console.log(' ');
        console.log(Colors.magenta('----------------------------------'));
        console.log(' ');
    };

    module.exports.Error        = _error;
    module.exports.Info         = _info;
    module.exports.Success      = _success;
    module.exports.ClearLine    = _clearLine;
})();
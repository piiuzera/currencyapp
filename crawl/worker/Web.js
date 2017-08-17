"use strict";

var RequestConnection = require('request');

(function() {

    var Request = RequestConnection.defaults({
        jar       : true,
        timeout   : 60000,
        encoding  : 'binary',
        gzip      : true,
        time      : true,
        headers   : {
            'User-Agent'                : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)',
            'Upgrade-Insecure-Requests' : '1'
        }
    });

    var _requestCallback = function(url, callback, retryCount, error, response, body) {
        var statusCode = response? response.statusCode : null;

        if (!error && response && statusCode <= 399) {
            callback(body, statusCode, url, response.headers);
        } else {
            console.log('ERROR' + error);
            callback(null, statusCode, url);
        }
    };


    var _get = function(url, callback, _retryCount) {
        var getOptions = {
            url: url
        };

        Request.get(
            getOptions,
            _requestCallback.bind(this, url, callback, _retryCount)
        );
    };

    var _post = function(url, form, callback, headers, _retryCount) {
        var postOptions = {
            'url': url,
            'form': form,
            'headers' : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        Request.post(
            postOptions,
            _requestCallback.bind(null, url, callback, _retryCount)
        );
    };

    module.exports.Get  = _get;
    module.exports.Post = _post;
})();

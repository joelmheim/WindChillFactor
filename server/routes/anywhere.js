var express = require('express');
var http = require('http');
var xmldoc = require('xmldoc');
var router = express.Router();
var parseString = require('xml2js').parseString;
var q = require('q');

var OSAuth = require('../lib/osauth');
var AnywhereConstants = require('../lib/anywhere-constants');

router.get('/', function() {
    console.log('Calling Anywhere Weather.');
    OSAuth.doLogin(AnywhereConstants.EMAIL, AnywhereConstants.PASSWORD).then(function(resp) {
        console.log('Data requested');
        var query = {};
        query['temperature_channel'] = 1; // outdoor
        query['humidity_channel'] = 1; // outdoor
        query['uv_channel'] = 1;    // always '1'

        var options = {
            hostname: AnywhereConstants.API_HOSTNAME,
            port: 80,
            path: '/' + AnywhereConstants.API_VERSION + '/weather/live/' + AnywhereConstants.MAC_ADDR,
            headers:  {'Authorization': 'OSA ' + resp.skey},
            data: query,
            method: 'GET'
        };
        var request = http.get(options, function (response) {
            var buffer = "";

            response.on("data", function (chunk) {
                buffer += chunk;
            });

            response.on("end", function (err) {
                if (err) {
                    res.json({'message': err });
                } else {
                    res.json(buffer);
                }
            });

            response.on("error", function(err) {
                res.json({'message': err});
            });
        });
        //var result = $.ajax({
        //    url: AnywhereConstants.API_URL + '/' + AnywhereConstants.API_VERSION + '/weather/live/' + AnywhereConstants.MAC_ADDR,
        //    contentType: 'application/json',
        //    dataType: "json",
        //    async: true,
        //    cache: false,
        //    headers: {'Authorization': 'OSA ' + sessionStorage.getItem('skey')},
        //    data: query
        //});

    }, function (reason) {
        res.json({'message': reason});
    });
});

router.get('/login', function() {
    console.log('Calling Anywhere Weather.');
    OSAuth.doLogin(AnywhereConstants.EMAIL, AnywhereConstants.PASSWORD).then(function(resp) {
        console.log('Login successful', resp);
        res.json(resp);

    //.then(function(resp) {
    //    console.log('Data requested');
    //    var query = {};
    //    query['temperature_channel'] = 1; // outdoor
    //    query['humidity_channel'] = 1; // outdoor
    //    query['uv_channel'] = 1;    // always '1'

    //    var options = {
    //        hostname: AnywhereConstants.API_HOSTNAME,
    //        port: 80,
    //        path: '/' + AnywhereConstants.API_VERSION + '/weather/live/' + AnywhereConstants.MAC_ADDR,
    //        headers:  {'Authorization': 'OSA ' + resp.skey},
    //        data: query,
    //        method: 'GET'
    //    };
    //    var request = http.get(options, function (response) {
    //        var buffer = "";

    //        response.on("data", function (chunk) {
    //            buffer += chunk;
    //        });

    //        response.on("end", function (err) {
    //            if (err) {
    //                res.json({'message': err });
    //            } else {
    //                res.json(buffer);
    //            }
    //        });

    //        response.on("error", function(err) {
    //            res.json({'message': err});
    //        });
    //    });
        //var result = $.ajax({
        //    url: AnywhereConstants.API_URL + '/' + AnywhereConstants.API_VERSION + '/weather/live/' + AnywhereConstants.MAC_ADDR,
        //    contentType: 'application/json',
        //    dataType: "json",
        //    async: true,
        //    cache: false,
        //    headers: {'Authorization': 'OSA ' + sessionStorage.getItem('skey')},
        //    data: query
        //});

    }, function (reason) {
        res.json({'message': reason});
    });
});

module.exports = router;

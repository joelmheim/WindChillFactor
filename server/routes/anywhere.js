var express = require('express');
var http = require('http');
var xmldoc = require('xmldoc');
var router = express.Router();
var parseString = require('xml2js').parseString;

var OSAuth = require('../lib/osauth');
var AnywhereConstants = require('../lib/anywhere-constants');

router.get('/', function() {
    console.log('Calling Anywhere Weather');

    OSAuth.doLogin(AnywhereConstants.EMAIL, AnywhereConstants.PASSWORD, function(token) {
        var query = {};
        query['temperature_channel'] = 1; // outdoor
        query['humidity_channel'] = 1; // outdoor
        query['uv_channel'] = 1;    // always '1'

        var options = {
            hostname: AnywhereConstants.API_HOSTNAME,
            port: 80,
            path: '/' + AnywhereConstants.API_VERSION + '/weather/live/' + AnywhereConstants.MAC_ADDR,
            headers:  {'Authorization': 'OSA ' + token},
            data: query,
            method: 'GET'
        };
        var request = http.get(options, function (response) {
            
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

    });
    res.json(result);
});

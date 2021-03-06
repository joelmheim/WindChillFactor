var querystring = require('querystring');
var http = require('http');
var q = require('q');
var CryptoJS = require('crypto-js');
//var SHA1 = require('crypto-js/sha1');
//var SHA256 = require('crypto-js/sha256');
//var Base64 = require('crypto-js/enc-base64');
//var PBKDF2 = require('crypto-js/pbkdf2');
//var HmacSHA1 = require('crypto-js/hmac-sha1');
var API_URL = require('./anywhere-constants').API_URL;
var API_HOSTNAME = require('./anywhere-constants').API_HOSTNAME;
var API_VERSION = require('./anywhere-constants').API_VERSION;

var OSAuth = OSAuth || (function() {
        function OSAHash(n,a) {
            console.log("Test Hashing...", n, a);
            var e = "$p5k2$2710$" + CryptoJS.SHA1(n).toString().substring(0, 8);
            //console.log("SHA1: ", e);
            //var r = CryptoJS.PBKDF2(a, e, {
            //        hasher: CryptoJS.algo.SHA256,
            //        keySize: 8,
            //        iterations: 1e4
            //    });
            var r = a;
            console.log("Password hash: ", r);
            //return e + "$" + CryptoJS.enc.Base64.stringify(r).replace(/\+/g, ".");
            return e + "$" + r;
        }

        var OSASaltedHash = function(n, a, e) {
                    var r = OSAHash(n, a);
                    //var r = a;
                    console.log("Password: ", r);
                    return CryptoJS.HmacSHA1(e, r).toString();
                };

        var OSAGetChallenge = function(email) {
                    console.log('Challenge requested.');
                    var deferred = q.defer();
                    var options = {
                        hostname: API_HOSTNAME,
                        path: '/' + API_VERSION + '/account/challenge/' + encodeURI(email),
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    var request = http.get(options, function (response) {
                        var buffer = "";

                        response.on("data", function (chunk) {
                            buffer += chunk;
                        });

                        response.on("end", function (err) {
                            if (err) {
                                console.log('Error requesting challenge.', err);
                                deferred.reject(err);
                            } else {
                                console.log('Buffer: ', buffer);
                                var data = JSON.parse(buffer);
                                console.log('Challenge received.', data);
                                if (data.status === 200) {
                                    console.log('Success: ', data.status);
                                    deferred.resolve(data);
                                } else {
                                    console.log('Failure: ', data.status, data.message);
                                    deferred.reject(data);
                                }
                            }
                        });
                    });

                    return deferred.promise;
                    //return $.ajax({
                    //    type: "GET",
                    //    url: API_URL + "/" + API_VERSION + "/account/challenge/" + encodeURI(t),
                    //    contentType: "application/json",
                    //    dataType: "json",
                    //    async: true,
                    //    cache: false
                    //});
                };

        var doLogin = function(email, password) {
                    var deferred = q.defer();
                    OSAGetChallenge(email).then(function (resp) {
                        console.log('Login in progress.');
                        var hash = OSASaltedHash(email, password, resp.challenge);
                        console.log("Hash: ", hash);
                        var post_data = querystring.stringify({
                            'password': hash,
                            'challenge': resp.challenge
                        });
                        var options = {
                            hostname: API_HOSTNAME,
                            path: '/' + API_VERSION + '/account/authorization/' + encodeURI(email),
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': post_data.length,
                                'Origin': 'http://www.osanywhereweather.com',
                                'Referer': 'http://www.osanywhereweather.com/'
                            }
                        };
                        var request = http.request(options, function (response) {
                            var buffer = "";
                            response.setEncoding('utf8');
                            response.on("data", function (chunk) {
                                buffer += chunk;
                            });

                            response.on("end", function (err) {
                                if (err) {
                                    console.log('Login error.', err);
                                    deferred.reject(err);
                                } else if (buffer === 'undefined' || buffer === '') {
                                    console.log('Login error. Empty buffer.');
                                    deferred.reject('Empty response from server.');
                                } else {
                                    console.log('Buffer: ', buffer);
                                    var data = JSON.parse(buffer);
                                    console.log('Response received: ', data);
                                    if (data.status === 200) {
                                        console.log('Success: ', data.status);
                                        deferred.resolve(data);
                                    } else {
                                        console.log('Failure: ', data.status, data.message);
                                        deferred.reject(data);
                                    }
                                }
                            });
                        });
                        request.write(post_data);
                        request.end();
                    }, function (reason) {
                        console.log('Login failed', reason);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                    //return OSAGetChallenge(email).then(function (resp) {
                    //    var hash = OSASaltedHash(email, password, resp.challenge);
                    //    return $.ajax({
                    //        type: 'POST',
                    //        url: API_URL + '/' + API_VERSION + '/account/authorization/' + encodeURI(email),
                    //        contentType: 'application/json',
                    //        dataType: 'json',
                    //        async: true,
                    //        cache: false,
                    //        data: {"password": hash, "challenge": resp.challenge}
                    //    });
                    //}).then(function (resp) {
                    //    var deferred = $.Deferred();
                     //   sessionStorage.setItem('skey', resp.skey);
                     //   sessionStorage.setItem('user_id', resp.user_id);
                     //   sessionStorage.setItem('user', JSON.stringify(resp.user));
                     //   sessionStorage.setItem('name', resp.user.first_name + " " + resp.user.last_name);
                     //   deferred.resolve(resp);
                     //   return deferred;
                    //}).fail(function (resp) {
                    //    console.log(resp);
                    //});
                };

        return {
        OSAHash: OSAHash,
        OSASaltedHash: OSASaltedHash,
        OSAGetChallenge: OSAGetChallenge,
        doLogin: doLogin
    };
})();

module.exports = OSAuth;
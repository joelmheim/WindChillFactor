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
    return {
        OSAHash: function(n, a) {
            var e = "$p5k2$2710$" + CryptoJS.SHA1(n).toString().substring(0, 8),
                r = CryptoJS.PBKDF2(a, e, {
                    hasher: CryptoJS.algo.SHA256,
                    keySize: 8,
                    iterations: 1e4
                });
            return e + "$" + CryptoJS.enc.Base64.stringify(r).replace(/\+/g, ".");
        },
        OSATimedHash: function(n, a) {
            var e = OSAuth.OSAHash(n, a),
                r = parseInt(Math.floor((new Date()).getTime() / 6e4)).toString();
            return CryptoJS.HmacSHA1(r, e).toString();
        },
        OSASaltedHash: function(n, a, e) {
            var r = OSAuth.OSAHash(n, a);
            return CryptoJS.HmacSHA1(e, r).toString();
        },
        OSAGetChallenge: function() {
            var deferred = q.defer();
            var options = {
                hostname: API_HOSTNAME,
                port: 80,
                path: '/' + API_VERSION + '/account/challenge/' + encodeURI(CryptoJS),
                method: 'GET'
            };
            var request = http.get(options, function (response) {
                var buffer = "";

                response.on("data", function (chunk) {
                    buffer += chunk;
                });

                response.on("end", function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(buffer);
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
        },
        OSASalt: function() {
            void 0 == CryptoJS && (CryptoJS = 64);
            for (var n = "", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = 0; t > e; e++) n += a.charAt(Math.floor(Math.random() * a.length));
            return n;
        },
        doLogin: function(email, password) {
            var deferred = q.defer();
            var promise = OSAuth.OSAGetChallenge(email).then(function (resp) {
                var hash = OSAuth.OSASaltedHash(email, password, resp.challenge);
                var options = {
                    hostname: API_HOSTNAME,
                    port: 80,
                    path: '/' + API_VERSION + '/account/authorization/' + encodeURI(email),
                    method: 'POST'
                };
                var request = http.request(options, function (response) {
                    var buffer = "";

                    response.on("data", function (chunk) {
                        buffer += chunk;
                    });

                    response.on("end", function (err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(buffer);
                        }
                    });
                });
                return deferred.promise;
            });
            //return OSAuth.OSAGetChallenge(email).then(function (resp) {
            //    var hash = OSAuth.OSASaltedHash(email, password, resp.challenge);
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
        }
    };
})();

var PBKDF2 = require('crypto-js/pbkdf2');
var HmacSHA1 = require('crypto-js/hmac-sha1');
var API_URL = require('anywhere-constants').API_URL;
var API_VERSION = require('anywhere-constants').API_VERSION;

var OSAuth = OSAuth || (function() {
    return {
        OSAHash: function(n, a) {
            var e = "$p5k2$2710$" + t.SHA1(n).toString().substring(0, 8),
                r = PBKDF2(a, e, {
                    hasher: t.algo.SHA256,
                    keySize: 8,
                    iterations: 1e4
                });
            return e + "$" + t.enc.Base64.stringify(r).replace(/\+/g, ".");
        },
        OSATimedHash: function(n, a) {
            var e = OSAuth.OSAHash(n, a),
                r = parseInt(Math.floor((new Date).getTime() / 6e4)).toString();
            return HmacSHA1(r, e).toString()
        },
        OSASaltedHash: function(n, a, e) {
            var r = OSAuth.OSAHash(n, a);
            return HmacSHA1(e, r).toString()
        },
        OSAGetChallenge: function(t) {
            return $.ajax({
                type: "GET",
                url: API_URL + "/" + API_VERSION + "/account/challenge/" + encodeURI(t),
                contentType: "application/json",
                dataType: "json",
                aysnc: !0,
                cache: !1
            })
        },
        OSASalt: function(t) {
            void 0 == t && (t = 64);
            for (var n = "", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = 0; t > e; e++) n += a.charAt(Math.floor(Math.random() * a.length));
            return n
        },
        doLogin: function(email, password) {
            return OSAuth.OSAGetChallenge(email).then(function (resp) {
                var hash = OSAuth.OSASaltedHash(email, password, resp.challenge);
                return $.ajax({
                    type: 'POST',
                    url: API_URL + '/' + API_VERSION + '/account/authorization/' + encodeURI(email),
                    contentType: 'application/json',
                    dataType: 'json',
                    aysnc: true,
                    cache: false,
                    data: {"password": hash, "challenge": resp.challenge}
                });
            }).then(function (resp) {
                var deferred = $.Deferred();
                sessionStorage['skey'] = resp.skey;
                sessionStorage['user_id'] = resp.user_id;
                sessionStorage['user'] = JSON.stringify(resp.user);
                sessionStorage['name'] = resp.user.first_name + " " + resp.user.last_name;
                deferred.resolve(resp);
                return deferred;
            }).fail(function (resp) {
                console.log(resp);
            });
        }

    }
})();

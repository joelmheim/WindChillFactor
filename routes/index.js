var express = require('express');
var router = express.Router();
var http = require('http');


/* GET home page. */
router.get('/', function(req, res) {
  //if (!!navigator.geolocation) {
  //  navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = 63.44;//pos.coords.latitude;
      var lon = 10.57;//pos.coords.longitude;
      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api?lat='+lat+'&lon='+lon,
        method: 'GET'
      };
      var request = http.get(options, function (response) {
        var buffer = "",
            weather;

        response.on("data", function (chunk) {
          buffer += chunk;
        }); 

        response.on("end", function (err) {
          if (err) {
            res.send(err);
          } else {
            weather = JSON.parse(body);
          }
        });
    //}, 
    //function (error) {
    
    //});
  //}
  res.render('index', { title: 'WindChill', weather: weather });
});

module.exports = router;

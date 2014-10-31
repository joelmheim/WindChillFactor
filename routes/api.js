var express = require('express');
var http = require('http');
var xmldoc = require('xmldoc');
var router = express.Router();
var parseString = require('xml2js').parseString;

/* GET api listing. */
router.get('/', function(req, res) {
  console.log("Calling yr.no");
  var lat = req.query.lat;
  var lon = req.query.lon;
  console.log("Lat og lon", lat, lon);
  var options = {
    hostname: 'api.yr.no',
    port: 80,
    path: '/weatherapi/locationforecast/1.9/?lat='+lat+'&lon='+lon,
    method: 'GET'
  };
  var request = http.get(options, function (response) {
    var buffer = "";

    response.on("data", function (chunk) {
      buffer += chunk;
    }); 

    response.on("end", function (err) {
      var output = {},
          time,
          temperature;
      parseString(buffer, function(err, result) {
        time = result.weatherdata.product[0].time[0].$;
        temperature = result.weatherdata.product[0].time[0].location[0].temperature[0].$;
        output['time'] = time.from;
        output['temperature'] = {
          'value':  Number(temperature.value),
          'unit': temperature.unit
        }
      });
      //var location = doc.firstChild('location');
      //tmparseString(buffer, function(err, result) {
      //  console.log(result);
      //});
      res.send(JSON.stringify(output));
    });
  }); 
  console.log('Finished');

});

module.exports = router;

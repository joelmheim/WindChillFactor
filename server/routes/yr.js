var express = require('express');
var http = require('http');
var xmldoc = require('xmldoc');
var router = express.Router();
var parseString = require('xml2js').parseString;

function effective_temperature(temp, windMps) {
  var windKph = windMps * 3600 / 1000;
  var windPow = Math.pow(windKph, 0.16);
  return (13.12 + (0.6215 * temp) - (11.37 * windPow) + ((0.3965 * temp) * windPow));
}

/* GET api listing. */
router.get('/', function(req, res) {
  console.log("Calling yr.no");
  var lat = req.query.lat;
  var lon = req.query.lon;
  var pretty = req.query.pretty;
  var options = {
    hostname: 'api.met.no',
    port: 80,
    path: '/weatherapi/locationforecast/1.9/?lat='+lat+'&lon='+lon,
    method: 'GET'
  };
  console.log('Url being called: ', options);
  var request = http.get(options, function (response) {
    var buffer = '';

    response.on('data', function (chunk) {
      buffer += chunk;
    });

    response.on('end', function (err) {
      var output = {},
          time,
          location,
          temperature,
          windSpeed,
          windDirection,
          humidity,
          pressure,
          cloudiness,
          fog,
          dewpointTemperature;
      if (err) {
        res.send(err);
      } else {
        if (response.statusCode < 200 || response.statusCode >= 400) {
          output['error'] = 'No weather data found for location, lat: ' + lat + ', lon: ' + lon + '. Http status code: ' + response.statusCode + '.';
        } else {
          parseString(buffer, function (err, result) {
            if (err) {
              console.log('Error from parsing buffer: ', err);
              output['error'] = err;
            } else {
              if (result === null || result === undefined) {
                output['error'] = 'No weather data found for location, lat: ' + lat + ', lon: ' + lon + '.';
              } else {
                var timeElement = result.weatherdata.product[0].time[0];
                var imgTimeElement = result.weatherdata.product[0].time[1].location[0];
                console.log("Icon", imgTimeElement.symbol[0].$);
                var locationElement = timeElement.location[0];
                time = timeElement.$;
                location = locationElement.$;
                temperature = locationElement.temperature[0].$;
                windSpeed = locationElement.windSpeed[0].$;
                windDirection = locationElement.windDirection[0].$;
                humidity = locationElement.humidity[0].$;
                pressure = locationElement.pressure[0].$;
                cloudiness = locationElement.cloudiness[0].$;
                fog = locationElement.fog[0].$;
                dewpointTemperature = locationElement.dewpointTemperature[0].$;
                effectiveTemperature = effective_temperature(Number(temperature.value), Number(windSpeed.mps));
                output['time'] = time.from;
                output['location'] = {
                  'altitude': Number(location.altitude),
                  'latitude': Number(location.latitude),
                  'longitude': Number(location.longitude)
                };
                output['temperature'] = {
                  'value': Number(temperature.value),
                  'unit': temperature.unit
                };
                output['windSpeed'] = {
                  'value': Number(windSpeed.mps),
                  'unit': 'mps',
                  'beaufort': Number(windSpeed.beaufort),
                  'name': windSpeed.name
                };
                output['windDirection'] = {
                  'value': Number(windDirection.deg),
                  'unit': 'deg',
                  'name': windDirection.name
                };
                output['humidity'] = {
                  'value': Number(humidity.value),
                  'unit': humidity.unit
                };
                output['pressure'] = {
                  'value': Number(pressure.value),
                  'unit': pressure.unit
                };
                output['cloudiness'] = {
                  'value': Number(cloudiness.percent),
                  'unit': 'percent'
                };
                output['fog'] = {
                  'value': Number(fog.percent),
                  'unit': 'percent'
                };
                output['dewpointTemperature'] = {
                  'value': Number(dewpointTemperature.value),
                  'unit': dewpointTemperature.unit
                };
                output['weatherIcon'] = imgTimeElement.symbol[0].$;
                output['windchill'] = {
                  'value': Number(effectiveTemperature),
                  'unit': temperature.unit
                };
              }
            }
          });
        }
        console.log(output);
        if (pretty="true") {
          res.send(JSON.stringify(output, undefined, 2))
        } else {
          res.send(JSON.stringify(output));
        }
      }
    });

    response.on('error', function(err) {
      res.send(err);
    });
  });
  console.log('Finished');

});

module.exports = router;

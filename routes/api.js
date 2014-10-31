var express = require('express');
var http = require('http');
var xmldoc = require('xmldoc');
var router = express.Router();

/* GET api listing. */
router.get('/', function(req, res) {
  console.log("Calling yr.no");
  var options = {
    hostname: 'api.yr.no',
    port: 80,
    path: '/weatherapi/locationforecast/1.9/?lat=60.10&lon=10.5',
    method: 'GET'
  };
  var request = http.get(options, function (response) {
    var buffer = "", 
    data,
    product;

    response.on("data", function (chunk) {
      buffer += chunk;
    }); 

    response.on("end", function (err) {
      // finished transferring data
      // dump the raw data
      console.log(buffer);
      console.log("\n");
      var document = new xmldoc.XmlDocument(buffer);
      product = document.childNamed('product');
      //route = data.routes[0];

      // extract the distance and time
      //console.log("Data: " + data);
      //console.log("Time: " + route.legs[0].duration.text);
      res.end(buffer);
    }); 
  }); 
  console.log('Finished');
});

module.exports = router;

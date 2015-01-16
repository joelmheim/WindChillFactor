"use strict";

var WindChill = (function () {
  var module = {},
      position = {'lat' : 62.1, 'long' : 10.5};

  module.init = function (pos) {
    position.lat = pos.coords.latitude;
    position.long = pos.coords.longitude;
    console.log('init.position: ', position);
  };

  module.position = position;

  module.handle_error = function (error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert('Please allow the use of position data in order to use this app.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Could not detect current position.');
        break;
      case error.TIMEOUT:
        alert('Unable to get position fix in resonable time. Timeout.');
        break;
      default:
        alert('Unknown error.');
        break;
    }
  };

  module.mapInit = function () {
    console.log('Map Init: ', position.lat, position.long);
    var map = new OpenLayers.Map('basicMap');
    var mapnik         = new OpenLayers.Layer.OSM();
    var fromProjection = new OpenLayers.Projection('EPSG:4326');   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection('EPSG:900913'); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(position.long, position.lat).transform( fromProjection, toProjection);
    var zoom           = 15;
    map.addLayer(mapnik);
    map.setCenter(position, zoom );
    var markers = new OpenLayers.Layer.Markers( 'Markers' );
    map.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(position));
  };

  module.weather_info = function (callback) {
    console.log('Weather Info: ', position.lat, position.long);
    var url = 'http://localhost:3000/api/weather?lat=' + position.lat + '&lon=' + position.long;
    $.get(url, function(data) {
      var weather = JSON.parse(data);
      //var weather = {};
      //weather.effectiveTemp = yr.windchill.value;
      //weather.temp = yr.temperature.value;
      //weather.icon = yr.weatherIcon;
      console.log('weather', weather);
      //weather.iconUrl = 'http://api.yr.no/weatherapi/weathericon/1.1/?symbol=' + weather.icon.number + '&content_type=image/png';
      //$("#effective_temp").html(effectiveTemp.toFixed(1) + "&deg;");
      //if (effectiveTemp < 0) {
      //  $("#effective_temp").addClass("cold");
      //} else {
      //  $("#effective_temp").removeClass("cold");
      //}
      //$("#temperature_value").html(weather.temperature.value + "&deg;");
      //if (temp < 0) {
      //  $("#temperature_value").addClass("cold");
      //} else {
      //  $("#temperature_value").removeClass("cold");
      //}
      //$("#windspeed_value").text(weather.windSpeed.value);
      //$("#weather_icon").attr('src', iconUrl);
      //$("#weather_icon").attr('alt', icon.id);
      callback(weather);
    })
      .fail(function () {
        callback({});
      });
  };

  return module;
} ());

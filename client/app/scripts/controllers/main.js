'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http) {
    var map = L.map('map');

    new L.TileLayer.WMS("http://opencache.statkart.no/gatekeeper/gk/gk.open", {
        layers: 'matrikkel_bakgrunn',
        format: 'image/png',
        transparent: false,
        version: "1.0",
        attribution: "Kartverket"
    }).addTo(map);

    L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
       	attribution: '&copy; OpenCycleMap',
        opacity: 0.5
    }).addTo(map);

    // var windlayer = L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png', {
    // 	maxZoom: 19,
    // 	attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    // 	opacity: 0.3
    // }).addTo(map);

    map.locate({setView: true, maxZoom: 16});

    function onLocationFound(e) {
      // $scope.position = {
      //   'lat' : e.latitude,
      //   'long' : e.longitude
      // };
      var url = '/api/weather/yr?lat=' + e.latitude + '&lon=' + e.longitude;
      $http.get(url).
        success(function(data, status, headers, config) {
          //$scope.weather = data;

          var radius = e.accuracy / 2;

          var weatherPopupText = //$()
            "<div>" +
              "<div class='effective'>"+
                "<span id='effective_value'>" + data.windchill.value.toFixed(1) + "&deg;</span>" +
                "<br/>" +
                "<span class='effective-label'>effective</span>" +
              "</div>" +
              "<div class='weather'>" +
                "<img src='http://api.yr.no/weatherapi/weathericon/1.1/?symbol=" + data.weatherIcon.number + "&content_type=image/png'>" +
              "</div>" +
              "<div class='below'>" +
                "<div class='temperature'>" +
                  "<span class='weather-label'>Temp:</span>" +
                  "<br/>" +
                  "<span id='temp_value' class='weather-value'>" + data.temperature.value + "&deg;</span>" +
                "</div>" +
                "<div class='windspeed'>" +
                  "<span class='weather-label'>Wind speed:</span>" +
                  "<br/>" +
                  "<span class='weather-value'>" + data.windSpeed.value + " " + data.windSpeed.unit + "</span>" +
                "</div>" +
                "<div class='accuracy'>" +
                  "<span>You are within " + radius + " meters from this point.</span>" +
                "</div>" +
              "</div>" +
            "</div>";
        var weatherPopupElement = $(weatherPopupText);
        var customOptions =
                {
                  //'maxWidth': '500',
                  'minWidth': '200',
                  'closeButton': false,
                  'closeOnClick': false,
                  'className': 'temperature-box'
                }
      
          L.marker(e.latlng).addTo(map)
            .bindPopup(weatherPopupElement[0], customOptions).openPopup();
//            .bindPopup("Effective temp: " + Math.round(data.windchill.value, 2) + ".<br/>You are within " + radius + " meters from this point").openPopup();

          L.circle(e.latlng, radius).addTo(map);
        });
     }

     map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);

  });

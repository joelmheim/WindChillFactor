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
    var customPopupOptions =
          {
            //'maxWidth': '500',
            'minWidth': '200',
            'closeButton': false,
            'className': 'temperature-box'
          };
    var popup = L.popup(customPopupOptions);
    var marker = L.marker();
    var circle = L.circle();

    function weatherPopup(weatherData) {
      var weatherPopupText =
        '<div>' +
          '<div class="effective">'+
            '<span id="effective_value">' + weatherData.windchill.value.toFixed(1) + '&deg;</span>' +
            '<br/>' +
            '<span class="effective-label">effective</span>' +
          '</div>' +
          '<div class="weather">' +
            '<img src="http://api.yr.no/weatherapi/weathericon/1.1/?symbol=' + weatherData.weatherIcon.number + '&content_type=image/png">' +
          '</div>' +
          '<div class="below">' +
            '<div class="temperature">' +
              '<span class="weather-label">Temp:</span>' +
              '<br/>' +
              '<span id="temp_value" class="weather-value">' + weatherData.temperature.value + '&deg;</span>' +
            '</div>' +
            '<div class="windspeed">' +
              '<span class="weather-label">Wind speed:</span>' +
              '<br/>' +
              '<span class="weather-value">' + weatherData.windSpeed.value + ' ' + weatherData.windSpeed.unit + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      return weatherPopupText;
    }

    function makeUrl(latLong) {
      var url = '/api/weather/yr?lat='  + latLong.lat + '&lon=' + latLong.lng;
      return url;
    }

    function onLocationFound(e) {
      // $scope.position = {
      //   'lat' : e.latitude,
      //   'long' : e.longitude
      // };
      $http.get(makeUrl(e.latlng)).
        success(function(data, status, headers, config) {
          //$scope.weather = data;

          var weatherPopupElement = $(weatherPopup(data));
          var radius = e.accuracy / 2;
          var accuracyText =
            '<div class="accuracy">' +
              '<span>You are within ' + radius.toFixed(1) + ' meters of this point.</span>' +
            '</div>';
          var accuracyElement = $(accuracyText);
          weatherPopupElement.append(accuracyElement);
          marker
            .setLatLng(e.latlng)
            .addTo(map)
            .bindPopup(weatherPopupElement[0], customPopupOptions)
            .openPopup();

          circle
            .setLatLng(e.latlng)
            .setRadius(radius)
            .addTo(map);
        }).
        error(function(data, status, headers, config) {
          console.out('Error calling yr api: ', data);
        });
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
      L.marker(e.latlng).addTo(map)
        .bindPopup('<b>Failed to get location.</b>');
    }

    map.on('locationerror', onLocationError);

    function locationSelected(e) {
      map.removeLayer(marker);
      map.removeLayer(circle);
      $http.get(makeUrl(e.latlng)).
        success(function(data, status, headers, config) {
          //$scope.weather = data;

          var weatherPopupElement = $(weatherPopup(data));
          var accuracyText =
            '<div class="accuracy">' +
              '<span>You have selected location ' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + '</span>' +
            '</div>';
          var accuracyElement = $(accuracyText);
          weatherPopupElement.append(accuracyElement);
          popup
            .setLatLng(e.latlng)
            .setContent(weatherPopupElement[0])
            .openOn(map);
          map.setZoomAround(e.latlng, 16);
          map.panTo(e.latlng);
        });
    }

    map.on('click', locationSelected);

  });

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
    if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        //WindChill.init(pos);
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;
        //WindChill.weather_info(function (weather) {
        $scope.position = {
          'lat' : lat,
          'long' : long
        };
        var url = '/api/weather/yr?lat=' + lat + '&lon=' + long;
        $http.get(url).
          success(function(data, status, headers, config) {
            $scope.weather = data;
          });
        var map = new ol.Map({
                    target: 'map',
                    layers: [
                      new ol.layer.Tile({
                        source: new ol.source.MapQuest({layer: 'sat'})
                      })
                    ],
                    view: new ol.View({
                      center: ol.proj.fromLonLat([long, lat]),
                      zoom: 15
                    })
                  });
      });
    }
  });

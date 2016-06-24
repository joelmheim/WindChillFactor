'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('windchillApp')
  .controller('WeatherCtrl', ['$scope', '$http', 'leafletData', 'WeatherService', function ($scope, $http, leafletData, WeatherService) {

    console.log("DEBUG: WeatherCtrl init");
    WeatherService.currentPositionWeather()
      .success(function(data) {
        angular.extend( $scope, {
          weather: data,
          position: WeatherService.position
        });
      });
  }]);

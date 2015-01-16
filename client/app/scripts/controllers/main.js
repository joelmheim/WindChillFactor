'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope) {
    if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(WindChill.init, WindChill.handle_error);
    }

    WindChill.weather_info(function (weather) {
      $scope.weather = weather;
    });

    $scope.position = WindChill.position;
  });

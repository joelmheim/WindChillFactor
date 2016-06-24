'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('windchillApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.position = {
      'lat' : 61.2,
      'long' : 10.1
    };
    if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;
        $scope.$apply(function () {
          $scope.position.lat = lat;
          $scope.position.long = long;
        });
      });
    }
    console.log("Scope: ", $scope);
  });


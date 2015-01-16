'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AboutCtrl', function ($scope) {
    if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(WindChill.init, WindChill.handle_error);
    }

    $scope.position = WindChill.position;
  });

'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # windchillApp
 *
 * Main module of the application.
 */
angular
  .module('windchillApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui-leaflet'
  ])
  .config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
  });

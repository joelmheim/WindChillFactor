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

        var map = new OpenLayers.Map('basicMap');
        var mapnik         = new OpenLayers.Layer.OSM();
        var fromProjection = new OpenLayers.Projection('EPSG:4326');   // Transform from WGS 1984
        var toProjection   = new OpenLayers.Projection('EPSG:900913'); // to Spherical Mercator Projection
        var position       = new OpenLayers.LonLat(long, lat).transform( fromProjection, toProjection);
        var zoom           = 15;
        map.addLayer(mapnik);
        map.setCenter(position, zoom );
        var markers = new OpenLayers.Layer.Markers( 'Markers' );
        map.addLayer(markers);

        markers.addMarker(new OpenLayers.Marker(position));
      });
    }
    console.log("Scope: ", $scope);
  });

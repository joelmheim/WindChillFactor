'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('windchillApp')
  .controller('MainCtrl', ['$scope', '$http', 'leafletData', 'WeatherService', function ($scope, $http, leafletData, WeatherService) {
    function centerZoomAndAddMarker(position, zoom) {
      angular.extend($scope, {
        position: position,
        center: {
          lat: position.lat,
          lng: position.lng,
          zoom: zoom
        },
        markers: {
          m1: {
            lat: position.lat,
            lng: position.lng,
            focus: true,
            message: "<div ng-include src=\"'views/popup.html'\"></div>",
            draggable: false
          }
        }
      });
    }

    leafletData.getMap().then(function(map) {
      // Statens Kartverk is not supported by angular leaflet plugin (Possible contribution?) so I have to do it like this
      var statkart_cache = new L.TileLayer.WMS("https://opencache.statkart.no/gatekeeper/gk/gk.open", {
          layers: 'topo2',
          format: 'image/png',
          transparent: false,
          version: "1.0",
          attribution: "Kartverket"
      });
      statkart_cache.addTo(map);
      map.locate({ setView: true, maxZoom: 16 });
    });

    var position = {
          lat: 63.43048590647616,
          lng: 10.395147800445558
    };

    angular.extend($scope, {
      text: 'Initial position ',
      events: { }
    });

    WeatherService.position = position;

    centerZoomAndAddMarker(position, 12);

    $scope.$on('leafletDirectiveMap.locationfound', function (event, args) {
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      centerZoomAndAddMarker(e.latlng, 16);
    });

    $scope.$on('leafletDirectiveMap.locationerror', function (event, args) {
      var e = args.leafletEvent;
      leafletData.getMap().then(function (map) {
        L.marker(e.latlng).addTo(map)
          .bindPopup('<b>Failed to get location.</b>');
      });
    });

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      centerZoomAndAddMarker(e.latlng, 16);
      leafletData.getMarkers().then(function(markers) {
        markers.m1.openPopup();
      });
    });
  }]);

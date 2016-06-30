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
    console.log("DEBUG: MainCtrl init");

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
      var statkart_cache = new L.TileLayer.WMS("https://opencache.statkart.no/gatekeeper/gk/gk.open", {
          layers: 'topo2',
          format: 'image/png',
          transparent: false,
          version: "1.0",
          attribution: "Kartverket"
      });
      statkart_cache.addTo(map);
      map.locate({ setView: true, maxZoom: 12 });
    });
    var position = {
          lat: 63.43048590647616,
          lng: 10.395147800445558
    };

    angular.extend($scope, {
      // layers: {
      //   baselayers: {
      //     osm: {
      //       name: 'OpenStreetMap',
      //       url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //       type: 'xyz'
      //     }
      //   },
      //   overlays: {
      //     wms: {
      //       name: 'OpenCycleMap',
      //       type: 'xyz',
      //       visible: true,
      //       url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      //       layerParams: {
      //         format: 'image/png',
      //         transparent: true,
      //         opacity: 0.5
      //       }
      //     }
      //   }
      // },
      text: 'Initial position ',
      events: { }
    });

    WeatherService.position = position;

    centerZoomAndAddMarker(position, 12);

    $scope.$on('leafletDirectiveMap.locationfound', function (event, args) {
      console.log("DEBUG: Location found: ", event, args);
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      centerZoomAndAddMarker(e.latlng, 15);
    });

    $scope.$on('leafletDirectiveMap.locationerror', function (event, args) {
      console.log("DEBUG: Location error", event, args);
      var e = args.leafletEvent;
      leafletData.getMap().then(function (map) {
        L.marker(e.latlng).addTo(map)
          .bindPopup('<b>Failed to get location.</b>');
      });
    });

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      console.log("DEBUG: Location selected: ", event, args);
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      centerZoomAndAddMarker(e.latlng, 15);
      leafletData.getMarkers().then(function(markers) {
        console.log('DEBUG: Marker: ', markers);
        markers.m1.openPopup();
      });
    });
  }]);

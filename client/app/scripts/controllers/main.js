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
    leafletData.getMap().then(function(map) {
      map.locate({ setView: true, maxZoom: 12 });
    });
    var position = {
          lat: 63.43048590647616,
          lng: 10.395147800445558
    };
    angular.extend($scope, {
      layers: {
        baselayers: {
          kartverket: {
            name: 'matrikkel_bakgrunn',
            url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open',
            type: 'image/png',
            transparent: false,
            version: '1.0',
            attribution: 'Kartverket'
          },
          osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
          }
        },
        overlays: {
          wms: {
            name: 'OpenCycleMap',
            type: 'xyz',
            visible: true,
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            layerParams: {
              format: 'image/png',
              transparent: true,
              opacity: 0.5
            }
          }
        }
      },
      position: position,
      text: 'Initial position ',
      center: {
        lat: position.lat,
        lng: position.lng,
        zoom: 12
      },
      markers: {
        m1: {
          lat: position.lat,
          lng: position.lng,
          focus: true,
          message: "<div ng-include src=\"'views/popup.html'\"></div>",
          draggable: false
        }
      },
      events: { }
    });

    WeatherService.position = position;

    function onLocationFound(event, args) {
      console.log("DEBUG: Location found: ", event, args);
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      angular.extend( $scope, {
              position: e.latlng,
              center: {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                zoom: 15
              },
              markers: {
                m1: {
                  lat: e.latlng.lat,
                  lng: e.latlng.lng,
                  message: "<div ng-include src=\"'views/popup.html'\"></div>",
                  focus: true,
                  draggable: false
                }
              }
            });
    }

    $scope.$on('leafletDirectiveMap.locationfound', onLocationFound);

    function onLocationError(e) {
      console.log("DEBUG: Location error", e);
      leafletData.getMap().then(function(map) {
        L.marker(e.latlng).addTo(map)
          .bindPopup('<b>Failed to get location.</b>');
      });
    }

    $scope.$on('leafletDirectiveMap.locationerror', onLocationError);

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      console.log("DEBUG: Location selected: ", event, args);
      var e = args.leafletEvent;
      WeatherService.position = e.latlng;
      angular.extend( $scope, {
        position: e.latlng,
        center: {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          zoom: 16
        },
        markers: {
          m1: {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            message: "<div ng-include src=\"'views/popup.html'\"></div>",
            focus: true,
            draggable: false
          }
        }
      });
      leafletData.getMarkers().then(function(markers) {
        console.log('DEBUG: Marker: ', markers);
        markers.m1.openPopup();
      });
    });
  }]);

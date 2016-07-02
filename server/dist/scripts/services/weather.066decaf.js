angular.module('windchillApp')
  .service('WeatherService', ['$http', function($http) {

    function makeUrl(latLong) {
      return '/api/weather/yr?lat='  + latLong.lat + '&lon=' + latLong.lng;
    }

    this.currentPositionWeather = function () {
      return $http.get(makeUrl(this.position));
    };
  }]);

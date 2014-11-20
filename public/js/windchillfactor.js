function locator(pos) {
  var lat = pos.coords.latitude;
  var long = pos.coords.longitude;
  $("#lat").text(lat);
  $("#long").text(long);
  mapInit(lat, long);
  weather_info(lat, long);
} 

function handle_error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED: 
      alert("Please allow the use of position data in order to use this app.");
      break;
    case error.POSITION_UNAVAILABLE: 
      alert("Could not detect current position."); 
      break;
    case error.TIMEOUT: 
      alert("Unable to get position fix in resonable time. Timeout.");
      break;
    default: 
      alert("Unknown error.");
      break;
  }
}

function mapInit(lat, long) {
  var map = new OpenLayers.Map("basicMap");
  var mapnik         = new OpenLayers.Layer.OSM();
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position       = new OpenLayers.LonLat(long, lat).transform( fromProjection, toProjection);
  var zoom           = 15; 
  map.addLayer(mapnik);
  map.setCenter(position, zoom );
  var markers = new OpenLayers.Layer.Markers( "Markers" );
  map.addLayer(markers);
 
  markers.addMarker(new OpenLayers.Marker(position));
}

function weather_info(lat, long) {
  var url = "/api?lat=" + lat + "&lon=" + long;
  $.get(url, function( data ) {
    var weather = JSON.parse(data);
    var effectiveTemp = weather.windchill.value;
    var temp = weather.temperature.value;
    $("#effective_temp").html(effectiveTemp.toFixed(1) + "&deg;");
    if (effectiveTemp < 0) {
      $("#effective_temp").addClass("cold");
    } else {
      $("#effective_temp").removeClass("cold");
    }
    $("#temperature_value").html(weather.temperature.value + "&deg;");
    if (temp < 0) {
      $("#temperature_value").addClass("cold");
    } else {
      $("#temperature_value").removeClass("cold");
    }
    $("#windspeed_value").text(weather.windSpeed.value);
  });
}

$(document).ready(function() {
  console.log("Document ready!!");
  if (!!navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locator, handle_error);
  }
});

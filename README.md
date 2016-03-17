# WindChillFactor

[WindChillFactor](http://windchillfactor.herokuapp.com)

This project is a simple webapp that uses the users location to pull data from the Met.no weather service and plots it on a map using Leaflet and map data from Kartverket.
The only special logic is that the app calculates the effective temperature using the windspeed and temperature data from the Met.no api.

## Structure and build
The project code is split into two parts
 * server
 * client
    
The server part is a pure express web server publishing a rest api with the weather data.

The client is an angular based web app using leaflet that calls the server api. To build new version of the client and distribute to the server directory:
 grunt --force
 
Then run the server using:
 * npm test or
 * npm start


## Deployment to Heroku
To deploy to Heroku, use the git subtree command like this:
 ```git subtree push --prefix server heroku master```
 
If --force is needed use
 ```git push heroku `git subtree split --prefix server master`:master --force```
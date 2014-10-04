var express = require('express');
var geoip = require('geoip-lite');
var request = require('request');
var app = express();

app.get('/', function(request, response) {
    response.send('Hello World!')
})

app.get('/lookup', function(req, res){
  var loc = {};
  var geo = geoip.lookup(req.query.ip);

  var lat = geo.ll[0];
  var lng = geo.ll[1];

  request('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true', function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      loc.address = body.results[0].formatted_address;
      loc.zip = body.results[0].address_components[6].long_name
      loc.country = geo.country;
      loc.state = geo.state;
      loc.city = geo.city;
      loc.lat = geo.ll[0];
      loc.lng = geo.ll[0];

      res.json(loc);
    }
  })

  
});

app.set('port', (process.env.PORT || 5000))

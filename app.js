var express = require('express');
var geoip = require('geoip-lite');
var request = require('request');
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://lage-server.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
      loc.city = geo.city;
      loc.state = body.results[0].address_components[4].long_name
      loc.lat = geo.ll[0];
      loc.lng = geo.ll[1];
      console.log(body.results[0]);
      res.json(loc);
    }
  })

  
});

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

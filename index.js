var express = require('express');
var bodyParser = require('body-parser');
var dao = require('./dao');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (request, response) {
  dao.distinct('date', function (dates) {
    response.render('index', {
      dates: dates
    });
  });
});

app.get('/api/date', function (request, response, next) {
  dao.distinct('date', function (dates) {
    response.json(dates);
  });
});

app.get('/api/result', function (request, response, next) {
  dao.get(function (results) {
    response.json(results);
  });
});

app.post('/api/result', function (request, response, next) {
  dao.add(request.body, function (results) {
    response.json(results);
  });
});

app.delete('/api/result/:id', function (request, response, next) {
  var selector = {
    _id: request.params.id
  };
  dao.remove(selector, function (results) {
    response.json(results);
  });
});

app.listen(process.env.port || 3000);
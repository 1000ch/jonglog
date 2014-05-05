var express = require('express');
var bodyParser = require('body-parser');
var dao = require('./dao');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (request, response) {
  response.render('index');
});

app.get('/api/list', function (request, response, next) {
  dao.get(function (results) {
    response.json(results);
  });
});

app.post('/api/list', function (request, response, next) {
  dao.add(request.body, function (results) {
    response.json(results);
  });
});

app.delete('/api/list/:id', function (request, response, next) {
  var selector = {
    _id: request.params.id
  };
  dao.remove(selector, function (results) {
    response.json(results);
  });
});

app.listen(3000);
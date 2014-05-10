Jonglog.Model.Date = Backbone.Model.extend({
  parse: function (date) {
    return {
      date: date
    };
  }
});

Jonglog.Collection.DateList = Backbone.Collection.extend({
  model: Jonglog.Model.Date,
  url: '/api/date'
});

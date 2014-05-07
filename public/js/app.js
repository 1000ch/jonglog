Jonglog.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    ':date': 'date'
  },
  initialize: function () {
    this.listenTo(Jonglog.mediator, 'route:change', this.onRoute);
  },
  onRoute: function (url) {
    this.navigate(url, {
      trigger: true
    });
  },
  index: function () {
    Jonglog.mediator.trigger('route:index');
  },
  date: function (date) {
    Jonglog.mediator.trigger('route:result');
    Jonglog.mediator.trigger('filter:date', date);
  }
});
Jonglog.router = new Jonglog.Router();
Jonglog.results = new Jonglog.Collection.Results();
Jonglog.headerView = new Jonglog.View.HeaderView();
Jonglog.dateListView = new Jonglog.View.DateListView({
  collection: Jonglog.results
});
Jonglog.resultView = new Jonglog.View.ResultView();
Jonglog.registerView = new Jonglog.View.RegisterView({
  collection: Jonglog.results
});

$(function () {
  $.when(
    Jonglog.results.fetch()
  ).done(function () {
    Backbone.history.start({
      pushState: false
    });
  });
});
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
Jonglog.dateList = new Jonglog.Collection.DateList();
Jonglog.resultList = new Jonglog.Collection.ResultList();
Jonglog.headerView = new Jonglog.View.HeaderView();
Jonglog.dateListView = new Jonglog.View.DateListView({
  collection: Jonglog.dateList
});
Jonglog.resultView = new Jonglog.View.ResultView();
Jonglog.registerView = new Jonglog.View.RegisterView({
  collection: Jonglog.resultList
});

$(function () {
  $.when(
    Jonglog.dateList.fetch(),
    Jonglog.resultList.fetch()
  ).done(function () {
    Backbone.history.start({
      pushState: false
    });
  });
});

Jonglog.View.ResultView = Backbone.View.extend({
  el: '#js-result',
  initialize: function () {
    this.listView = new Jonglog.View.ResultListView({
      collection: Jonglog.resultList
    });
    this.totalView = new Jonglog.View.ResultTotalView({
      collection: Jonglog.resultList
    });

    this.listView.$el.hide();
    this.totalView.$el.hide();

    this.listenTo(Jonglog.mediator, 'route:index', this.hide);
    this.listenTo(Jonglog.mediator, 'route:result', this.render);
  },
  hide: function () {
    this.listView.$el.hide();
    this.totalView.$el.hide();
  },
  render: function () {
    this.listView.$el.show();
    this.totalView.$el.show();
  }
});

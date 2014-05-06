Jonglog.View.DateListView = Backbone.View.extend({
  el: '#js-date-list',
  events: {
    'click a': 'onClick'
  },
  initialize: function () {
    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);
    this.render();
  },
  render: function () {
    this.$el.show();
  },
  hide: function () {
    this.$el.hide();
  },
  onClick: function (e) {
    e.preventDefault();
    var link = $(e.target).attr('data-link');
    Jonglog.mediator.trigger('route:change', link);
  }
});
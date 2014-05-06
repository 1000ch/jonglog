Jonglog.View.HeaderView = Backbone.View.extend({
  el: '#js-header',
  events: {
    'click a': 'onClick'
  },
  initialize: function () {
    this.listenTo(Jonglog.mediator, 'route:index', this.renderIndex);
    this.listenTo(Jonglog.mediator, 'route:result', this.renderResult);
    this.render();
  },
  render: function () {
    this.$el.show();
  },
  renderIndex: function () {
    this.$el.find('a').hide();
    this.$el.find('.title').text('結果一覧');
  },
  renderResult: function () {
    this.$el.find('a').show();
    this.$el.find('.title').text('結果');
  },
  onClick: function (e) {
    e.preventDefault();
    var link = $(e.target).attr('data-link');
    Jonglog.mediator.trigger('route:change', link);
  }
});
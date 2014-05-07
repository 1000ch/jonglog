Jonglog.View.DateListView = Backbone.View.extend({
  el: '#js-date-list',
  template: 
    '<ul class="table-view">' +
      '<% _.each(models, function (model) { %>' +
        '<li class="table-view-cell">' +
          '<a data-href=' + '"<%= model.get("date") %>"' + 'class="navigate-right"><%= model.get("date") %></a>' +
        '</li>' +
      '<% }); %>' +
    '</ul>',
  events: {
    'click a': 'onClick'
  },
  initialize: function () {
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);
  },
  render: function () {
    var html = _.template(this.template, {
      models: this.collection.models
    });
    this.$el.html(html).show();
  },
  hide: function () {
    this.$el.hide();
  },
  onClick: function (e) {
    var link = e.target.getAttribute('data-href');
    Jonglog.mediator.trigger('route:change', link);
  }
});
Jonglog.View.ResultListView = Backbone.View.extend({
  el: '#js-results',
  events: {
    'click .js-delete': 'onDelete'
  },
  initialize: function () {
    this.listenTo(this.collection, 'sync destroy', this.render);
  },
  render: function () {
    var items = [];
    this.collection.each(function (model) {
      var resultItemView = new Jonglog.View.ResultItemView({
        model: model
      });
      items.push(resultItemView.el);
    });
    this.$el.html(items);
  }
});
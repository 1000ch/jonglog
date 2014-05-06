Jonglog.View.ResultListView = Backbone.View.extend({
  el: '#js-results',
  initialize: function () {
    this.listenTo(this.collection, 'sync destroy', this.onSync);
    this.listenTo(Jonglog.mediator, 'filter:date', this.filterByDate);
  },
  onSync: function () {
    this.render(this.collection);
  },
  filterByDate: function (date) {
    var filtered = this.collection.filter(function (model) {
      return model.get('date') === date;
    });
    this.render(filtered);
  },
  render: function (collection) {
    var items = [];
    collection.forEach(function (model) {
      var resultItem = new Jonglog.View.ResultItemView({
        model: model
      });
      items.push(resultItem.el);
    });
    this.$el.html(items);
  }
});
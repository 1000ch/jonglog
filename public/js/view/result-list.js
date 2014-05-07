Jonglog.View.ResultListView = Backbone.View.extend({
  el: '#js-results',
  date: '',
  initialize: function () {
    this.listenTo(this.collection, 'sync destroy', this.render);
    this.listenTo(Jonglog.mediator, 'filter:date', this.setDateFilter);
  },
  setDateFilter: function (date) {
    this.date = date;
    this.render();
  },
  filter: function () {
    var self = this;
    if (!self.date) {
      return self.collection;
    } else {
      var array = self.collection.filter(function (model) {
        return model.get('date') === self.date;
      });
      return new Jonglog.Collection.Results(array);
    }
  },
  render: function () {
    var items = [];
    this.filter().forEach(function (model) {
      var resultItem = new Jonglog.View.ResultItemView({
        model: model
      });
      items.push(resultItem.el);
    });
    this.$el.html(items);
  }
});
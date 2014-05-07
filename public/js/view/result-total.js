Jonglog.View.ResultTotalView = Backbone.View.extend({
  el: '#js-total',
  date: '',
  initialize: function () {
    this.listenTo(this.collection, 'add sync destroy', this.render);
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
      return new Jonglog.Collection.ResultList(array);
    }
  },
  render: function () {
    var resultTotalItem = new Jonglog.View.ResultTotalItemView({
      collection: this.filter()
    });
    this.$el.html(resultTotalItem.el);
  }
});
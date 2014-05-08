Jonglog.View.ResultListView = Backbone.View.extend({
  el: '#js-results',
  date: '',
  initialize: function () {
    this.listenTo(this.collection, 'add sync destroy', this.render);
    this.listenTo(Jonglog.mediator, 'filter:date', this.setDateFilter);
  },
  setDateFilter: function (date) {
    this.date = date;
    this.render();
  },
  applyFilter: function () {
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
    var items = [];
    this.applyFilter().forEach(function (model) {
      var resultItem = new Jonglog.View.ResultItemView({
        model: model
      });
      items.push(resultItem.el);
    });
    if (items.length) {
      this.$el.html(items);
    } else {
      Jonglog.dateList.fetch();
      Jonglog.router.navigate('/', {
        trigger: true
      });
    }
  }
});
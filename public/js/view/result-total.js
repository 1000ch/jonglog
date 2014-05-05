Jonglog.View.ResultTotalView = Backbone.View.extend({
  el: '#js-total',
  initialize: function () {
    this.$hokaccha = this.$el.find('#js-total-hokaccha');
    this.$1000ch = this.$el.find('#js-total-1000ch');
    this.$hiloki = this.$el.find('#js-total-hiloki');
    this.$tan_yuki = this.$el.find('#js-total-tan_yuki');
    this.elementMap = {
      'hokaccha': this.$hokaccha,
      '1000ch': this.$1000ch,
      'hiloki': this.$hiloki,
      'tan_yuki': this.$tan_yuki
    };
    this.listenTo(this.collection, 'sync destroy', this.render);
  },
  render: function () {
    var self = this;
    var keys = ['hokaccha', '1000ch', 'hiloki', 'tan_yuki'];
    var json = this.collection.toJSON();
    _.each(keys, function (key) {
      var ranks = _.map(json, function (data) {
        return data[key].rank - 0;
      });
      var points = _.map(json, function (data) {
        return data[key].point - 0;
      });
      var ranksum = _.reduce(ranks, function (a, b) {
        return a + b;
      });
      var pointsum = _.reduce(points, function (a, b) {
        return a + b;
      });
      self.elementMap[key].html(pointsum + '(' + ranksum / ranks.length + ')');
    });
  }
});
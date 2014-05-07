Jonglog.View.ResultTotalItemView = Backbone.View.extend({
  tagName: 'ul',
  className: 'table-view',
  template:
    '<li class="table-view-divider">' +
      '<%= data.date %>総合' +
    '</li>' +
    '<li class="table-view-cell">@hokaccha' +
      '<span class="badge badge-primary">合計:<%= data.hokaccha.score %></span>' +
      '<span class="badge" style="right: 90px;">平均順位:<%= data.hokaccha.rank %></span>' +
    '</li>' +
    '<li class="table-view-cell">@1000ch' +
      '<span class="badge badge-primary">合計:<%= data["1000ch"].score %></span>' +
      '<span class="badge" style="right: 90px;">平均順位:<%= data["1000ch"].rank %></span>' +
    '</li>' +
    '<li class="table-view-cell">@hiloki' +
      '<span class="badge badge-primary">合計:<%= data.hiloki.score %></span>' +
      '<span class="badge" style="right: 90px;">平均順位:<%= data.hiloki.rank %></span>' +
    '</li>' +
    '<li class="table-view-cell">@tan_yuki' +
      '<span class="badge badge-primary">合計:<%= data.tan_yuki.score %></span>' +
      '<span class="badge" style="right: 90px;">平均順位:<%= data.tan_yuki.rank %></span>' +
    '</li>',
  initialize: function () {
    this.render();
  },
  render: function () {
    var keys = ['hokaccha', '1000ch', 'hiloki', 'tan_yuki'];
    var json = this.collection.toJSON();
    var data = {
      date: ''
    };
    _.each(keys, function (key) {
      var ranks = _.map(json, function (data) {
        return data[key].rank - 0;
      });
      var points = _.map(json, function (data) {
        return data[key].point - 0;
      });
      var rankSum = _.reduce(ranks, function (a, b) {
        return a + b;
      });
      var pointSum = _.reduce(points, function (a, b) {
        return a + b;
      });
      data[key] = {
        score: pointSum,
        rank :rankSum / ranks.length
      };
    });
    var html = _.template(this.template, {
      data: data
    });
    this.$el.html(html);
  }
});
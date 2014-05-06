Jonglog.View.ResultItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'table-view-cell',
  template:
    '<date><%= model.date %></date> - No.<%= model.round %><br>' +
    '<%= model.hokaccha.score %><br>' + 
    '<%= model.hokaccha.point %>(<%= model.hokaccha.rank %>)' +
    '<%= model["1000ch"].score %><br>' +
    '<%= model["1000ch"].point %>(<%= model["1000ch"].rank %>)' +
    '<%= model.hiloki.score %><br>' +
    '<%= model.hiloki.point %>(<%= model.hiloki.rank %>)' +
    '<%= model.tan_yuki.score %><br>' +
    '<%= model.tan_yuki.point %>(<%= model.tan_yuki.rank %>)' +
    '<button class="btn btn-negative js-delete" data-id="<%= model._id %>">Delete</button>',
  events: {
    'click .js-delete': 'onClickDelete'
  },
  initialize: function () {
    this.render();
  },
  render: function () {
    var json = this.model.toJSON();
    var html = _.template(this.template, {
      model: json
    });
    this.$el.html(html);
  },
  onClickDelete: function (e) {
    this.model.destroy();
  }
});
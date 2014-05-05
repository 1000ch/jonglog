Jonglog.View.ResultItemView = Backbone.View.extend({
  tagName: 'tr',
  template:
    '<td><%= model.date %></td>' +
    '<td><%= model.round %></td>' +
    '<td>' + 
      '<%= model.hokaccha.score %><br>' + 
      '<%= model.hokaccha.point %>(<%= model.hokaccha.rank %>)' +
    '</td>' +
    '<td>' + 
      '<%= model["1000ch"].score %><br>' +
      '<%= model["1000ch"].point %>(<%= model["1000ch"].rank %>)' + 
    '</td>' +
    '<td>' +
      '<%= model.hiloki.score %><br>' +
      '<%= model.hiloki.point %>(<%= model.hiloki.rank %>)' + 
    '</td>' +
    '<td>' + 
      '<%= model.tan_yuki.score %><br>' +
      '<%= model.tan_yuki.point %>(<%= model.tan_yuki.rank %>)' +
    '</td>' +
    '<td><button class="btn btn-warning js-delete" data-id="<%= model._id %>">Delete</button></td>',
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
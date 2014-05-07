Jonglog.View.ResultItemView = Backbone.View.extend({
  tagName: 'ul',
  className: 'table-view',
  template:
    '<li class="table-view-divider">'+ 
      '<%= model.date %> - <%= model.round %>半荘目' + 
    '</li>' +
    '<li class="table-view-cell">@hokaccha' + 
      '<span class="badge" style="right: 120px;">得点:<%= model.hokaccha.score %></span>' +
      '<span class="badge" style="right: 60px;">順位:<%= model.hokaccha.rank %></span>' +
      '<span class="badge badge-primary"><%= model.hokaccha.point %></span>' +
    '</li>' +
    '<li class="table-view-cell">@1000ch' + 
      '<span class="badge" style="right: 120px;">得点:<%= model["1000ch"].score %></span>' +
      '<span class="badge" style="right: 60px;">順位:<%= model["1000ch"].rank %></span>' +
      '<span class="badge badge-primary"><%= model["1000ch"].point %></span>' +
    '</li>' +
    '<li class="table-view-cell">@hiloki' +
      '<span class="badge" style="right: 120px;">得点:<%= model.hiloki.score %></span>' +
      '<span class="badge" style="right: 60px;">順位:<%= model.hiloki.rank %></span>' +
      '<span class="badge badge-primary"><%= model.hiloki.point %></span>' +
    '</li>' +
    '<li class="table-view-cell">@tan_yuki' +
      '<span class="badge" style="right: 120px;">得点:<%= model.tan_yuki.score %></span>' +
      '<span class="badge" style="right: 60px;">順位:<%= model.tan_yuki.rank %></span>' +
      '<span class="badge badge-primary"><%= model.tan_yuki.point %></span>' +
    '</li>' +
    '<li class="table-view-cell">'+
      '　<button class="btn btn-negative js-delete" data-id="<%= model._id %>">Delete</button>' +
    '</li>',
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
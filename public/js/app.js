var Jonglog = {
  Model: {},
  Collection: {},
  View: {},
  mediator: _.extend({}, Backbone.Events)
};

Jonglog.Model.Result = Backbone.Model.extend({
  idAttribute: '_id',
  validate: function (attrs) {
    if (!attrs.date) {
      return '日時が不正です';
    }
    if (!attrs.round) {
      return '半荘数が不正です';
    }
    if (!_.isNumber(attrs.hokaccha - 0)) {
      return 'hokacchaの得点が不正です'
    }
    if (!_.isNumber(attrs['1000ch'] - 0)) {
      return '1000chの得点が不正です'
    }
    if (!_.isNumber(attrs.hiloki - 0)) {
      return 'hilokiの得点が不正です'
    }
    if (!_.isNumber(attrs.tan_yuki - 0)) {
      return 'tan_yukiの得点が不正です';
    }
  }
});

Jonglog.Collection.Results = Backbone.Collection.extend({
  model: Jonglog.Model.Result,
  url: '/api/list'
});

Jonglog.View.SubmitFormView = Backbone.View.extend({
  el: '#js-form',
  events: {
    'click #js-submit': 'onSubmit'
  },
  initialize: function () {
    
  },
  onSubmit: function (e) {
    e.preventDefault();
    this.collection.create({
      date: this.$el.find('#js-date').val(),
      round: this.$el.find('#js-round').val(),
      hokaccha: this.$el.find('#js-score-hokaccha').val(),
      '1000ch': this.$el.find('#js-score-1000ch').val(),
      hiloki: this.$el.find('#js-score-hiloki').val(),
      tan_yuki: this.$el.find('#js-score-tan_yuki').val()
    });
  }
});

Jonglog.View.ResultItemView = Backbone.View.extend({
  tagName: 'tr',
  template: '<td><%= model.date %></td>' +
            '<td><%= model.round %></td>' +
            '<td><%= model.hokaccha %></td>' +
            '<td><%= model["1000ch"] %></td>' +
            '<td><%= model.hiloki %></td>' +
            '<td><%= model.tan_yuki %></td>' +
            '<td><button class="btn btn-warning js-delete" data-id="<%= model._id %>">Delete</button></td>',
  events: {
    'click .js-delete': 'onDeleteClick'
  },
  initialize: function () {
    this.render();
  },
  render: function () {
    var html = _.template(this.template, {
      model: this.model.toJSON()
    });
    this.$el.html(html);
  },
  onDeleteClick: function (e) {
    this.model.destroy();
  }
});

Jonglog.View.ResultListView = Backbone.View.extend({
  el: '#js-results',
  events: {
    'click .js-delete': 'onDelete'
  },
  initialize: function () {
    this.template = _.template($('#js-result').html());
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'destroy', this.render);
  },
  render: function () {
    var items = [];
    this.collection.each(function (model) {
      var resultItemView = new Jonglog.View.ResultItemView({
        model: model
      });
      items.push(resultItemView.el);
    });
    this.$el.find('tbody').html(items);
  }
});

Jonglog.Router = Backbone.Router.extend({});
Jonglog.results = new Jonglog.Collection.Results();
Jonglog.submitFormView = new Jonglog.View.SubmitFormView({
  collection: Jonglog.results
});
Jonglog.resultListView = new Jonglog.View.ResultListView({
  collection: Jonglog.results
});

$(function () {
  $.when(
    Jonglog.results.fetch()
  ).done(function () {
    Backbone.history.start({
      pushState: false
    });
  });
});
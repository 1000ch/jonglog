var Jonglog = {
  Model: {},
  Collection: {},
  View: {},
  mediator: _.extend({}, Backbone.Events)
};
Jonglog.Model.Date = Backbone.Model.extend({
  parse: function (date) {
    return {
      date: date
    };
  }
});

Jonglog.Collection.DateList = Backbone.Collection.extend({
  model: Jonglog.Model.Date,
  url: '/api/date'
});
Jonglog.Model.Result = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: function () {
    return {
      date: moment().format('YYYY-MM-DD')
    };
  },
  keys: ['hokaccha', '1000ch', 'hiloki', 'tan_yuki'],
  initialize: function () {
    this.setRank();
    this.setPoint();
  },
  validate: function (attributes) {
    if (!attributes.date) {
      return '日時が不正です';
    }
    if (!attributes.round) {
      return '半荘数が不正です';
    }

    var total = 0;
    for (var i = 0, l = this.keys.length;i < l;i++) {

      // key is name
      var key = this.keys[i];
      var score = attributes[key].score;

      if (score === '') {
        return key + 'の得点が未入力です'
      }
      if (!_.isNumber(score - 0)) {
        return key + 'の得点が不正です'
      }
      total += score | 0;
    }

    if (total < 100000) {
      return '得点が不足しています';
    } else if (total > 100000) {
      return '得点が超過しています';
    }
  },
  setRank: function () {
    var self = this;
    var scores = _.map(self.keys, function (key) {
      return self.attributes[key].score - 0;
    });
    scores.sort(function (a, b) {
      return b - a;
    });
    _.each(self.keys, function (key) {
      var score = self.attributes[key].score - 0;
      self.attributes[key].rank = scores.indexOf(score) + 1;
    });
  },
  setPoint: function () {
    var self = this;
    var array = _.map(self.keys, function (key) {
      return {
        key: key,
        score: self.attributes[key].score - 0,
        rank: self.attributes[key].rank - 0
      };
    });

    var first, second, third, fourth;
    var firsts = _.filter(array, function (data) {
      return data.rank === 1;
    });
    var seconds = _.filter(array, function (data) {
      return data.rank === 2;
    });
    var thirds = _.filter(array, function (data) {
      return data.rank === 3;
    });
    var fourths = _.filter(array, function (data) {
      return data.rank === 4;
    });

    // 1, 1, 1, 4
    // 1, 1, 3, 3
    // 1, 1, 3, 4
    // 1, 2, 2, 2
    // 1, 2, 2, 4
    // 1, 2, 3, 3
    // 1, 2, 3, 4
    switch (firsts.length) {
      case 1:
        if (seconds.length === 3) {
          fourth = seconds[2];
          third = seconds[1];
          second = seconds[0];
          first = firsts[0];
        } else if (seconds.length === 2 && fourths.length === 1) {
          fourth = fourths[0];
          third = seconds[1];
          second = seconds[0];
          first = firsts[0];
        } else if (seconds.length === 1) {
          if (thirds.length === 2 && fourths.length === 0) {
            fourth = fourths[1];
            third = fourths[0];
            second = seconds[0];
            first = firsts[0];
          } else if (thirds.length === 1 && fourths.length === 1) {
            fourth = fourths[0];
            third = thirds[0];
            second = seconds[0];
            first = firsts[0];
          }
        }
        break;
      case 2:
        if (thirds.length === 2 && fourths.length === 0) {
          fourth = thirds[1];
          third = thirds[0];
          second = firsts[1];
          first = firsts[0];
        } else if (thirds.length === 1 && fourths.length === 1) {
          fourth = fourths[0];
          third = thirds[0];
          second = firsts[1];
          first = firsts[0];
        }
        break;
      case 3:
        fourth = fourths[0];
        third = firsts[2];
        second = firsts[1];
        first = firsts[0];
        break;
    }
    fourth.point = Math.round((fourth.score - 30000) / 1000) - 20;
    third.point = Math.round((third.score - 30000) / 1000) - 10;
    second.point = Math.round((second.score - 30000) / 1000) + 10;
    first.point = 0 - second.point - third.point - fourth.point;

    self.attributes[fourth.key].point = fourth.point;
    self.attributes[third.key].point = third.point;
    self.attributes[second.key].point = second.point;
    self.attributes[first.key].point = first.point;
  }
});

Jonglog.Collection.ResultList = Backbone.Collection.extend({
  model: Jonglog.Model.Result,
  url: '/api/result'
});Jonglog.View.RegisterView = Backbone.View.extend({
  el: '#js-register',
  events: {
    'submit form': 'onSubmit'
  },
  initialize: function () {

    this.$date = this.$el.find('#js-date').val(moment().format('YYYY-MM-DD'));
    this.$round = this.$el.find('#js-round');
    this.$hokaccha = this.$el.find('#js-score-hokaccha');
    this.$1000ch = this.$el.find('#js-score-1000ch');
    this.$hiloki = this.$el.find('#js-score-hiloki');
    this.$tan_yuki = this.$el.find('#js-score-tan_yuki');

    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);
    this.listenTo(this.collection, 'invalid', this.onError);
  },
  hide: function () {
    this.$el.hide();
  },
  render: function () {
    this.$el.show();
  },
  onSubmit: function (e) {
    e.preventDefault();

    this.collection.create({
      date: this.$date.val(),
      round: this.$round.val(),
      hokaccha: {
        score: this.$hokaccha.val()
      },
      '1000ch': {
        score: this.$1000ch.val()
      },
      hiloki: {
        score: this.$hiloki.val()
      },
      tan_yuki: {
        score: this.$tan_yuki.val()
      }
    });
    Jonglog.dateList.fetch();
  },
  onError: function (model, message) {
    alert(message);
  }
});
Jonglog.View.HeaderView = Backbone.View.extend({
  el: '#js-header',
  events: {
    'click a': 'onClick',
    'click #js-refresh': 'onRefresh'
  },
  initialize: function () {
    this.listenTo(Jonglog.mediator, 'route:index', this.renderIndex);
    this.listenTo(Jonglog.mediator, 'route:result', this.renderResult);
    this.render();
  },
  render: function () {
    this.$el.show();
  },
  renderIndex: function () {
    this.$el.find('a').hide();
    this.$el.find('.title').text('結果一覧');
  },
  renderResult: function () {
    this.$el.find('a').show();
    this.$el.find('.title').text('結果');
  },
  onClick: function (e) {
    var link = e.target.getAttribute('data-href');
    Jonglog.mediator.trigger('route:change', link);
  },
  onRefresh: function (e) {
    location.reload();
  }
});
Jonglog.View.DateListView = Backbone.View.extend({
  el: '#js-date-list',
  template: 
    '<ul class="table-view">' +
      '<% _.each(models, function (model) { %>' +
        '<li class="table-view-cell">' +
          '<a data-href=' + '"<%= model.get("date") %>"' + 'class="navigate-right"><%= model.get("date") %></a>' +
        '</li>' +
      '<% }); %>' +
    '</ul>',
  events: {
    'click a': 'onClick'
  },
  initialize: function () {
    this.listenTo(this.collection, 'add sync destroy', this.render);
    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);
  },
  render: function () {
    var html = _.template(this.template, {
      models: this.collection.models
    });
    this.$el.html(html).show();
  },
  hide: function () {
    this.$el.hide();
  },
  onClick: function (e) {
    var link = e.target.getAttribute('data-href');
    Jonglog.mediator.trigger('route:change', link);
  }
});
Jonglog.View.ResultView = Backbone.View.extend({
  el: '#js-result',
  initialize: function () {
    this.listView = new Jonglog.View.ResultListView({
      collection: Jonglog.resultList
    });
    this.totalView = new Jonglog.View.ResultTotalView({
      collection: Jonglog.resultList
    });

    this.listView.$el.hide();
    this.totalView.$el.hide();

    this.listenTo(Jonglog.mediator, 'route:index', this.hide);
    this.listenTo(Jonglog.mediator, 'route:result', this.render);
  },
  hide: function () {
    this.listView.$el.hide();
    this.totalView.$el.hide();
  },
  render: function () {
    this.listView.$el.show();
    this.totalView.$el.show();
  }
});
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
    'click .js-delete': 'onDelete'
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
  onDelete: function (e) {
    this.model.destroy();
  }
});
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
Jonglog.View.ResultTotalItemView = Backbone.View.extend({
  tagName: 'ul',
  className: 'table-view',
  template:
    '<li class="table-view-divider">' +
      '総合' +
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
    var data = {};
    _.each(keys, function (key) {
      var ranks = _.map(json, function (data) {
        return data[key].rank - 0;
      });
      var points = _.map(json, function (data) {
        return data[key].point - 0;
      });
      if (ranks.length) {
        var rankSum = _.reduce(ranks, function (a, b) {
          return a + b;
        });
      }
      var score = 0;
      if (points.length) {
        score = _.reduce(points, function (a, b) {
          return a + b;
        });
      }
      var rank = 0;
      if (rankSum && ranks.length) {
        rank = rankSum / ranks.length;
      }
      data[key] = {
        score: score,
        rank: rank
      };
    });
    var html = _.template(this.template, {
      data: data
    });
    this.$el.html(html);
  }
});
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
    var resultTotalItem = new Jonglog.View.ResultTotalItemView({
      collection: this.applyFilter()
    });
    this.$el.html(resultTotalItem.el);
  }
});
Jonglog.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    ':date': 'date'
  },
  initialize: function () {
    this.listenTo(Jonglog.mediator, 'route:change', this.onRoute);
  },
  onRoute: function (url) {
    this.navigate(url, {
      trigger: true
    });
  },
  index: function () {
    Jonglog.mediator.trigger('route:index');
  },
  date: function (date) {
    Jonglog.mediator.trigger('route:result');
    Jonglog.mediator.trigger('filter:date', date);
  }
});

Jonglog.router = new Jonglog.Router();
Jonglog.dateList = new Jonglog.Collection.DateList();
Jonglog.resultList = new Jonglog.Collection.ResultList();
Jonglog.headerView = new Jonglog.View.HeaderView();
Jonglog.dateListView = new Jonglog.View.DateListView({
  collection: Jonglog.dateList
});
Jonglog.resultView = new Jonglog.View.ResultView();
Jonglog.registerView = new Jonglog.View.RegisterView({
  collection: Jonglog.resultList
});

$(function () {
  $.when(
    Jonglog.dateList.fetch(),
    Jonglog.resultList.fetch()
  ).done(function () {
    Backbone.history.start({
      pushState: false
    });
  });
});

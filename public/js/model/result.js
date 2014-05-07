Jonglog.Model.Result = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: function () {
    return {
      date: moment().format('YYYY-MM-DD'),
      round: 1,
      hokaccha: {
        score: 25000,
        rank: 1,
        point: 0
      },
      '1000ch': {
        score: 25000,
        rank: 1,
        point: 0
      },
      hiloki: {
        score: 25000,
        rank: 1,
        point: 0
      },
      tan_yuki: {
        score: 25000,
        rank: 1,
        point: 0
      }
    };
  },
  keys: ['hokaccha', '1000ch', 'hiloki', 'tan_yuki'],
  initialize: function () {
    this.setRank();
    this.setPoint();
  },
  validate: function (attrs) {
    if (!attrs.date) {
      return '日時が不正です';
    }
    if (!attrs.round) {
      return '半荘数が不正です';
    }
    if (!_.isNumber(attrs.hokaccha.score - 0)) {
      return 'hokacchaの得点が不正です'
    }
    if (!_.isNumber(attrs['1000ch'].score - 0)) {
      return '1000chの得点が不正です'
    }
    if (!_.isNumber(attrs.hiloki.score - 0)) {
      return 'hilokiの得点が不正です'
    }
    if (!_.isNumber(attrs.tan_yuki.score - 0)) {
      return 'tan_yukiの得点が不正です';
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
    array = _.sortBy(array, function (item) {
      return (item.rank - 0);
    });
    var points = [];
    while (array.length) {
      var item = array.pop();
      switch (item.rank) {
        case 4:
          points[4] =  Math.round((item.score - 30000) / 1000) - 20;
          break;
        case 3:
          points[3] = Math.round((item.score - 30000) / 1000) - 10;
          break;
        case 2:
          points[2] = Math.round((item.score - 30000) / 1000) + 10;
          break;
        case 1:
          points[1] = 0 - points[2] - points[3] - points[4];
          break;
      }
    }
    _.each(self.keys, function (key) {
      self.attributes[key].point = points[self.attributes[key].rank];
    });
  }
});

Jonglog.Collection.Results = Backbone.Collection.extend({
  model: Jonglog.Model.Result,
  url: '/api/list'
});
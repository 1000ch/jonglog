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
      var key = this.keys[i];
      var score = attributes[key].score;

      if (score === '') {
        return key + 'の得点が未入力です'
      }
      if (!_.isNumber(score - 0)) {
        return key + 'の得点が不正です'
      }
      total += score;
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
    array = _.sortBy(array, function (item) {
      return (item.rank - 0);
    });
    var points = [];
    while (array.length) {
      var item = array.pop();
      switch (item.rank) {
        case 4:
          points[4] = Math.round((item.score - 30000) / 1000) - 20;
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

Jonglog.Collection.ResultList = Backbone.Collection.extend({
  model: Jonglog.Model.Result,
  url: '/api/result'
});
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
});